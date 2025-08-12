'use client'

import { useState, useEffect } from 'react'
import { allPosts } from '@/lib/contentlayer'
import Link from 'next/link'
import Image from 'next/image'
import { useSearch } from '@/components/SearchContext'

export function SearchModal() {
  const { isSearchOpen, closeSearch } = useSearch()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredArticles, setFilteredArticles] = useState<typeof allPosts>([])

  // Filter articles based on search term
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = allPosts.filter((article) =>
        article.published !== false &&
        (article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         article.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         article.meta?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredArticles(filtered)
    } else {
      setFilteredArticles([])
    }
  }, [searchTerm])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSearch()
      }
    }

    if (isSearchOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isSearchOpen, closeSearch])

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

  const getValidImageSrc = (article: (typeof allPosts)[0]) => {
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
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeSearch}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-start justify-center p-4 text-center sm:p-0 pt-20">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Search Articles
              </h3>
              <button
                onClick={closeSearch}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Search by title, author, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {searchTerm && filteredArticles.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No articles found for &ldquo;{searchTerm}&rdquo;</p>
                </div>
              )}
              
              {filteredArticles.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 mb-4">
                    Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
                  </p>
                  {filteredArticles.map((article) => {
                    const imageSrc = getValidImageSrc(article)
                    return (
                      <Link
                        key={article.slug}
                        href={`/learn/${(article.target || 'general').toLowerCase()}/${article.slug}`}
                        onClick={closeSearch}
                        className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          {imageSrc && (
                            <Image
                              src={imageSrc}
                              alt={article.title || ''}
                              width={60}
                              height={40}
                              className="rounded object-cover flex-shrink-0"
                              unoptimized={imageSrc.startsWith('http')}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                              {article.title}
                            </h4>
                            <p className="text-xs text-gray-500 mb-1">
                              By {article.author} • {formatDate(article.date)}
                            </p>
                            {article.target && (
                              <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                                {article.target}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
