'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PageTransition } from '@/components/ui/PageTransition'
import { ArticleCard } from '@/components/ArticleCard'
import { allPosts } from '@/lib/contentlayer'
import { useSearchParams } from 'next/navigation'

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
  const searchParams = useSearchParams()
  const target = searchParams.get('target')

  // Filter articles by target if specified
  const filteredArticles = useMemo(() => {
    if (!target) return []
    return allPosts.filter((post) => 
      post.target?.toLowerCase() === target.toLowerCase() && post.published !== false
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [target])

  // If target is specified, show filtered articles
  if (target) {
    const targetDisplay = target.charAt(0).toUpperCase() + target.slice(1)
    
    return (
      <PageTransition>
        <section className="max-w-7xl mx-auto mt-[150px] mb-32 px-4 space-y-16">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-4 text-primary-500 w-full md:w-fit bg-slate-100 px-8 py-4 rounded-lg font-semibold">
            <Link href="/" className="text-sm lg:text-base opacity-50 hover:underline hover:opacity-100 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/learn" className="text-sm lg:text-base opacity-50 hover:underline hover:opacity-100 transition">
              Learn
            </Link>
            <span>/</span>
            <span className="text-base lg:text-xl truncate">{targetDisplay}</span>
          </nav>

          {/* Target Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {targetDisplay} Articles
            </h1>
            <p className="text-gray-600 mb-8">
              Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} for {targetDisplay} level
            </p>
            <Link 
              href="/learn" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to all targets
            </Link>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="flex flex-wrap">
              {filteredArticles.map((article) => (
                <ArticleCard 
                  key={article.slug} 
                  article={{
                    title: article.title,
                    slug: article.slug,
                    cover: article.cover,
                    author: article.author,
                    date: article.date,
                    meta: article.meta,
                    readingTime: article.readingTime,
                    target: article.target,
                    language: article.language
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                No articles found for {targetDisplay} level
              </h2>
              <p className="text-gray-600">
                Check back soon for new content!
              </p>
            </div>
          )}
        </section>
      </PageTransition>
    )
  }

  // Default view - show target selection
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

        {/* Target Selection */}
        <div className="flex lg:flex-row flex-col justify-between gap-16">
          {targets.map((target) => (
            <div key={target.slug} className="w-full px-8">
              <Link href={`/learn?target=${target.slug}`} className="items-center flex flex-col group">
                <div className="relative w-64 h-64 mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={target.image}
                    alt={`${target.name} card`}
                    fill
                    className="object-cover group-hover:scale-125 transition-transform duration-300"
                  />
                </div>
                <div className="bg-primary-600 text-white text-3xl py-6 px-8 rounded-full w-full text-center font-semibold hover:bg-primary-700 transition">
                  {target.name}
                </div>
                <p className="text-center mt-4 text-gray-600 max-w-xs">
                  {target.description}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </PageTransition>
  )
}
