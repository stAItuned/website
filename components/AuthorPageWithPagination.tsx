'use client'

import { useState } from 'react'
import { PAGINATION_SIZE } from '@/lib/paginationConfig'
import Image from 'next/image'
import Link from 'next/link'
import { ArticleCard } from '@/components/ArticleCard'

interface AuthorData {
  name: string
  title?: string
  description?: string
  linkedin?: string
  email?: string
}

interface Article {
  title: string
  slug: string
  cover?: string
  author: string
  date: string
  meta?: string
  readingTime?: string | number
  target: string
  language: string
  published?: boolean
}

interface AuthorPageWithPaginationProps {
  authorData: AuthorData
  authorArticles: Article[]
  pageSize?: number
  slug: string
}

export function AuthorPageWithPagination({ 
  authorData, 
  authorArticles, 
  pageSize, 
  slug 
}: AuthorPageWithPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const effectivePageSize = pageSize ?? PAGINATION_SIZE
  const totalPages = Math.ceil(authorArticles.length / effectivePageSize)
  const startIndex = (currentPage - 1) * effectivePageSize
  const paginatedArticles = authorArticles.slice(startIndex, startIndex + effectivePageSize)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-4 text-primary-500 mb-8">
        <Link href="/" className="text-sm lg:text-base opacity-50 hover:underline hover:opacity-100 transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/learn" className="text-sm lg:text-base opacity-50 hover:underline hover:opacity-100 transition">
          Learn
        </Link>
        <span>/</span>
        <span className="text-base lg:text-xl">Author: {authorData.name}</span>
      </nav>

      {/* Author Header */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="flex items-start gap-6">
          <Image
            src={`/content/team/${slug}/propic.jpg`}
            alt={authorData.name}
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {authorData.name}
            </h1>
            {authorData.title && (
              <p className="text-xl text-primary-600 mb-4">
                {authorData.title}
              </p>
            )}
            {authorData.description && (
              <p className="text-gray-600 mb-4">
                {authorData.description}
              </p>
            )}
            <div className="flex gap-4">
              {authorData.linkedin && (
                <a
                  href={authorData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                  LinkedIn
                </a>
              )}
              {authorData.email && (
                <a
                  href={`mailto:${authorData.email}`}
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Articles by {authorData.name} ({authorArticles.length})
        </h2>
        {authorArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No published articles found for this author.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap -mx-4">
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
                    readingTime: typeof article.readingTime === 'string' 
                      ? parseInt(article.readingTime) || undefined 
                      : article.readingTime,
                    target: article.target,
                    language: article.language
                  }}
                />
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  {/* Page numbers with smart display logic */}
                  {(() => {
                    const maxVisiblePages = 5
                    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
                    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
                    if (endPage - startPage + 1 < maxVisiblePages) {
                      startPage = Math.max(1, endPage - maxVisiblePages + 1)
                    }
                    const pages = []
                    if (startPage > 1) {
                      pages.push(
                        <button key={1} onClick={() => setCurrentPage(1)} className={`px-3 py-2 rounded-lg border ${currentPage === 1 ? 'bg-primary-600 text-white' : 'bg-white text-primary-600'}`}>1</button>
                      )
                      if (startPage > 2) {
                        pages.push(<span key="start-ellipsis" className="px-2">...</span>)
                      }
                    }
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button key={i} onClick={() => setCurrentPage(i)} className={`px-3 py-2 rounded-lg border ${currentPage === i ? 'bg-primary-600 text-white' : 'bg-white text-primary-600'}`}>{i}</button>
                      )
                    }
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(<span key="end-ellipsis" className="px-2">...</span>)
                      }
                      pages.push(
                        <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className={`px-3 py-2 rounded-lg border ${currentPage === totalPages ? 'bg-primary-600 text-white' : 'bg-white text-primary-600'}`}>{totalPages}</button>
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
        )}
      </div>
    </div>
  )
}
