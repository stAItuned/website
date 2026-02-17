'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearch } from '@/components/SearchContext'
import { trackSearchPerformed, trackSearchResultClicked } from '@/lib/analytics'

interface SearchResult {
  slug: string
  title: string
  author: string
  date: string
  cover?: string
  target?: string
  meta?: string
  published?: boolean
}

export function SearchModal() {
  const { isSearchOpen, closeSearch } = useSearch()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredArticles, setFilteredArticles] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Filter articles based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsLoading(true)
      ;(async () => {
        try {
          const res = await fetch('/api/articles?published=true')
          const json: unknown = await res.json()
          const rec = json as { data?: SearchResult[] }
          const all = Array.isArray(rec.data) ? rec.data : []

          const q = searchTerm.toLowerCase()
          const filtered = all.filter((article) =>
            article.published !== false &&
            (article.title?.toLowerCase().includes(q) ||
              article.author?.toLowerCase().includes(q) ||
              article.meta?.toLowerCase().includes(q))
          )

          setFilteredArticles(filtered)
        } catch {
          setFilteredArticles([])
        } finally {
          setIsLoading(false)
        }
      })()
    } else {
      setFilteredArticles([])
      setIsLoading(false)
    }
  }, [searchTerm])

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    }
  }, [])

  // Save search to recent searches and track
  const saveSearch = useCallback((term: string) => {
    if (term.trim() && typeof window !== 'undefined') {
      const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      // Track search performed
      trackSearchPerformed(term)
    }
  }, [recentSearches])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSearch()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, filteredArticles.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && filteredArticles[selectedIndex]) {
        const article = filteredArticles[selectedIndex]
        saveSearch(searchTerm)
        window.location.href = `/learn/${(article.target || 'general').toLowerCase()}/${article.slug}`
      }
    }

    if (isSearchOpen) {
      document.addEventListener('keydown', handleKeyboard)
      document.body.style.overflow = 'hidden'
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyboard)
      document.body.style.overflow = 'unset'
    }
  }, [isSearchOpen, closeSearch, filteredArticles, selectedIndex, searchTerm, saveSearch])

  // Reset search when modal closes
  useEffect(() => {
    if (!isSearchOpen) {
      setSearchTerm('')
      setFilteredArticles([])
    }
  }, [isSearchOpen])

  if (!isSearchOpen) return null

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getValidImageSrc = (article: SearchResult) => {
    if (!article.cover) return null
    if (article.cover.startsWith('http://') || article.cover.startsWith('https://')) {
      return article.cover
    }
    if (article.cover.startsWith('/')) {
      return article.cover
    }
    const cleanCover = article.cover.replace(/^\.\//, '')
    return `/content/articles/${article.slug}/${cleanCover}`
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={closeSearch}
      />

      {/* Modal */}
      <div className="flex min-h-full items-start justify-center p-4 text-center sm:p-0 pt-20">
        <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-2xl transition-all duration-300 sm:my-8 sm:w-full sm:max-w-2xl animate-slide-up">
          <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 animate-fade-in">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">
                🔍 Search Articles
              </h3>
              <button
                onClick={closeSearch}
                className="rounded-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none transition-all duration-300 hover:rotate-90 hover:scale-110"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                placeholder="Search by title, author, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Recent Searches */}
            {!searchTerm && recentSearches.length > 0 && (
              <div className="mb-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Recent Searches</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setSearchTerm(search)}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-300 hover:scale-105"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading && (
                <div className="text-center py-12 animate-fade-in">
                  <div className="relative inline-block">
                    <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-600 rounded-full" />
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-primary-600 rounded-full animate-spin" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mt-4 animate-pulse">Searching...</p>
                </div>
              )}

              {!isLoading && searchTerm && filteredArticles.length === 0 && (
                <div className="text-center py-12 animate-fade-in">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-900 dark:text-gray-100 font-semibold mb-2">No articles found</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Try different keywords for &ldquo;{searchTerm}&rdquo;</p>
                </div>
              )}

              {!isLoading && filteredArticles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 px-1 animate-fade-in">
                    Found <span className="font-semibold text-primary-600 dark:text-primary-400">{filteredArticles.length}</span> article{filteredArticles.length !== 1 ? 's' : ''}
                  </p>
                  {filteredArticles.map((article, index) => {
                    const imageSrc = getValidImageSrc(article)
                    const isSelected = index === selectedIndex
                    return (
                      <Link
                        key={article.slug}
                        href={`/learn/${(article.target || 'general').toLowerCase()}/${article.slug}`}
                        onClick={() => {
                          saveSearch(searchTerm)
                          trackSearchResultClicked(searchTerm, article.slug)
                          closeSearch()
                        }}
                        className={`block p-4 border-2 rounded-xl transition-all duration-300 animate-fade-in-up group ${isSelected
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md scale-[1.02]'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:shadow-md hover:scale-[1.01]'
                          }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <div className="flex items-start space-x-4">
                          {imageSrc && (
                            <div className="relative flex-shrink-0 overflow-hidden rounded-lg">
                              <Image
                                src={imageSrc}
                                alt={article.title || ''}
                                width={80}
                                height={60}
                                className="rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
                                unoptimized={imageSrc.startsWith('http')}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1.5 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {article.title}
                            </h4>
                            {article.meta && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                                {article.meta}
                              </p>
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                By <span className="font-medium">{article.author}</span>
                              </p>
                              <span className="text-gray-400">•</span>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(article.date)}
                              </p>
                              {article.target && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span className="inline-block bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-300 text-xs px-2 py-0.5 rounded-full font-medium">
                                    {article.target}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className={`flex-shrink-0 transition-all duration-300 ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                            <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Keyboard shortcuts hint */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">↑</kbd>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">↓</kbd>
                  <span>to navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">↵</kbd>
                  <span>to select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">esc</kbd>
                  <span>to close</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
