import type { Metadata } from 'next'
import { allPosts } from '@/lib/contentlayer'
import { getAuthorBadges } from '@/lib/firebase/badge-service'
import { getPublicWritersList } from '@/lib/writer/firestore'
import MeetPageClient from './MeetPageClient'

// Force static generation
export const dynamic = 'force-static'
export const revalidate = 3600

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')

export const metadata: Metadata = {
  title: 'Chi Siamo | stAItuned',
  description:
    'Scopri chi c\'è dietro stAItuned: la nostra storia, la nostra mission e i valori che ci guidano nel rendere l\'AI accessibile e pratica.',
  alternates: {
    canonical: `${SITE_URL}/meet`,
  },
  openGraph: {
    url: `${SITE_URL}/meet`,
    title: 'Chi Siamo | stAItuned',
    description:
      'Scopri chi c\'è dietro stAItuned: la nostra storia, la nostra mission e i valori che ci guidano.',
    type: 'website',
  },
}

export default async function MeetPage() {
  const normalizeAuthorKey = (value: string) =>
    value.trim().toLowerCase().replace(/\s+/g, ' ')

  const articleCountByAuthor = new Map<string, number>()
  const displayNameByAuthorKey = new Map<string, string>()
  for (const post of allPosts) {
    if (post.published === false || !post.author) continue
    const key = normalizeAuthorKey(post.author)
    displayNameByAuthorKey.set(key, post.author)
    articleCountByAuthor.set(key, (articleCountByAuthor.get(key) ?? 0) + 1)
  }

  const writers = await getPublicWritersList()
  const writerKeys = new Set(writers.map((writer) => normalizeAuthorKey(writer.displayName)))

  const firestoreAuthors = await Promise.all(
    writers.map(async (writer) => {
      const badges = await getAuthorBadges(writer.slug)
      return {
        name: writer.displayName,
        slug: writer.slug,
        data: {
          name: writer.displayName,
          team: ['Writers'],
          title: writer.title,
          description: writer.bio,
          linkedin: writer.linkedin,
          website: writer.website,
          avatar: writer.image?.publicUrl,
          badges,
        },
        articleCount: articleCountByAuthor.get(normalizeAuthorKey(writer.displayName)) ?? 0,
      }
    })
  )

  const fallbackAuthors = await Promise.all(
    Array.from(displayNameByAuthorKey.entries())
      .filter(([authorKey]) => !writerKeys.has(authorKey))
      .map(async ([authorKey, authorName]) => {
        const slug = authorName.replaceAll(' ', '-')
        return {
          name: authorName,
          slug,
          data: {
            name: authorName,
            badges: await getAuthorBadges(slug),
          },
          articleCount: articleCountByAuthor.get(authorKey) ?? 0,
        }
      })
  )

  const authorsWithData = [...firestoreAuthors, ...fallbackAuthors]

  // Sort by article count (descending) and take top 8 contributors
  const topContributors = authorsWithData
    .sort((a, b) => b.articleCount - a.articleCount)
    .slice(0, 8)

  return <MeetPageClient topContributors={topContributors} />
}
