import * as dotenv from 'dotenv'
import { dbDefault } from '../lib/firebase/admin'

dotenv.config()

type ArticleDocData = {
  pageViewsFirstParty?: number
  pageViews?: number
  pageViewsGA?: number
  updatedAt?: string
  [key: string]: unknown
}

function toNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function computeBaseline(data: ArticleDocData): number {
  return Math.max(
    toNumber(data.pageViewsFirstParty),
    toNumber(data.pageViews),
    toNumber(data.pageViewsGA),
  )
}

async function run() {
  const apply = process.argv.includes('--apply')

  console.log('[backfill-pageviews-first-party] mode:', apply ? 'APPLY' : 'DRY_RUN')
  console.log('[backfill-pageviews-first-party] reading collection: articles')

  const snapshot = await dbDefault().collection('articles').get()

  let scanned = 0
  let candidates = 0
  let toUpdate = 0
  let alreadyAligned = 0
  let skippedNoViews = 0

  const updates: Array<{ id: string; before: number; next: number }> = []

  snapshot.forEach((doc) => {
    scanned += 1
    const data = (doc.data() ?? {}) as ArticleDocData

    const currentFirstParty = toNumber(data.pageViewsFirstParty)
    const baseline = computeBaseline(data)
    const hasAnyViewSignal =
      toNumber(data.pageViewsFirstParty) > 0 ||
      toNumber(data.pageViews) > 0 ||
      toNumber(data.pageViewsGA) > 0

    if (!hasAnyViewSignal) {
      skippedNoViews += 1
      return
    }

    candidates += 1
    if (currentFirstParty >= baseline) {
      alreadyAligned += 1
      return
    }

    toUpdate += 1
    updates.push({
      id: doc.id,
      before: currentFirstParty,
      next: baseline,
    })
  })

  console.log('[backfill-pageviews-first-party] scanned:', scanned)
  console.log('[backfill-pageviews-first-party] candidates:', candidates)
  console.log('[backfill-pageviews-first-party] already_aligned:', alreadyAligned)
  console.log('[backfill-pageviews-first-party] to_update:', toUpdate)
  console.log('[backfill-pageviews-first-party] skipped_no_views:', skippedNoViews)

  if (updates.length > 0) {
    console.log('[backfill-pageviews-first-party] sample updates:')
    updates.slice(0, 10).forEach((u) => {
      console.log(`  - ${u.id}: ${u.before} -> ${u.next}`)
    })
  }

  if (!apply) {
    console.log('[backfill-pageviews-first-party] dry run complete. Re-run with --apply to write changes.')
    return
  }

  if (updates.length === 0) {
    console.log('[backfill-pageviews-first-party] nothing to update.')
    return
  }

  console.log('[backfill-pageviews-first-party] applying updates...')
  let batch = dbDefault().batch()
  let batchOps = 0
  let committed = 0
  const maxBatchOps = 450

  for (const update of updates) {
    const ref = dbDefault().collection('articles').doc(update.id)
    batch.set(
      ref,
      {
        pageViewsFirstParty: update.next,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    )
    batchOps += 1

    if (batchOps >= maxBatchOps) {
      await batch.commit()
      committed += batchOps
      batch = dbDefault().batch()
      batchOps = 0
    }
  }

  if (batchOps > 0) {
    await batch.commit()
    committed += batchOps
  }

  console.log('[backfill-pageviews-first-party] committed updates:', committed)
  console.log('[backfill-pageviews-first-party] apply complete.')
}

run().catch((error) => {
  console.error('[backfill-pageviews-first-party] failed:', error)
  process.exit(1)
})
