'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface ArticleAnalytics {
    pageViews: number
    users: number
    sessions: number
    avgTimeOnPage: number
    bounceRate: number
    likes: number
    updatedAt: string | null
}

interface AuthorArticle {
    title: string
    slug: string
    cover: string | null
    date: string
    target: string
    readingTime: number
    url: string
    analytics: ArticleAnalytics
}

interface PaginationData {
    total: number
    pages: number
    current: number
}

interface MyArticlesProps {
    userEmail: string | null | undefined
}

type SortOption = 'date' | 'readers' | 'views' | 'time'
type SortOrder = 'asc' | 'desc'

export function MyArticles({ userEmail }: MyArticlesProps) {
    const [articles, setArticles] = useState<AuthorArticle[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [pagination, setPagination] = useState<PaginationData>({ total: 0, pages: 0, current: 1 })
    const [sortBy, setSortBy] = useState<SortOption>('date')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

    // Ref to scroll to top of section
    const sectionRef = (node: HTMLElement | null) => {
        if (node && pagination.current > 1) {
            // Only scroll if we are not on the first page load
            // But actually we want to scroll on page change
        }
    }

    useEffect(() => {
        if (!userEmail) return
        fetchArticles(1, sortBy, sortOrder)
    }, [userEmail, sortBy, sortOrder])

    const fetchArticles = async (page: number, sort: SortOption, order: SortOrder) => {
        if (!userEmail) {
            setLoading(false)
            return
        }
        
        setLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams({
                email: userEmail,
                page: page.toString(),
                limit: '6',
                sortBy: sort,
                sortOrder: order
            })

            const response = await fetch(`/api/account/articles?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            const data = await response.json()

            if (data.success) {
                setArticles(data.data)
                setPagination(data.pagination)

                // Scroll to top of section on page change if not initial load
                const section = document.getElementById('my-articles-section')
                if (section && page !== 1) {
                    section.scrollIntoView({ behavior: 'smooth' })
                }
            } else {
                setError(data.error || 'Failed to fetch articles')
            }
        } catch (err) {
            console.error('Error fetching articles:', err)
            setError('An error occurred while fetching your articles')
        } finally {
            setLoading(false)
        }
    }

    const handlePageChange = (newPage: number) => {
        fetchArticles(newPage, sortBy, sortOrder)
    }

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value as SortOption)
        // Page will be reset to 1 by the fetchArticles call effectively, 
        // but better to be explicit: fetchArticles(1, newSort) is called by useEffect dependency?
        // Actually no, useEffect depends on sortBy, so it will trigger.
    }

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}m ${secs}s`
    }

    if (loading && articles.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-8 animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-6"></div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-gray-200 dark:bg-slate-700 rounded"></div>
                    ))}
                </div>
            </div>
        )
    }

    if (!loading && articles.length === 0 && pagination.total === 0) {
        return null // Don't show section if user has no articles
    }

    return (
        <div id="my-articles-section" className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent dark:text-white dark:bg-none">
                        My Articles
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {pagination.total} articles published
                    </p>
                </div>

                <div className="flex items-center space-x-2">
                    <label htmlFor="sort-articles" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Sort by:
                    </label>
                    <div className="flex rounded-md shadow-sm">
                        <select
                            id="sort-articles"
                            value={sortBy}
                            onChange={handleSortChange}
                            className="block w-full rounded-l-md border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border-r-0"
                        >
                            <option value="date">Date</option>
                            <option value="readers">Readers</option>
                            <option value="views">Views</option>
                            <option value="time">Avg. Time</option>
                        </select>
                        <button
                            onClick={toggleSortOrder}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-r-md bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                        >
                            {sortOrder === 'asc' ? (
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                                </svg>
                            ) : (
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                    <div key={article.slug} className="bg-gray-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col h-full">
                        <div className="relative h-48 w-full">
                            {article.cover ? (
                                <Image
                                    src={article.cover}
                                    alt={article.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center">
                                    <span className="text-gray-400">No cover</span>
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                                {article.target}
                            </div>
                        </div>

                        <div className="p-4 flex flex-col flex-grow">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem] dark:text-white">
                                <Link href={article.url} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    {article.title}
                                </Link>
                            </h3>

                            <div className="mt-auto space-y-3">
                                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pb-3 border-b border-gray-200 dark:border-slate-700">
                                    <span>{new Date(article.date).toLocaleDateString()}</span>
                                    <span>{article.readingTime} min read</span>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Views</div>
                                        <div className="font-bold text-gray-900 dark:text-white">{article.analytics.pageViews}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Readers</div>
                                        <div className="font-bold text-gray-900 dark:text-white">{article.analytics.users}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg. Time</div>
                                        <div className="font-bold text-gray-900 dark:text-white">{formatTime(article.analytics.avgTimeOnPage)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
                <div className="mt-8 flex justify-center items-center space-x-4">
                    <button
                        onClick={() => handlePageChange(pagination.current - 1)}
                        disabled={pagination.current === 1}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${pagination.current === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-700 dark:text-gray-500'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-600'
                            }`}
                    >
                        Previous
                    </button>

                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        Page <span className="font-medium text-gray-900 dark:text-white">{pagination.current}</span> of <span className="font-medium">{pagination.pages}</span>
                    </span>

                    <button
                        onClick={() => handlePageChange(pagination.current + 1)}
                        disabled={pagination.current === pagination.pages}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${pagination.current === pagination.pages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-slate-700 dark:text-gray-500'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 dark:bg-slate-700 dark:text-white dark:border-slate-600 dark:hover:bg-slate-600'
                            }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    )
}
