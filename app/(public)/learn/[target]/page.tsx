'use client'

import { useState } from 'react'
import Link from 'next/link'
import { allPosts } from '@/lib/contentlayer'
import { PageTransition } from '@/components/ui/PageTransition'
import { ArticleCard } from '@/components/ArticleCard'

interface LearnTargetPageProps {
  params: {
    target: string
  }
}

export default function LearnTargetPage({ params }: LearnTargetPageProps) {
  const { target } = params
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 15

  // Filter articles by target
  const targetArticles = allPosts.filter((article: any) => 
    article.target?.toLowerCase() === target.toLowerCase()
  )

  // Sort articles by date (newest first)
  const sortedArticles = targetArticles.sort((a: any, b: any) => {
    const dateA = new Date(a.date || '1970-01-01')
    const dateB = new Date(b.date || '1970-01-01')
    return dateB.getTime() - dateA.getTime()
  })

  // Apply search filter
  const filteredArticles = sortedArticles.filter((article: any) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + pageSize)

  const targetDisplay = target.charAt(0).toUpperCase() + target.slice(1)

  return (
    <PageTransition>
      <section className="max-w-7xl mx-auto mb-32 px-4 mt-[150px] space-y-16">
        
        {/* Breadcrumb */}
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-16">
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

          {/* Search Bar */}
          <div className="flex w-full items-center lg:space-x-16 space-x-4">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page when searching
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="text-gray-600">
          Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} for <span className="font-semibold">{targetDisplay}</span>
          {searchTerm && (
            <span> matching "{searchTerm}"</span>
          )}
        </div>

        {/* Articles Grid */}
        {paginatedArticles.length > 0 ? (
          <div className="flex flex-wrap">
            {paginatedArticles.map((article: any) => (
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
          <div className="h-full text-center py-16">
            <h1 className="text-2xl font-bold text-primary-500">
              No articles found with your selected criteria
            </h1>
            {searchTerm && (
              <p className="mt-4 text-gray-600">
                Try adjusting your search term or <button onClick={() => setSearchTerm('')} className="text-primary-600 hover:underline">clear the search</button>
              </p>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border rounded-lg ${
                  currentPage === page 
                    ? 'bg-primary-600 text-white border-primary-600' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </PageTransition>
  )
}
