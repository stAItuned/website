'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArticleCard } from '@/components/ArticleCard'
import { useSearchParams } from 'next/navigation'

interface Target {
  name: string
  slug: string
  description: string
  image: string
}

interface Article {
  title: string
  slug: string
  cover?: string
  author?: string
  date: string
  meta?: string
  readingTime?: number
  target?: string
  language?: string
  published?: boolean
}

interface LearnPageClientProps {
  targets: Target[]
  articlesByTarget: {
    newbie: Article[]
    midway: Article[]
    expert: Article[]
  }
}

export default function LearnPageClient({ targets, articlesByTarget }: LearnPageClientProps) {
  const searchParams = useSearchParams()
  const target = searchParams.get('target')
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobile, setIsMobile] = useState(false)
  const pageSize = 15

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Reset page when target changes
  useEffect(() => {
    setCurrentPage(1)
  }, [target])

  // Get articles for current target
  const filteredArticles = useMemo(() => {
    if (!target) return []
    const targetKey = target.toLowerCase() as keyof typeof articlesByTarget
    return articlesByTarget[targetKey] || []
  }, [target, articlesByTarget])

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + pageSize)

  // If target is specified, show filtered articles
  if (target) {
    const targetDisplay = target.charAt(0).toUpperCase() + target.slice(1)
    
    return (
      <>
        {/* Target Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {targetDisplay} Articles
          </h1>
          <p className="text-gray-600 mb-8">
            Showing {paginatedArticles.length} of {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} for {targetDisplay} level
          </p>
          <Link 
            href="/learn" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to all targets
          </Link>
        </div>

        {/* Articles Grid */}
        {paginatedArticles.length > 0 ? (
          <div className="flex flex-wrap">
            {paginatedArticles.map((article) => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                {isMobile ? 'Prev' : 'Previous'}
              </button>
              
              {/* Page numbers with smart display logic */}
              {(() => {
                const maxVisiblePages = isMobile ? 3 : 5
                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
                const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
                
                // Adjust start if we're near the end
                if (endPage - startPage + 1 < maxVisiblePages) {
                  startPage = Math.max(1, endPage - maxVisiblePages + 1)
                }
                
                const pages = []
                
                // First page and ellipsis
                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      onClick={() => setCurrentPage(1)}
                      className="px-2 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      1
                    </button>
                  )
                  if (startPage > 2) {
                    pages.push(
                      <span key="start-ellipsis" className="px-1 sm:px-2 py-2 text-sm sm:text-base text-gray-400">
                        ...
                      </span>
                    )
                  }
                }
                
                // Visible page range
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`px-2 sm:px-4 py-2 text-sm sm:text-base border rounded-lg ${
                        currentPage === i 
                          ? 'bg-primary-600 text-white border-primary-600' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {i}
                    </button>
                  )
                }
                
                // Last page and ellipsis
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(
                      <span key="end-ellipsis" className="px-1 sm:px-2 py-2 text-sm sm:text-base text-gray-400">
                        ...
                      </span>
                    )
                  }
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-2 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  )
                }
                
                return pages
              })()}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </>
    )
  }

  // Default view - show target selection
  return (
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
                priority
                sizes="(max-width: 768px) 100vw, 256px"
                quality={80}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
  )
}
