'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatAnalyticsNumber, formatDuration } from '@/lib/hooks/useAnalytics'

interface ArticleWithAnalytics {
    title: string
    slug: string
    cover?: string
    date?: string
    target?: string
    readingTime?: number
    url: string
    analytics: {
        pageViews: number
        users: number
        avgTimeOnPage: number
        likes: number
    }
}

interface MyArticlesProps {
    userEmail: string | null | undefined
}

export function MyArticles({ userEmail }: MyArticlesProps) {
    const [articles, setArticles] = useState<ArticleWithAnalytics[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [authorName, setAuthorName] = useState('')

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const ITEMS_PER_PAGE = 6

    useEffect(() => {
        const fetchArticles = async () => {
            if (!userEmail) {
                setLoading(false)
                return
            }

            setLoading(true)
            try {
                const response = await fetch('/api/account/articles', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: userEmail,
                        page: currentPage,
                        limit: ITEMS_PER_PAGE
                    })
                })

                if (!response.ok) throw new Error('Failed to fetch articles')

                const result = await response.json()

                if (result.success) {
                    setArticles(result.data)
                    if (result.pagination) {
                        setTotalPages(result.pagination.pages)
                        // setCurrentPage(result.pagination.current) // Optional: sync with server
                    }
                    if (result.author) {
                        setAuthorName(result.author.name)
                    }
                } else {
                    setError(result.error || 'Failed to load articles')
                }
            } catch (err) {
                console.error('Error loading my articles:', err)
                setError('Failed to load your articles')
            } finally {
                setLoading(false)
            }
        }

        fetchArticles()
    }, [userEmail, currentPage])

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage)
            // Scroll to top of the articles section
            const element = document.getElementById('my-articles-section')
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }

    if (loading) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2].map(i => (
                            <div key={i} className="h-40 bg-gray-100 dark:bg-slate-900 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // If no articles found or not an author, don't show anything (or strictly empty state)
    // Only return null if it's the first page and no results. 
    // If we filtered or somehow ended up on empty page, we might still want to show UI.
    // But for "My Articles", if you have 0 articles total, we probably hide the section.
    if (!loading && articles.length === 0 && currentPage === 1) {
        return null
    }

    return (
        <div id="my-articles-section" className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    My Articles
                </h2>
                {/* Optional: Show total count if available from API metadata instead of articles.length */}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {articles.length} published articles
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {articles.map((article) => (
                    <div
                        key={article.slug}
                        className="group relative bg-gray-50 dark:bg-slate-900 rounded-xl p-4 border border-gray-100 dark:border-slate-700 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-200"
                    >
                        <div className="flex gap-4">
                            {/* Cover Thumbnail */}
                            {article.cover && (
                                <div className="shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200 relative">
                                    <img
                                        src={article.cover}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <Link
                                    href={article.url}
                                    className="text-base font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 line-clamp-2 mb-2 block"
                                >
                                    {article.title}
                                </Link>

                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                    <span>{new Date(article.date || '').toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{article.readingTime} min read</span>
                                </div>
                            </div>
                        </div>

                        {/* Analytics Stats Row */}
                        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-200 dark:border-slate-800 pt-3">
                            <div className="text-center">
                                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    {formatAnalyticsNumber(article.analytics.pageViews)}
                                </div>
                                <div className="text-xs text-gray-500">Views</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                    {formatAnalyticsNumber(article.analytics.users)}
                                </div>
                                <div className="text-xs text-gray-500">Readers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                    {formatDuration(article.analytics.avgTimeOnPage)}
                                </div>
                                <div className="text-xs text-gray-500">Avg. Time</div>
                            </div>
                        </div>

                        {/* Link overlay */}
                        <Link href={article.url} className="absolute inset-0 z-10" aria-label={`View ${article.title}`} />
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 border-t border-gray-100 dark:border-slate-700 pt-4">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}
