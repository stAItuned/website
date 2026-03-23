import type { QueryDocumentSnapshot, WriteBatch } from 'firebase-admin/firestore'
import { FieldPath } from 'firebase-admin/firestore'
import { db } from '../lib/firebase/admin'
import {
  RETENTION_DATASETS,
  isRetentionDataset,
  getRetentionPolicy,
  type RetentionDataset,
} from '../lib/privacy/retention-policies'
import { isExpired } from '../lib/privacy/retention'

type CliArgs = {
  apply: boolean
  dryRun: boolean
  batchSize: number
  env?: string
  project?: string
  dataset: RetentionDataset | 'all'
}

type DatasetSummary = {
  dataset: RetentionDataset
  policyTtlDays: number
  policyAction: string
  documentsScanned: number
  expiredCount: number
  missingRetentionCount: number
  deletedCount: number
}

type RetentionRunResult = {
  mode: 'dry-run' | 'apply'
  environment: string
  project: string
  dataset: RetentionDataset | 'all'
  batchSize: number
  summaries: DatasetSummary[]
  runId?: string
  status: 'completed' | 'failed'
  durationMs: number
}

function parseArgs(argv: string[]): CliArgs {
  let apply = false
  let dryRun = true
  let batchSize = 300
  let env: string | undefined
  let project: string | undefined
  let dataset: RetentionDataset | 'all' = 'all'

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === '--apply') {
      apply = true
      dryRun = false
      continue
    }
    if (arg === '--dry-run') {
      dryRun = true
      apply = false
      continue
    }
    if (arg.startsWith('--batch-size=')) {
      const value = Number(arg.split('=')[1])
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error(`Invalid --batch-size value: ${arg}`)
      }
      batchSize = Math.floor(value)
      continue
    }
    if (arg === '--batch-size') {
      const value = Number(argv[i + 1])
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error('Invalid --batch-size value')
      }
      batchSize = Math.floor(value)
      i += 1
      continue
    }
    if (arg.startsWith('--env=')) {
      env = arg.split('=')[1]
      continue
    }
    if (arg === '--env') {
      env = argv[i + 1]
      i += 1
      continue
    }
    if (arg.startsWith('--project=')) {
      project = arg.split('=')[1]
      continue
    }
    if (arg === '--project') {
      project = argv[i + 1]
      i += 1
      continue
    }
    if (arg.startsWith('--dataset=')) {
      const value = arg.split('=')[1]
      if (value !== 'all' && !isRetentionDataset(value)) {
        throw new Error(`Invalid --dataset value: ${value}`)
      }
      dataset = value
      continue
    }
    if (arg === '--dataset') {
      const value = argv[i + 1]
      if (value !== 'all' && !isRetentionDataset(value)) {
        throw new Error(`Invalid --dataset value: ${value}`)
      }
      dataset = value
      i += 1
      continue
    }
  }

  return { apply, dryRun, batchSize, env, project, dataset }
}

async function collectSummary(dataset: RetentionDataset, nowIso: string): Promise<{
  summary: DatasetSummary
  expiredDocs: QueryDocumentSnapshot[]
}> {
  const policy = getRetentionPolicy(dataset)
  const collectionRef = db().collection(dataset)

  let documentsScanned = 0
  let expiredCount = 0
  let missingRetentionCount = 0
  const expiredDocs: QueryDocumentSnapshot[] = []
  let lastDoc: QueryDocumentSnapshot | null = null

  while (true) {
    let query = collectionRef.orderBy(FieldPath.documentId()).limit(500)
    if (lastDoc) {
      query = query.startAfter(lastDoc)
    }

    const snap = await query.get()
    if (snap.empty) break

    for (const docSnap of snap.docs) {
      documentsScanned += 1
      const data = docSnap.data() as { retentionUntil?: unknown; status?: unknown }
      const retentionUntil = typeof data.retentionUntil === 'string' ? data.retentionUntil : null
      const status = typeof data.status === 'string' ? data.status : null

      if (!retentionUntil) {
        missingRetentionCount += 1
        continue
      }
      if (status === 'deleted') continue
      if (isExpired(nowIso, retentionUntil)) {
        expiredCount += 1
        expiredDocs.push(docSnap)
      }
    }

    lastDoc = snap.docs[snap.docs.length - 1] ?? null
  }

  return {
    summary: {
      dataset,
      policyTtlDays: policy.ttlDays,
      policyAction: policy.action,
      documentsScanned,
      expiredCount,
      missingRetentionCount,
      deletedCount: 0,
    },
    expiredDocs,
  }
}

async function deleteDocsInBatches(docs: QueryDocumentSnapshot[], batchSize: number): Promise<number> {
  let deleted = 0

  for (let i = 0; i < docs.length; i += batchSize) {
    const slice = docs.slice(i, i + batchSize)
    const batch: WriteBatch = db().batch()
    for (const docSnap of slice) {
      batch.delete(docSnap.ref)
    }
    await batch.commit()
    deleted += slice.length
  }

  return deleted
}

async function writeRunEvidence(
  runId: string,
  payload: Record<string, unknown>,
): Promise<void> {
  await db()
    .collection('compliance_ops')
    .doc('retention_runs')
    .collection('runs')
    .doc(runId)
    .set(payload, { merge: true })
}

async function main(): Promise<void> {
  const start = Date.now()
  const args = parseArgs(process.argv.slice(2))
  const environment = args.env ?? 'unknown'
  const project = args.project ?? 'unknown'
  const nowIso = new Date().toISOString()
  const datasets = args.dataset === 'all' ? RETENTION_DATASETS : [args.dataset]

  if (args.apply) {
    if (environment !== 'prod') {
      throw new Error('Apply mode requires explicit --env prod')
    }
    if (!args.project) {
      throw new Error('Apply mode requires explicit --project <firebase-project-id>')
    }
  }

  const summaries: DatasetSummary[] = []
  const docsByDataset = new Map<RetentionDataset, QueryDocumentSnapshot[]>()

  for (const dataset of datasets) {
    const { summary, expiredDocs } = await collectSummary(dataset, nowIso)
    summaries.push(summary)
    docsByDataset.set(dataset, expiredDocs)
  }

  if (args.dryRun) {
    const output: RetentionRunResult = {
      mode: 'dry-run',
      environment,
      project,
      dataset: args.dataset,
      batchSize: args.batchSize,
      summaries,
      status: 'completed',
      durationMs: Date.now() - start,
    }
    console.log(JSON.stringify(output, null, 2))
    return
  }

  const runId = `retention-${new Date().toISOString().replace(/[:.]/g, '-')}`
  await writeRunEvidence(runId, {
    runId,
    executedAt: nowIso,
    environment,
    project,
    dataset: args.dataset,
    batchSize: args.batchSize,
    mode: 'apply',
    status: 'running',
    summaries,
  })

  try {
    for (const summary of summaries) {
      const docs = docsByDataset.get(summary.dataset) ?? []
      summary.deletedCount = await deleteDocsInBatches(docs, args.batchSize)
    }

    const output: RetentionRunResult = {
      mode: 'apply',
      environment,
      project,
      dataset: args.dataset,
      batchSize: args.batchSize,
      summaries,
      runId,
      status: 'completed',
      durationMs: Date.now() - start,
    }

    await writeRunEvidence(runId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      durationMs: output.durationMs,
      summaries,
    })

    console.log(JSON.stringify(output, null, 2))
  } catch (error) {
    const durationMs = Date.now() - start
    await writeRunEvidence(runId, {
      status: 'failed',
      failedAt: new Date().toISOString(),
      durationMs,
      error: error instanceof Error ? error.message : String(error),
      summaries,
    })
    throw error
  }
}

main().catch((error) => {
  console.error('[retention-lifecycle] failed:', error)
  process.exit(1)
})
