import { allPosts } from '@/lib/contentlayer'
import { HomePageClient } from '@/components/home/HomePageClient'
import { PageTransition } from '@/components/ui/PageTransition'

// Force static generation
export const dynamic = 'force-static'
export const revalidate = 86400 // ISR ogni giorno

export default async function HomePage() {
  const publishedPosts = allPosts.filter(post => post.published !== false)

  // Get the latest 20 articles for the ticker, sorted by date
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const tickerArticles = [...publishedPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)
    .map(post => ({
      title: post.title,
      slug: post.slug,
      cover: post.cover,
      author: post.author,
      date: post.date,
      readingTime: post.readingTime ? parseInt(post.readingTime, 10) : undefined,
      target: post.target,
      language: post.language,
      isNew: new Date(post.date) >= sevenDaysAgo,
    }))

  return (
    <PageTransition>
      {/* pb-32 sm:pb-36 to account for fixed ticker at bottom */}
      <main className="min-h-screen pb-32 sm:pb-36">
        <HomePageClient tickerArticles={tickerArticles} />
      </main>
    </PageTransition>
  )
}


