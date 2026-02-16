import { normalizeSlug } from '@/lib/validation/writerProfile'

export interface BadgeArticleSource {
  slug: string
  title: string
  author: string
  url: string
  publishedAt: string
  topic?: string
}

interface WriterLike {
  displayName: string
  slug: string
}

const toTrimmedString = (value: unknown): string | null => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export function normalizeAuthorKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ')
}

export function buildWriterSlugLookup(writers: WriterLike[]): Map<string, string> {
  const lookup = new Map<string, string>()
  for (const writer of writers) {
    lookup.set(normalizeAuthorKey(writer.displayName), writer.slug)
  }
  return lookup
}

export function resolveAuthorSlug(authorName: string, writerSlugLookup: Map<string, string>): string {
  const fromWriter = writerSlugLookup.get(normalizeAuthorKey(authorName))
  if (fromWriter) return fromWriter
  return normalizeSlug(authorName)
}

export function mergeBadgeArticleSources(
  localArticles: BadgeArticleSource[],
  firestoreArticles: BadgeArticleSource[]
): BadgeArticleSource[] {
  const mergedBySlug = new Map<string, BadgeArticleSource>()

  for (const article of localArticles) {
    mergedBySlug.set(article.slug, article)
  }

  // Firestore is source-of-truth when both sources contain the same slug.
  for (const article of firestoreArticles) {
    mergedBySlug.set(article.slug, article)
  }

  return Array.from(mergedBySlug.values())
}

export function mapFirestoreArticleToBadgeSource(
  docId: string,
  data: Record<string, unknown>
): BadgeArticleSource | null {
  const isExplicitlyUnpublished = data.published === false
  if (isExplicitlyUnpublished) return null

  const slug = toTrimmedString(data.slug) ?? docId
  const title = toTrimmedString(data.title)
  const author = toTrimmedString(data.author)
  if (!title || !author) return null

  const target = (toTrimmedString(data.target) ?? 'general').toLowerCase()
  const url = toTrimmedString(data.url) ?? `/learn/${target}/${slug}`
  const publishedAt =
    toTrimmedString(data.datePublished) ??
    toTrimmedString(data.date) ??
    toTrimmedString(data.createdAt) ??
    toTrimmedString(data.updatedAt) ??
    new Date(0).toISOString()

  const topic = toTrimmedString(data.topic) ?? toTrimmedString(data.primaryTopic) ?? undefined

  return {
    slug,
    title,
    author,
    url,
    publishedAt,
    topic,
  }
}
