'use client'

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useAuth } from "@/components/auth/AuthContext"
import { useArticles, formatReadingTime, formatPublicationDate, getTargetColor, getTargetDisplayName } from "@/lib/hooks/useArticles"

export default function PublishedPage() {
  const { user } = useAuth()
  const [targetFilter, setTargetFilter] = useState<'all' | 'newbie' | 'midway' | 'expert'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'title'>('date')

  // Get published articles for the current user
  const { data: articles, loading, error, refetch } = useArticles({
    author: user?.displayName || undefined,
    published: true,
    target: targetFilter === 'all' ? undefined : targetFilter
  })

  const sortedArticles = articles?.sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date || '1970-01-01').getTime() - new Date(a.date || '1970-01-01').getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      case 'views':
        // This would require analytics data integration
        return 0
      default:
        return 0
    }
  }) || []

  return (
    <main className="container mx-auto px-4 py-8 pt-24 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Published Articles</h1>
          <p className="text-gray-600 mt-1">
            {loading ? 'Loading...' : `${articles?.length || 0} published articles`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Target Filter */}
          <select
            value={targetFilter}
            onChange={(e) => setTargetFilter(e.target.value as typeof targetFilter)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            <option value="all">All Levels</option>
            <option value="newbie">Newbie</option>
            <option value="midway">Midway</option>
            <option value="expert">Expert</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="views">Sort by Views</option>
          </select>

          <button
            onClick={refetch}
            disabled={loading}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading articles</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      {!loading && !error && (
        <>
          {sortedArticles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedArticles.map((article) => (
                <div key={article.slug} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  {/* Article Cover */}
                  {article.cover && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <Image
                        src={article.cover}
                        alt={article.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Target Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTargetColor(article.target)}`}>
                        {getTargetDisplayName(article.target)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatReadingTime(article.readingTime)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>

                    {/* Topics */}
                    {article.topics && article.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {article.topics.slice(0, 3).map((topic, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {topic}
                          </span>
                        ))}
                        {article.topics.length > 3 && (
                          <span className="text-xs text-gray-500">+{article.topics.length - 3}</span>
                        )}
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{formatPublicationDate(article.date)}</span>
                      <span>{article.author}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <Link
                        href={article.url}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        View Article →
                      </Link>
                      
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/writer/analytics?slug=${article.slug}&target=${article.target}`}
                          className="text-gray-600 hover:text-gray-700 text-sm"
                          title="View Analytics"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </Link>
                        
                        <Link
                          href={`/writer/new?edit=${article.slug}`}
                          className="text-gray-600 hover:text-gray-700 text-sm"
                          title="Edit Article"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Articles Found</h3>
              <p className="text-gray-600 mb-4">
                {targetFilter === 'all' 
                  ? "You haven't published any articles yet." 
                  : `No ${targetFilter} level articles found.`}
              </p>
              <Link
                href="/writer/new"
                className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Write Your First Article
              </Link>
            </div>
          )}
        </>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
              <div className="aspect-video bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="flex space-x-2 mb-4">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
