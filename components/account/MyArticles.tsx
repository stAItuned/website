'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Contribution } from '@/lib/types/contributor'
import { useAuth } from '@/components/auth/AuthContext'
import { useLearnLocale } from '@/lib/i18n'
import { contributeTranslations } from '@/lib/i18n/contribute-translations'

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
    const searchParams = useSearchParams()
    const { user } = useAuth()
    const { locale } = useLearnLocale()
    const t_dash = contributeTranslations[locale as 'it' | 'en']?.dashboard || {}
    const t_contrib = t_dash.status || {}
    const t_wizard = contributeTranslations[locale as 'it' | 'en']?.wizard || {}
    // published articles state
    const [articles, setArticles] = useState<AuthorArticle[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [pagination, setPagination] = useState<PaginationData>({ total: 0, pages: 0, current: 1 })
    const [sortBy, setSortBy] = useState<SortOption>('date')
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

    // tabs state
    const [activeTab, setActiveTab] = useState<'published' | 'in_progress'>('published')

    // Set active tab from URL
    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab === 'in_progress') {
            setActiveTab('in_progress')
        } else if (tab === 'published') {
            setActiveTab('published')
        }
    }, [searchParams])

    // contributions state
    const [contributions, setContributions] = useState<Contribution[]>([])
    const [loadingContributions, setLoadingContributions] = useState(false)
    const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null)

    const fetchArticles = useCallback(async (page: number, sort: SortOption, order: SortOrder) => {
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
            } else {
                setError(data.error || 'Failed to fetch articles')
            }
        } catch (err) {
            console.error('Error fetching articles:', err)
            setError('An error occurred while fetching your articles')
        } finally {
            setLoading(false)
        }
    }, [userEmail])

    const fetchContributions = useCallback(async () => {
        if (!user) return
        setLoadingContributions(true)
        try {
            const token = await user.getIdToken()
            const res = await fetch('/api/contributor/get-progress', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const json = await res.json()
            if (json.success) {
                setContributions(json.contributions)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoadingContributions(false)
        }
    }, [user])

    useEffect(() => {
        if (!userEmail) return
        void fetchArticles(1, sortBy, sortOrder)

        if (user) {
            void fetchContributions()
        }
    }, [userEmail, user, sortBy, sortOrder, fetchArticles, fetchContributions])

    const handlePageChange = (newPage: number) => {
        fetchArticles(newPage, sortBy, sortOrder)
        const section = document.getElementById('my-articles-section')
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortBy(e.target.value as SortOption)
    }

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}m ${secs}s`
    }

    if (!loading && !loadingContributions && articles.length === 0 && contributions.length === 0) {
        return null // Hide section if absolutely nothing
    }

    return (
        <>
            <div id="my-articles-section">
                <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center mb-6 gap-4">
                    <div className="flex bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('published')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'published' ? 'bg-white dark:bg-slate-600 shadow text-primary-600 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            {t_dash.tabs?.published || 'Published'}
                        </button>
                        <button
                            onClick={() => setActiveTab('in_progress')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'in_progress' ? 'bg-white dark:bg-slate-600 shadow text-primary-600 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            {t_dash.tabs?.in_progress || 'In Progress'}
                            {contributions.length > 0 && (
                                <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full">
                                    {contributions.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {activeTab === 'published' && (
                    <>
                        <div className="flex justify-end mb-4">
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

                        {loading ? (
                            <div className="animate-pulse grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-64 bg-gray-200 dark:bg-slate-700 rounded"></div>
                                ))}
                            </div>
                        ) : articles.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {articles.map((article) => (
                                    <div key={article.slug} className="bg-gray-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col h-full hover:shadow-md transition">
                                        <div className="relative h-48 w-full">
                                            {article.cover ? (
                                                <Image
                                                    src={article.cover}
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                You haven't published any articles yet.
                            </div>
                        )}

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
                    </>
                )}

                {activeTab === 'in_progress' && (
                    <div className="min-h-[200px]">
                        {loadingContributions ? (
                            <div className="animate-pulse grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-48 bg-gray-200 dark:bg-slate-700 rounded"></div>
                                ))}
                            </div>
                        ) : contributions.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {contributions.map(c => (
                                    <div key={c.id}
                                        onClick={() => setSelectedContribution(c)}
                                        className="group border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-6 rounded-xl flex flex-col gap-4 hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-700 transition-all cursor-pointer relative"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex flex-wrap gap-2">
                                                <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${c.status === 'pitch' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                                                    c.status === 'interview' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                                        c.status === 'outline' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                            c.status === 'draft' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' :
                                                                'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                    }`}>
                                                    {t_contrib[c.status] || c.status}
                                                </span>
                                                <span className={`px-2 py-1 text-[10px] font-black rounded uppercase border tracking-wider ${c.path === 'autonomy' ? 'border-blue-200 text-blue-700 bg-blue-50/50 dark:border-blue-800/50 dark:text-blue-300 dark:bg-blue-900/20' :
                                                    c.path === 'guided' ? 'border-primary-200 text-primary-700 bg-primary-50/50 dark:border-primary-800/50 dark:text-primary-300 dark:bg-primary-900/20' :
                                                        'border-purple-200 text-purple-700 bg-purple-50/50 dark:border-purple-800/50 dark:text-purple-300 dark:bg-purple-900/20'
                                                    }`}>
                                                    {(contributeTranslations[locale as 'it' | 'en']?.landing?.paths as any)?.[c.path]?.title || c.path}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                                                {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : 'Just now'}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-lg leading-tight mb-2 dark:text-white line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                {c.brief.topic || c.brief.thesis || 'Untitled Contribution'}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 italic">
                                                "{c.brief.thesis}"
                                            </p>
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                                                Click to view details
                                            </span>
                                            <Link
                                                href={`/contribute/wizard?id=${c.id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1 bg-primary-50 dark:bg-primary-900/20 px-3 py-1.5 rounded-full transition-colors"
                                            >
                                                Continue
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
                                <p className="text-gray-500 dark:text-gray-400 mb-4">You have no active contributions.</p>
                                <Link href="/contribute" className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-500 transition">
                                    Start Writing
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Rendering with AnimatePresence */}
            <AnimatePresence>
                {selectedContribution && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedContribution(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/50">
                                <div>
                                    <div className="flex gap-2 mb-2">
                                        <span className="px-2 py-0.5 text-[10px] font-black rounded uppercase bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                                            {t_contrib[selectedContribution.status] || selectedContribution.status}
                                        </span>
                                        <span className="px-2 py-0.5 text-[10px] font-black rounded uppercase border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                                            {(contributeTranslations[locale as 'it' | 'en']?.landing?.paths as any)?.[selectedContribution.path]?.title || selectedContribution.path}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                                        {selectedContribution.brief.topic || selectedContribution.brief.thesis || (locale === 'it' ? 'Contributo senza titolo' : 'Untitled Contribution')}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setSelectedContribution(null)}
                                    className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                                {/* Brief Section */}
                                <section>
                                    <h4 className="text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-4">{t_wizard.pitch?.title || 'Initial Pitch'}</h4>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t_wizard.pitch?.target?.label || 'Target'}</span>
                                            <span className="text-sm font-semibold dark:text-white">
                                                {(t_wizard.pitch?.target?.options as any)?.[selectedContribution.brief.target] || selectedContribution.brief.target}
                                            </span>
                                        </div>
                                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t_wizard.pitch?.format?.label || 'Format'}</span>
                                            <span className="text-sm font-semibold dark:text-white">
                                                {(t_wizard.pitch?.format?.options as any)?.[selectedContribution.brief.format] || selectedContribution.brief.format}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t_wizard.pitch?.thesis?.label || 'Main Thesis'}</span>
                                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {selectedContribution.brief.thesis}
                                            </p>
                                        </div>
                                        {selectedContribution.brief.sources && (
                                            <div>
                                                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t_wizard.pitch?.sources?.label || 'Sources'}</span>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 break-all">
                                                    {selectedContribution.brief.sources}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </section>

                                {/* Interview History if applicable */}
                                {selectedContribution.interviewHistory && selectedContribution.interviewHistory.length > 0 && (
                                    <section>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-4">{t_wizard.interview?.title || 'Interview Insights'}</h4>
                                        <div className="space-y-4">
                                            {selectedContribution.interviewHistory.map((qna, idx) => (
                                                <div key={idx} className="border-l-2 border-slate-200 dark:border-slate-700 pl-4 py-1">
                                                    <p className="text-xs font-bold text-slate-900 dark:text-white mb-1">{qna.question}</p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{qna.answer}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Outline if applicable */}
                                {selectedContribution.generatedOutline && selectedContribution.generatedOutline.sections.length > 0 && (
                                    <section>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-4">{t_wizard.outline?.title || 'Generated Outline'}</h4>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3">
                                            {selectedContribution.generatedOutline.sections.map((section, idx) => (
                                                <div key={idx} className="flex gap-3">
                                                    <span className="text-primary-500 font-mono text-xs">{idx + 1}.</span>
                                                    <span className="text-sm font-medium dark:text-slate-200">{section.heading}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex gap-3">
                                <button
                                    onClick={() => setSelectedContribution(null)}
                                    className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Close
                                </button>
                                <Link
                                    href={`/contribute/wizard?id=${selectedContribution.id}`}
                                    className="flex-[2] px-4 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                >
                                    Continue Journey
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7m0 0l-7 7m7-7H6" /></svg>
                                </Link>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
