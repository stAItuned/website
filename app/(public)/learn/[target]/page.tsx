'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { allPosts } from '@/lib/contentlayer'
import { PageTransition } from '@/components/ui/PageTransition'
import { ArticleCard } from '@/components/ArticleCard'

interface LearnTargetPageProps {
  params: {
    target: string
  }
}

interface FilterState {
  tags: string[]
  readingTime: string[]
  authors: string[]
  dateRange: string
  languages: string[]
}

interface Article {
  title: string
  slug: string
  cover?: string
  author?: string
  date?: string
  meta?: string
  readingTime?: number
  target?: string
  language?: string
  topics?: string[]
}

export default function LearnTargetPage({ params }: LearnTargetPageProps) {
  const { target } = params
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    tags: [],
    readingTime: [],
    authors: [],
    dateRange: 'all',
    languages: []
  })
  const pageSize = 15

  // Filter articles by target
  const targetArticles = allPosts.filter((article: Article) => 
    article.target?.toLowerCase() === target.toLowerCase()
  )

  // Get unique filter options from the target articles
  const filterOptions = useMemo(() => {
    const allTags = new Set<string>()
    const allAuthors = new Set<string>()
    const allLanguages = new Set<string>()

    targetArticles.forEach((article: Article) => {
      if (article.topics) {
        article.topics.forEach((topic: string) => allTags.add(topic))
      }
      if (article.author) {
        allAuthors.add(article.author)
      }
      if (article.language) {
        allLanguages.add(article.language)
      }
    })

    return {
      tags: Array.from(allTags).sort(),
      authors: Array.from(allAuthors).sort(),
      languages: Array.from(allLanguages).sort()
    }
  }, [targetArticles])

  // Apply all filters
  const filteredArticles = useMemo(() => {
    let filtered = targetArticles

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((article: Article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.meta?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter((article: Article) =>
        article.topics?.some((topic: string) => filters.tags.includes(topic))
      )
    }

    // Apply reading time filter
    if (filters.readingTime.length > 0) {
      filtered = filtered.filter((article: Article) => {
        if (!article.readingTime) return false
        return filters.readingTime.some((timeRange: string) => {
          switch (timeRange) {
            case 'less-than-5': {
              return article.readingTime! < 5
            }
            case '5-to-10': {
              return article.readingTime! >= 5 && article.readingTime! <= 10
            }
            case 'more-than-10': {
              return article.readingTime! > 10
            }
            default:
              return true
          }
        })
      })
    }

    // Apply author filter
    if (filters.authors.length > 0) {
      filtered = filtered.filter((article: Article) =>
        article.author && filters.authors.includes(article.author)
      )
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date()
      filtered = filtered.filter((article: Article) => {
        if (!article.date) return false
        const articleDate = new Date(article.date)
        
        switch (filters.dateRange) {
          case 'last-week': {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            return articleDate >= weekAgo
          }
          case 'last-month': {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            return articleDate >= monthAgo
          }
          case 'last-3-months': {
            const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
            return articleDate >= threeMonthsAgo
          }
          case 'last-year': {
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
            return articleDate >= yearAgo
          }
          default:
            return true
        }
      })
    }

    // Apply language filter
    if (filters.languages.length > 0) {
      filtered = filtered.filter((article: Article) =>
        article.language && filters.languages.includes(article.language)
      )
    }

    // Sort articles by date (newest first)
    return filtered.sort((a: Article, b: Article) => {
      const dateA = new Date(a.date || '1970-01-01')
      const dateB = new Date(b.date || '1970-01-01')
      return dateB.getTime() - dateA.getTime()
    })
  }, [targetArticles, searchTerm, filters])

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedArticles = filteredArticles.slice(startIndex, startIndex + pageSize)

  const targetDisplay = target.charAt(0).toUpperCase() + target.slice(1)

  // Filter utility functions
  const toggleFilter = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]
      
      return { ...prev, [filterType]: newValues }
    })
    setCurrentPage(1)
  }

  const setDateFilter = (value: string) => {
    setFilters(prev => ({ ...prev, dateRange: value }))
    setCurrentPage(1)
  }

  const clearAllFilters = () => {
    setFilters({
      tags: [],
      readingTime: [],
      authors: [],
      dateRange: 'all',
      languages: []
    })
    setSearchTerm('')
    setCurrentPage(1)
  }

  const activeFiltersCount = 
    filters.tags.length + 
    filters.readingTime.length + 
    filters.authors.length + 
    filters.languages.length + 
    (filters.dateRange !== 'all' ? 1 : 0)

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
                placeholder="Search by title, author, or description..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filter Toggle Button */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-primary-600 underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            
            {/* Tags Filter */}
            {filterOptions.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Topics</h3>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {filterOptions.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleFilter('tags', tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filters.tags.includes(tag)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Reading Time Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Reading Time</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'less-than-5', label: 'Less than 5 min' },
                  { value: '5-to-10', label: '5-10 min' },
                  { value: 'more-than-10', label: 'More than 10 min' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => toggleFilter('readingTime', option.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.readingTime.includes(option.value)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Authors Filter */}
            {filterOptions.authors.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Authors</h3>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {filterOptions.authors.map((author) => (
                    <button
                      key={author}
                      onClick={() => toggleFilter('authors', author)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filters.authors.includes(author)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {author}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Publication Date Filter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Publication Date</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All time' },
                  { value: 'last-week', label: 'Last week' },
                  { value: 'last-month', label: 'Last month' },
                  { value: 'last-3-months', label: 'Last 3 months' },
                  { value: 'last-year', label: 'Last year' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDateFilter(option.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.dateRange === option.value
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Filter */}
            {filterOptions.languages.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Language</h3>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.languages.map((language) => (
                    <button
                      key={language}
                      onClick={() => toggleFilter('languages', language)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filters.languages.includes(language)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results count */}
        <div className="text-gray-600">
          Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} for <span className="font-semibold">{targetDisplay}</span>
          {searchTerm && (
            <span> matching &ldquo;{searchTerm}&rdquo;</span>
          )}
          {activeFiltersCount > 0 && (
            <span> with {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied</span>
          )}
        </div>

        {/* Articles Grid */}
        {paginatedArticles.length > 0 ? (
          <div className="flex flex-wrap">
            {paginatedArticles.map((article: Article) => (
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
            {(searchTerm || activeFiltersCount > 0) && (
              <p className="mt-4 text-gray-600">
                Try adjusting your search term or{' '}
                <button onClick={clearAllFilters} className="text-primary-600 hover:underline">
                  clear all filters
                </button>
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
