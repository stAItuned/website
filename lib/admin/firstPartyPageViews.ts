import { allPosts } from '@/lib/contentlayer'
import { dbDefault } from '@/lib/firebase/admin'
import { sanitizeSlug } from '@/lib/sanitizeSlug'

interface FirestoreArticleAnalytics {
  pageViewsFirstParty?: number
  updatedAt?: Date | { toDate: () => Date } | string | null
}

export interface AdminFirstPartyPageViewRow {
  slug: string
  articleUrl: string
  title: string
  author: string
  language: string | null
  target: string
  pageViews: number
  updatedAt: string | null
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
  const publishedPosts = allPosts.filter((post) => post.published !== false)
  const refs = publishedPosts.map((post) =>
    dbDefault()
      .collection('articles')
      .doc(sanitizeSlug(post.slug))
  )

  const snaps = refs.length > 0 ? await dbDefault().getAll(...refs) : []

  const rows = publishedPosts.map((post, index) => {
    const snap = snaps[index]
    const firestoreData = snap?.exists ? (snap.data() as FirestoreArticleAnalytics | undefined) : undefined
    const rawTarget = typeof post.target === 'string' && post.target.trim().length > 0 ? post.target : 'midway'

    return {
      slug: post.slug,
      articleUrl: `/learn/${rawTarget.toLowerCase()}/${post.slug}`,
      title: post.title,
      author: post.author,
      language: typeof post.language === 'string' ? post.language : null,
      target: rawTarget,
      pageViews: resolveFirstPartyViews(firestoreData),
      updatedAt: normalizeUpdatedAt(firestoreData?.updatedAt),
    }
  })

  rows.sort((left, right) => {
    if (right.pageViews !== left.pageViews) {
      return right.pageViews - left.pageViews
    }

    return left.title.localeCompare(right.title)
  })

  return rows
}
