import { allPosts } from '@/lib/contentlayer'
import { HomePageClient } from '@/components/home/HomePageClient'
import { PageTransition } from '@/components/ui/PageTransition'
import { getContentDateTime } from '@/lib/content-date'

// Force static generation
export const dynamic = 'force-static'
export const revalidate = 86400 // ISR ogni giorno

export default async function HomePage() {
  const publishedPosts = allPosts.filter(post => post.published !== false)

  // Calculate unique contributors: only count authors with published articles
  // This matches the Meet page logic for consistency
  const uniqueAuthors = new Set(
    publishedPosts
      .filter(post => post.author)
      .map(post => post.author!.trim())
  )
  const contributorCount = uniqueAuthors.size

  // Get the latest 20 articles for the ticker, sorted by date
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const tickerArticles = [...publishedPosts]
    .sort((a, b) => getContentDateTime(b.date, b.updatedAt) - getContentDateTime(a.date, a.updatedAt))
    .slice(0, 20)
    .map(post => ({
      title: post.title,
      slug: post.slug,
      cover: post.cover,
      author: post.author,
      date: post.date,
      readingTime: post.readingTime > 0 ? post.readingTime : undefined,
      target: post.target,
      language: post.language,
      meta: post.meta, // Add this line
      isNew: getContentDateTime(post.date, post.updatedAt) >= sevenDaysAgo.getTime(),
    }))

  return (
    <PageTransition>
      {/* pb-32 sm:pb-36 to account for fixed ticker at bottom */}
      <main className="min-h-screen pb-32 sm:pb-36">
        <HomePageClient
          tickerArticles={tickerArticles}
          contributorCount={contributorCount}
          articleCount={publishedPosts.length}
        />
      </main>
    </PageTransition>
  )
}
