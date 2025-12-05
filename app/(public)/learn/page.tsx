import { Suspense } from 'react'
import Link from 'next/link'
import { PageTransition } from '@/components/ui/PageTransition'
import { ArticleCardSkeleton } from '@/components/ui/LoadingStates'
import { allPosts } from '@/lib/contentlayer'
import LearnPageClient from './LearnPageClient'

// Force static generation
export const dynamic = 'force-static'
export const revalidate = 86400 // ISR ogni giorno (60*60*24)

const targets = [
  {
    name: 'Newbie',
    slug: 'newbie',
    description: 'Just starting your AI journey? Start here with beginner-friendly content.',
    image: '/assets/learn/newbie-card.jpg'
  },
  {
    name: 'Midway',
    slug: 'midway', 
    description: 'Building on the basics? Explore intermediate AI concepts and applications.',
    image: '/assets/learn/midway-card.png'
  },
  {
    name: 'Expert', 
    slug: 'expert',
    description: 'Ready for advanced AI concepts and cutting-edge research.',
    image: '/assets/learn/expert-card.png'
  }
]

export default function LearnPage() {
  // Pre-process articles per target per renderizzazione statica
  const articlesByTarget = {
    newbie: allPosts
      .filter(post => post.target?.toLowerCase() === 'newbie' && post.published !== false)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),

    midway: allPosts
      .filter(post => post.target?.toLowerCase() === 'midway' && post.published !== false)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),

    expert: allPosts
      .filter(post => post.target?.toLowerCase() === 'expert' && post.published !== false)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),

    business: allPosts
      .filter(post => (post as any).business === true && post.published !== false)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Get latest articles across all categories
  const latestArticles = allPosts
    .filter(post => post.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  return (
    <PageTransition>
  <section className="max-w-5xl mx-auto mt-[100px] mb-24 px-4 lg:px-6 space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-3 text-primary-500 w-full md:w-fit bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl font-medium shadow-sm border border-slate-200/50 dark:bg-slate-900/60 dark:border-slate-800/50 dark:text-primary-400 transition-all hover:shadow-md">
          <Link href="/" className="text-sm lg:text-base opacity-60 hover:opacity-100 transition-opacity hover:underline underline-offset-4">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-sm lg:text-base font-semibold truncate">Learn</span>
        </nav>

        {/* Suspense per componenti client */}
        <Suspense fallback={<LearnPageFallback />}>
          <LearnPageClient 
            targets={targets}
            articlesByTarget={articlesByTarget}
            latestArticles={latestArticles}
          />
        </Suspense>
      </section>
    </PageTransition>
  )
}

function LearnPageFallback() {
  return (
    <div className="space-y-16">
      {/* Target cards skeleton */}
      <div className="flex lg:flex-row flex-col justify-between gap-16">
        {targets.map((target) => (
          <div key={target.slug} className="w-full px-8">
            <div className="items-center flex flex-col space-y-4">
              <div className="relative w-64 h-64 mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse" />
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse h-12 rounded-full w-48" />
              <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse h-6 rounded-lg w-full max-w-xs" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Latest articles skeleton */}
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse h-10 rounded-lg w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
