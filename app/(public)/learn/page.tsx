import { Suspense } from 'react'
import Link from 'next/link'
import { PageTransition } from '@/components/ui/PageTransition'
import { allPosts } from '@/lib/contentlayer'
import LearnPageClient from './LearnPageClient'

// Force static generation
export const dynamic = 'force-static'
export const revalidate = 60*60*24 // ISR ogni giorno

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
    newbie: allPosts.filter(post => 
      post.target?.toLowerCase() === 'newbie' && post.published !== false
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    
    midway: allPosts.filter(post => 
      post.target?.toLowerCase() === 'midway' && post.published !== false
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    
    expert: allPosts.filter(post => 
      post.target?.toLowerCase() === 'expert' && post.published !== false
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return (
    <PageTransition>
      <section className="max-w-7xl mx-auto mt-[150px] mb-32 px-4 space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-4 text-primary-500 w-full md:w-fit bg-slate-100 px-8 py-4 rounded-lg font-semibold">
          <Link href="/" className="text-sm lg:text-base opacity-50 hover:underline hover:opacity-100 transition">
            Home
          </Link>
          <span>/</span>
          <span className="text-base lg:text-xl truncate">Learn</span>
        </nav>

        {/* Suspense per componenti client */}
        <Suspense fallback={<LearnPageFallback />}>
          <LearnPageClient 
            targets={targets}
            articlesByTarget={articlesByTarget}
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
