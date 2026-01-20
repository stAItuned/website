import type { Metadata } from 'next'
import { allPosts } from '@/lib/contentlayer'
import { getAuthorData } from '@/lib/authors'
import MeetPageClient from './MeetPageClient'

// Force static generation
export const dynamic = 'force-static'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Chi Siamo | stAItuned',
  description:
    'Scopri chi c\'è dietro stAItuned: la nostra storia, la nostra mission e i valori che ci guidano nel rendere l\'AI accessibile e pratica.',
  openGraph: {
    title: 'Chi Siamo | stAItuned',
    description:
      'Scopri chi c\'è dietro stAItuned: la nostra storia, la nostra mission e i valori che ci guidano.',
    type: 'website',
  },
}

export default async function MeetPage() {
  // Get all unique authors from published posts (same logic as /author page)
  const uniqueAuthors = Array.from(new Set(
    allPosts
      .filter(post => post.published !== false && post.author)
      .map(post => post.author!)
  ))

  // Get author data and article counts
  const authorsWithData = await Promise.all(
    uniqueAuthors.map(async (authorName) => {
      const authorData = await getAuthorData(authorName)
      const articleCount = allPosts.filter(
        post => post.author === authorName && post.published !== false
      ).length

      return {
        name: authorName,
        slug: authorName.replaceAll(' ', '-'),
        data: authorData,
        articleCount
      }
    })
  )

  // Sort by article count (descending) and take top 8 contributors
  const topContributors = authorsWithData
    .sort((a, b) => b.articleCount - a.articleCount)
    .slice(0, 8)

  return <MeetPageClient topContributors={topContributors} />
}
