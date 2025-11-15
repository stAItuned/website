'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { allPosts } from '@/lib/contentlayer'
import { PAGINATION_SIZE } from '@/lib/paginationConfig'
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
  const [isMobile, setIsMobile] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    tags: [],
    readingTime: [],
    authors: [],
    dateRange: 'all',
    languages: []
  })
  const pageSize = PAGINATION_SIZE

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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
      <section className="max-w-7xl mx-auto mb-32 px-4 sm:px-6 md:px-8 mt-[120px] sm:mt-[140px] md:mt-[150px] space-y-8 md:space-y-16">
        
        {/* Breadcrumb */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center gap-4 md:gap-8 lg:gap-16">
          <nav className="flex items-center space-x-2 md:space-x-4 text-primary-500 w-full md:w-auto bg-slate-100 px-4 md:px-8 py-3 md:py-4 rounded-lg font-semibold">
            <Link href="/" className="text-xs sm:text-sm lg:text-base opacity-50 hover:underline hover:opacity-100 transition">
              Home
            </Link>
            <span className="text-xs sm:text-sm">/</span>
            <Link href="/learn" className="text-xs sm:text-sm lg:text-base opacity-50 hover:underline hover:opacity-100 transition">
              Learn
            </Link>
            <span className="text-xs sm:text-sm">/</span>
            <span className="text-sm sm:text-base lg:text-xl truncate">{targetDisplay}</span>
          </nav>

          {/* Search Bar */}
          <div className="flex w-full items-center">
            <div className="w-full relative">
              <input
                type="text"
                placeholder={isMobile ? "Search articles..." : "Search by title, author, or description..."}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg className="absolute right-3 top-3 w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filter Toggle Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm md:text-base font-medium"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs md:text-sm text-gray-600 hover:text-primary-600 underline font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <>
            {/* Mobile Filter Modal */}
            {isMobile ? (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowFilters(false)}>
                <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Filter Articles</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Mobile Topics Filter */}
                    {filterOptions.tags.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Topics</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {filterOptions.tags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => toggleFilter('tags', tag)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center ${
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

                    {/* Mobile Reading Time Filter */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 text-lg">Reading Time</h3>
                      <div className="space-y-2">
                        {[
                          { value: 'less-than-5', label: 'Less than 5 min' },
                          { value: '5-to-10', label: '5-10 min' },
                          { value: 'more-than-10', label: 'More than 10 min' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => toggleFilter('readingTime', option.value)}
                            className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
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

                    {/* Mobile Authors Filter */}
                    {filterOptions.authors.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Authors</h3>
                        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                          {filterOptions.authors.map((author) => (
                            <button
                              key={author}
                              onClick={() => toggleFilter('authors', author)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
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

                    {/* Mobile Publication Date Filter */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 text-lg">Publication Date</h3>
                      <div className="space-y-2">
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
                            className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
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

                    {/* Mobile Language Filter */}
                    {filterOptions.languages.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3 text-lg">Language</h3>
                        <div className="flex flex-col space-y-2">
                          {filterOptions.languages.map((language) => (
                            <button
                              key={language}
                              onClick={() => toggleFilter('languages', language)}
                              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
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

                    {/* Mobile Apply Button */}
                    <div className="pt-4 border-t">
                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold text-base hover:bg-primary-700 transition-colors"
                      >
                        Apply Filters ({activeFiltersCount})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop Filter Panel */
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6 shadow-sm">
                
                {/* Desktop Tags Filter */}
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

                {/* Desktop Reading Time Filter */}
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

                {/* Desktop Authors Filter */}
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

                {/* Desktop Publication Date Filter */}
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

                {/* Desktop Language Filter */}
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
          </>
        )}

        {/* Results count */}
        <div className="text-gray-600 text-sm md:text-base">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span>
              Showing <span className="font-semibold">{startIndex + 1}-{Math.min(startIndex + pageSize, filteredArticles.length)}</span> of <span className="font-semibold">{filteredArticles.length}</span> article{filteredArticles.length !== 1 ? 's' : ''} for <span className="font-semibold">{targetDisplay}</span>
            </span>
            {searchTerm && (
              <span className="text-primary-600"> matching &ldquo;{searchTerm}&rdquo;</span>
            )}
            {activeFiltersCount > 0 && (
              <span className="text-primary-600"> with {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied</span>
            )}
          </div>
        </div>

        {/* Articles Grid */}
        {paginatedArticles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 items-stretch">
            {paginatedArticles.map((article: Article) => (
              <div className="h-full" key={article.slug}>
                <ArticleCard 
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
              </div>
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
      </section>
    </PageTransition>
  )
}
