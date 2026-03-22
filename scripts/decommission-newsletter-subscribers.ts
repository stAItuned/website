import { FieldPath, type QueryDocumentSnapshot, type WriteBatch } from 'firebase-admin/firestore'
import { db } from '../lib/firebase/admin'

type CliArgs = {
  apply: boolean
  dryRun: boolean
  batchSize: number
  env?: string
  project?: string
}

type SubscribedAtRange = {
  first: string | null
  last: string | null
}

function parseArgs(argv: string[]): CliArgs {
  let apply = false
  let dryRun = true
  let batchSize = 300
  let env: string | undefined
  let project: string | undefined

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
  }

  return { apply, dryRun, batchSize, env, project }
}

async function getSubscribedAtRange(): Promise<SubscribedAtRange> {
  const collectionRef = db().collection('newsletter_subscribers')

  try {
    const firstSnap = await collectionRef.orderBy('subscribedAt', 'asc').limit(1).get()
    const lastSnap = await collectionRef.orderBy('subscribedAt', 'desc').limit(1).get()
    const first = firstSnap.docs[0]?.get('subscribedAt') ?? null
    const last = lastSnap.docs[0]?.get('subscribedAt') ?? null

    return {
      first: typeof first === 'string' ? first : first?.toString?.() ?? null,
      last: typeof last === 'string' ? last : last?.toString?.() ?? null,
    }
  } catch {
    // Field may be missing or heterogeneous in legacy docs.
    return { first: null, last: null }
  }
}

async function getDocumentsFound(): Promise<number> {
  const countSnap = await db().collection('newsletter_subscribers').count().get()
  return countSnap.data().count
}

async function writeEvidenceRun(
  runId: string,
  payload: Record<string, unknown>,
): Promise<void> {
  await db()
    .collection('compliance_ops')
    .doc('newsletter_decommission_runs')
    .collection('runs')
    .doc(runId)
    .set(payload, { merge: true })
}

async function deleteInBatches(batchSize: number): Promise<number> {
  const collectionRef = db().collection('newsletter_subscribers')
  let deleted = 0
  let lastDoc: QueryDocumentSnapshot | null = null

  while (true) {
    let query = collectionRef.orderBy(FieldPath.documentId()).limit(batchSize)
    if (lastDoc) {
      query = query.startAfter(lastDoc)
    }

    const snap = await query.get()
    if (snap.empty) break

    const batch: WriteBatch = db().batch()
    for (const docSnap of snap.docs) {
      batch.delete(docSnap.ref)
    }
    await batch.commit()

    deleted += snap.size
    lastDoc = snap.docs[snap.docs.length - 1] ?? null
  }

  return deleted
}

async function main(): Promise<void> {
  const start = Date.now()
  const args = parseArgs(process.argv.slice(2))
  const executor = process.env.USER ?? 'unknown'
  const environment = args.env ?? 'unknown'
  const project = args.project ?? 'unknown'

  if (args.apply) {
    if (environment !== 'prod') {
      throw new Error('Apply mode requires explicit --env prod')
    }
    if (!args.project) {
      throw new Error('Apply mode requires explicit --project <firebase-project-id>')
    }
  }

  const documentsFound = await getDocumentsFound()
  const subscribedAtRange = await getSubscribedAtRange()

  if (args.dryRun) {
    console.log(
      JSON.stringify(
        {
          mode: 'dry-run',
          environment,
          project,
          batchSize: args.batchSize,
          documentsFound,
          subscribedAtRange,
        },
        null,
        2,
      ),
    )
    return
  }

  const runId = `run-${new Date().toISOString().replace(/[:.]/g, '-')}`
  await writeEvidenceRun(runId, {
    runId,
    executedAt: new Date().toISOString(),
    executor,
    environment,
    project,
    batchSize: args.batchSize,
    documentsFound,
    documentsDeleted: 0,
    status: 'running',
    durationMs: 0,
    subscribedAtRange,
  })

  try {
    const documentsDeleted = await deleteInBatches(args.batchSize)
    const durationMs = Date.now() - start

    await writeEvidenceRun(runId, {
      documentsDeleted,
      status: 'completed',
      durationMs,
      completedAt: new Date().toISOString(),
    })

    console.log(
      JSON.stringify(
        {
          mode: 'apply',
          runId,
          environment,
          project,
          documentsFound,
          documentsDeleted,
          durationMs,
        },
        null,
        2,
      ),
    )
  } catch (error) {
    const durationMs = Date.now() - start
    await writeEvidenceRun(runId, {
      status: 'failed',
      durationMs,
      error: error instanceof Error ? error.message : String(error),
      failedAt: new Date().toISOString(),
    })
    throw error
  }
}

main().catch((error) => {
  console.error('[newsletter-decommission] failed:', error)
  process.exit(1)
})
