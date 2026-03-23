import { FieldPath } from 'firebase-admin/firestore'
import type { QueryDocumentSnapshot, WriteBatch } from 'firebase-admin/firestore'
import { db } from '../lib/firebase/admin'
import {
  RETENTION_DATASETS,
  getRetentionPolicy,
  isRetentionDataset,
  type RetentionDataset,
} from '../lib/privacy/retention-policies'
import { applyRetentionMetadata } from '../lib/privacy/retention'

type CliArgs = {
  apply: boolean
  dryRun: boolean
  batchSize: number
  env?: string
  project?: string
  dataset: RetentionDataset | 'all'
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

function getSourceCreatedAt(data: Record<string, unknown>): Date {
  const createdAt = typeof data.createdAt === 'string' ? data.createdAt : null
  const appliedAt = typeof data.appliedAt === 'string' ? data.appliedAt : null
  const source = createdAt ?? appliedAt ?? new Date().toISOString()
  const parsed = new Date(source)
  if (Number.isNaN(parsed.getTime())) return new Date()
  return parsed
}

async function collectMissingDocs(dataset: RetentionDataset): Promise<QueryDocumentSnapshot[]> {
  const collectionRef = db().collection(dataset)
  const docs: QueryDocumentSnapshot[] = []
  let lastDoc: QueryDocumentSnapshot | null = null

  while (true) {
    let query = collectionRef.orderBy(FieldPath.documentId()).limit(500)
    if (lastDoc) query = query.startAfter(lastDoc)

    const snap = await query.get()
    if (snap.empty) break

    for (const docSnap of snap.docs) {
      const data = docSnap.data() as { retentionUntil?: unknown; status?: unknown }
      const retentionUntil = typeof data.retentionUntil === 'string' ? data.retentionUntil : null
      const status = typeof data.status === 'string' ? data.status : null
      if (!retentionUntil || !status) {
        docs.push(docSnap)
      }
    }
    lastDoc = snap.docs[snap.docs.length - 1] ?? null
  }

  return docs
}

async function backfillDataset(
  dataset: RetentionDataset,
  docs: QueryDocumentSnapshot[],
  batchSize: number,
): Promise<number> {
  const policy = getRetentionPolicy(dataset)
  let updated = 0

  for (let i = 0; i < docs.length; i += batchSize) {
    const slice = docs.slice(i, i + batchSize)
    const batch: WriteBatch = db().batch()

    for (const docSnap of slice) {
      const data = docSnap.data() as Record<string, unknown>
      const withRetention = applyRetentionMetadata(data, policy, getSourceCreatedAt(data))
      batch.set(docSnap.ref, withRetention, { merge: true })
    }

    await batch.commit()
    updated += slice.length
  }

  return updated
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2))
  const environment = args.env ?? 'unknown'
  const project = args.project ?? 'unknown'

  if (args.apply && !args.project) {
    throw new Error('Apply mode requires explicit --project <firebase-project-id>')
  }

  const datasets = args.dataset === 'all' ? RETENTION_DATASETS : [args.dataset]
  const summaries: Array<{ dataset: RetentionDataset; missingCount: number; updatedCount: number }> = []

  for (const dataset of datasets) {
    const missingDocs = await collectMissingDocs(dataset)
    if (args.dryRun) {
      summaries.push({ dataset, missingCount: missingDocs.length, updatedCount: 0 })
      continue
    }
    const updatedCount = await backfillDataset(dataset, missingDocs, args.batchSize)
    summaries.push({ dataset, missingCount: missingDocs.length, updatedCount })
  }

  console.log(
    JSON.stringify(
      {
        mode: args.dryRun ? 'dry-run' : 'apply',
        environment,
        project,
        dataset: args.dataset,
        batchSize: args.batchSize,
        summaries,
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error('[backfill-retention-metadata] failed:', error)
  process.exit(1)
})
