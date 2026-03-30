import {
  listKnownTrackedPublicPages,
  PUBLIC_PAGE_VIEWS_COLLECTION,
  type TrackedPublicPageDescriptor,
} from '@/lib/analytics/publicPageTracking'
import { dbDefault } from '@/lib/firebase/admin'
import { sanitizeSlug } from '@/lib/sanitizeSlug'

interface FirestoreArticleAnalytics {
  pageViewsFirstParty?: number
  updatedAt?: Date | { toDate: () => Date } | string | null
}

export interface AdminFirstPartyPageViewRow {
  id: string
  path: string
  pageUrl: string
  title: string
  pageType: string
  author: string | null
  language: string | null
  target: string | null
  pageViews: number
  updatedAt: string | null
}

interface FirestorePublicPageAnalytics {
  path?: string
  title?: string
  pageType?: string
  author?: string | null
  language?: string | null
  target?: string | null
  pageViewsFirstParty?: number
  updatedAt?: Date | { toDate: () => Date } | string | null
}

function resolveFirstPartyViews(data: FirestoreArticleAnalytics | undefined): number {
  if (!data) return 0
  return typeof data.pageViewsFirstParty === 'number' ? data.pageViewsFirstParty : 0
}

function normalizeUpdatedAt(value: FirestoreArticleAnalytics['updatedAt']): string | null {
  if (!value) return null
  if (typeof value === 'string') return value
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    return value.toDate().toISOString()
  }
  return null
}

export async function listAdminFirstPartyPageViews(): Promise<AdminFirstPartyPageViewRow[]> {
  const knownPages = listKnownTrackedPublicPages()
  const articlePages = knownPages.filter((page) => page.articleSlug)

  const articleRefs = articlePages.map((page) =>
    dbDefault()
      .collection('articles')
      .doc(sanitizeSlug(page.articleSlug || ''))
  )

  const [articleSnaps, publicPageViewsSnap] = await Promise.all([
    articleRefs.length > 0 ? dbDefault().getAll(...articleRefs) : [],
    dbDefault().collection(PUBLIC_PAGE_VIEWS_COLLECTION).get(),
  ])

  const legacyByPath = new Map<string, FirestoreArticleAnalytics>()
  for (const [index, page] of articlePages.entries()) {
    const snap = articleSnaps[index]
    const firestoreData = snap?.exists ? (snap.data() as FirestoreArticleAnalytics | undefined) : undefined
    legacyByPath.set(page.path, firestoreData ?? {})
  }

  const publicPageViewsByPath = new Map<string, FirestorePublicPageAnalytics>()
  for (const snap of publicPageViewsSnap.docs) {
    const data = snap.data() as FirestorePublicPageAnalytics
    const path = typeof data.path === 'string' && data.path.trim() ? data.path : null
    if (!path) continue
    publicPageViewsByPath.set(path, data)
  }

  const buildRow = (
    page: TrackedPublicPageDescriptor,
    observed: FirestorePublicPageAnalytics | undefined,
  ): AdminFirstPartyPageViewRow => {
    const legacyData = page.articleSlug ? legacyByPath.get(page.path) : undefined
    const pageViews = page.articleSlug
      ? resolveFirstPartyViews(legacyData)
      : resolveFirstPartyViews(observed)
    const updatedAt = page.articleSlug
      ? normalizeUpdatedAt(legacyData?.updatedAt)
      : normalizeUpdatedAt(observed?.updatedAt)

    return {
      id: page.path,
      path: page.path,
      pageUrl: page.path,
      title: typeof observed?.title === 'string' && observed.title.trim() ? observed.title : page.title,
      pageType: typeof observed?.pageType === 'string' && observed.pageType.trim() ? observed.pageType : page.pageType,
      author:
        typeof observed?.author === 'string' && observed.author.trim().length > 0
          ? observed.author
          : page.author,
      language: typeof observed?.language === 'string' ? observed.language : page.language,
      target: typeof observed?.target === 'string' ? observed.target : page.target,
      pageViews,
      updatedAt,
    }
  }

  const rows = knownPages.map((page) => buildRow(page, publicPageViewsByPath.get(page.path)))

  for (const [path, observed] of publicPageViewsByPath.entries()) {
    if (rows.some((row) => row.path === path)) continue

    rows.push({
      id: path,
      path,
      pageUrl: path,
      title:
        typeof observed.title === 'string' && observed.title.trim().length > 0
          ? observed.title
          : path,
      pageType:
        typeof observed.pageType === 'string' && observed.pageType.trim().length > 0
          ? observed.pageType
          : 'landing',
      author:
        typeof observed.author === 'string' && observed.author.trim().length > 0
          ? observed.author
          : null,
      language: typeof observed.language === 'string' ? observed.language : null,
      target: typeof observed.target === 'string' ? observed.target : null,
      pageViews: resolveFirstPartyViews(observed),
      updatedAt: normalizeUpdatedAt(observed.updatedAt),
    })
  }

  rows.sort((left, right) => {
    if (right.pageViews !== left.pageViews) {
      return right.pageViews - left.pageViews
    }

    return left.title.localeCompare(right.title)
  })

  return rows
}
