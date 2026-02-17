'use client'

import { useState } from 'react'
import { PAGINATION_SIZE } from '@/lib/paginationConfig'
import Image from 'next/image'
import Link from 'next/link'
import { ArticleCard } from '@/components/ArticleCard'
import { BADGE_DEFINITIONS } from '@/lib/config/badge-config'
import { BadgeGrid } from '@/components/badges/BadgeGrid'
import type { AuthorBadge, Badge } from '@/lib/types/badge'
import { MarkdownContent } from '@/components/MarkdownContent'

interface AuthorData {
  name: string
  title?: string
  description?: string
  linkedin?: string
  website?: string
  speaker?: boolean
  badges?: AuthorBadge[]
  avatar?: string
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

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
  return initials || '?'
}

function toExternalUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

/** Public author page with client-side pagination. */
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
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8 text-gray-900 dark:text-gray-100">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 sm:space-x-4 text-primary-600 dark:text-primary-400 mb-4 sm:mb-8 text-xs sm:text-base overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-primary-200 scrollbar-track-transparent">
        <Link href="/" className="opacity-70 hover:underline hover:opacity-100 transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/learn/articles" className="opacity-70 hover:underline hover:opacity-100 transition">
          Learn
        </Link>
        <span>/</span>
        <span className="truncate max-w-[8rem] sm:max-w-xs md:max-w-md lg:max-w-lg inline-block align-bottom text-gray-700 dark:text-gray-300">Author: {authorData.name}</span>
      </nav>

      {/* Author Header */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg shadow-sm dark:shadow-none p-4 sm:p-8 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {authorData.avatar ? (
            <Image
              src={authorData.avatar}
              alt={authorData.name}
              width={120}
              height={120}
              className="rounded-full object-cover w-20 h-20 sm:w-[120px] sm:h-[120px]"
            />
          ) : (
            <div
              aria-label={`${authorData.name} avatar`}
              className="rounded-full w-20 h-20 sm:w-[120px] sm:h-[120px] bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 text-primary-700 dark:text-primary-300 flex items-center justify-center text-xl sm:text-3xl font-bold"
            >
              {getInitials(authorData.name)}
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
              {authorData.name}
            </h1>
            {authorData.title && (
              <p className="text-base sm:text-xl text-primary-600 dark:text-primary-300 mb-2 sm:mb-4">
                {authorData.title}
              </p>
            )}
            {authorData.speaker && (
              <div className="inline-flex flex-wrap items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-semibold border border-green-200 dark:border-green-800 mb-2">
                <svg className="w-4 h-4 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zm5 9a5 5 0 0 1-10 0m5 5v3m-4 0h8" />
                </svg>
                <span>Available for speech</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 ml-2">AI & Innovation</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 ml-1">GenAI applied to the business</span>
                {authorData.linkedin ? (
                  <a
                    href={toExternalUrl(authorData.linkedin)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 px-3 py-1 rounded-full bg-primary-600 dark:bg-primary-500 text-white text-xs font-semibold transition-all duration-200 hover:bg-primary-700 dark:hover:bg-primary-400 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    Contact on LinkedIn
                  </a>
                ) : null}
              </div>
            )}
            {authorData.description && (
              <div className="text-gray-600 dark:text-gray-300 mb-2 sm:mb-4 text-sm sm:text-base">
                <MarkdownContent content={authorData.description} />
              </div>
            )}
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 mt-2">
              {authorData.linkedin && (
                <a
                  href={toExternalUrl(authorData.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                  LinkedIn
                </a>
              )}
              {authorData.website && (
                <a
                  href={toExternalUrl(authorData.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-300 hover:text-primary-700 dark:hover:text-primary-200 transition-colors"
                >
                  {/* Globe icon for website */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
                  </svg>
                  Website
                </a>
              )}
            </div>

            {/* Author Badges Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Badges & Credentials
              </h3>
              <BadgeGrid
                badges={BADGE_DEFINITIONS}
                earnedBadges={authorData.badges || []}
                className="grid-cols-3 sm:grid-cols-4 md:grid-cols-5"
                showLocked={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Articles by {authorData.name} ({authorArticles.length})
        </h2>
        {authorArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No published articles found for this author.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap -mx-2 sm:-mx-4">
              {paginatedArticles.map((article) => (
                <div key={article.slug} className="w-full sm:w-1/2 md:w-1/3 px-2 sm:px-4 mb-4">
                  <ArticleCard
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
                </div>
              ))}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-xs sm:text-base">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-2 sm:px-4 py-1 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
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
                        <button key={1} onClick={() => setCurrentPage(1)} className={`px-2 py-1 rounded-lg border ${currentPage === 1 ? 'bg-primary-600 text-white border-primary-600 dark:border-primary-500' : 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>1</button>
                      )
                      if (startPage > 2) {
                        pages.push(<span key="start-ellipsis" className="px-1 text-gray-500 dark:text-gray-400">...</span>)
                      }
                    }
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button key={i} onClick={() => setCurrentPage(i)} className={`px-2 py-1 rounded-lg border ${currentPage === i ? 'bg-primary-600 text-white border-primary-600 dark:border-primary-500' : 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>{i}</button>
                      )
                    }
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(<span key="end-ellipsis" className="px-1 text-gray-500 dark:text-gray-400">...</span>)
                      }
                      pages.push(
                        <button key={totalPages} onClick={() => setCurrentPage(totalPages)} className={`px-2 py-1 rounded-lg border ${currentPage === totalPages ? 'bg-primary-600 text-white border-primary-600 dark:border-primary-500' : 'bg-white dark:bg-gray-900 text-primary-600 dark:text-primary-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>{totalPages}</button>
                      )
                    }
                    return pages
                  })()}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-2 sm:px-4 py-1 sm:py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800"
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
