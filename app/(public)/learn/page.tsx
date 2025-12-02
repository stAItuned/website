import { Suspense } from 'react'
import Link from 'next/link'
import { PageTransition } from '@/components/ui/PageTransition'
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
    <div className="flex lg:flex-row flex-col justify-between gap-16">
      {targets.map((target) => (
        <div key={target.slug} className="w-full px-8">
          <div className="items-center flex flex-col">
            <div className="relative w-64 h-64 mb-4 overflow-hidden rounded-lg bg-gray-200 animate-pulse" />
            <div className="bg-gray-200 animate-pulse text-3xl py-6 px-8 rounded-full w-full text-center font-semibold">
              &nbsp;
            </div>
            <div className="h-16 bg-gray-200 animate-pulse mt-4 w-full max-w-xs rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
