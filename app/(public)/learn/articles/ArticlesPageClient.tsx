'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArticleCard } from '@/components/ArticleCard'
import { useLearnLocale } from '@/lib/i18n'
import { getTopicHub } from '@/config/topics'
import { TopicsCarousel } from './components/TopicsCarousel'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { TopicGrid } from '@/components/TopicGrid'
import { getContentDateTime } from '@/lib/content-date'

interface Article {
    title: string
    slug: string
    cover?: string
    author?: string
    date: string
    updatedAt?: string
    meta?: string
    readingTime?: number
    target?: string
    language?: string
    primaryTopic?: string
    pageViews?: number
}

interface Level {
    id: string
    name: string
    emoji: string
    color: string
    description: string
}

interface ArticlesPageClientProps {
    articles: Article[]
    levels: Level[]
    articleCounts: {
        all: number
        newbie: number
        midway: number
        expert: number
    }
    topTopics: {
        name: string
        count: number
        slug: string
        description?: string
        icon?: string
    }[]
    topicCount: number
}

type SortOption = 'recent' | 'trending'

const PAGE_SIZE = 12

export function ArticlesPageClient({ articles, levels, articleCounts, topTopics, topicCount }: ArticlesPageClientProps) {
    const { t } = useLearnLocale()
    const searchParams = useSearchParams()
    const router = useRouter()
    const levelFromUrl = searchParams.get('level')

    const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState<SortOption>('recent')
    const [analyticsData, setAnalyticsData] = useState<Record<string, number>>({})
    const [showFilters, setShowFilters] = useState(false)

    // Set initial level from URL param
    useEffect(() => {
        if (levelFromUrl && ['newbie', 'midway', 'expert'].includes(levelFromUrl.toLowerCase())) {
            setSelectedLevel(levelFromUrl.toLowerCase())
        }
    }, [levelFromUrl])

    // Fetch analytics data for trending
    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const json = await res.json()
                if (json.success && Array.isArray(json.data)) {
                    const viewsMap: Record<string, number> = {}
                    json.data.forEach((item: any) => {
                        const slug = item.articleUrl?.split('/').pop()
                        if (slug) {
                            viewsMap[slug] = item.pageViews || 0
                        }
                    })
                    setAnalyticsData(viewsMap)
                }
            } catch (e) {
                console.error('Failed to fetch analytics', e)
            }
        }
        fetchAnalytics()
    }, [])

    // Handle PWA share_target - when content is shared to the app
    useEffect(() => {
        const sharedText = searchParams.get('text')
        const sharedTitle = searchParams.get('title')
        const sharedUrl = searchParams.get('url')

        // If shared content exists, use it as search query
        if (sharedText || sharedTitle || sharedUrl) {
            // Prefer text, then title, extract keywords from URL
            let query = ''
            if (sharedText) {
                query = sharedText
            } else if (sharedTitle) {
                query = sharedTitle
            } else if (sharedUrl) {
                // Extract article slug from URL if it's a stAItuned URL
                const urlMatch = sharedUrl.match(/learn\/[^/]+\/([^/]+)\/?$/)
                if (urlMatch) {
                    query = urlMatch[1].replace(/-/g, ' ')
                }
            }

            if (query) {
                setSearchQuery(query.substring(0, 100)) // Limit query length
                // Clean URL params to avoid re-triggering
                router.replace('/learn/articles', { scroll: false })
            }
        }
    }, [searchParams, router])

    // Filter and Sort articles
    const filteredArticles = useMemo(() => {
        let result = articles.map(a => ({
            ...a,
            pageViews: analyticsData[a.slug] || 0
        }))

        if (selectedLevel) {
            result = result.filter(a => a.target?.toLowerCase() === selectedLevel)
        }
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            result = result.filter(a =>
                a.title.toLowerCase().includes(query) ||
                a.meta?.toLowerCase().includes(query) ||
                a.author?.toLowerCase().includes(query)
            )
        }

        // Apply Sorting
        if (sortBy === 'trending') {
            result = result.sort((a, b) => (b.pageViews || 0) - (a.pageViews || 0))
        } else {
            // Default: Recent (Date desc)
            result = result.sort(
                (a, b) => getContentDateTime(b.date, b.updatedAt) - getContentDateTime(a.date, a.updatedAt)
            )
        }

        return result
    }, [articles, selectedLevel, searchQuery, sortBy, analyticsData])

    // Pagination
    const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE)
    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    )

    // Reset page when filter changes
    const handleLevelChange = (level: string | null) => {
        setSelectedLevel(level)
        setCurrentPage(1)
    }

    // Calculate total reading time
    const totalReadingTime = articles.reduce((acc, a) => acc + (a.readingTime || 0), 0)

    return (
        <div className="max-w-7xl mx-auto mt-16 md:mt-20 mb-16 px-4 sm:px-6 lg:px-8">
            {/* Hero Section with Stats */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-8 mb-4">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

                <div className="relative z-10">
                    {/* Breadcrumb Row */}
                    <div className="relative flex items-center justify-between mb-4">
                        <nav className="flex items-center gap-2 text-xs text-slate-400">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <span>/</span>
                            <Link href="/learn/articles" className="hover:text-white transition-colors">Learn</Link>
                            <span>/</span>
                            <span className="text-white font-medium">Articles</span>
                        </nav>

                        {/* Free Badge */}
                        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] sm:text-xs font-bold border border-emerald-500/20 shadow-sm shadow-emerald-900/20">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            100% {t.articlesPage.privacyNote.includes('Privacy') ? 'Free' : 'Gratis'} • No Paywall • Ever
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div className="max-w-3xl">
                            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
                                {t.articlesPage.title}<span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent ml-2">{t.articlesPage.highlight}</span>
                            </h1>
                            <p
                                className="text-sm text-slate-400 max-w-2xl leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: t.articlesPage.description }}
                            />
                        </div>

                        {/* Micro Stats Line */}
                        <div className="flex items-center gap-4 sm:gap-6 text-xs text-slate-400 border-t border-slate-700/50 pt-3 md:pt-0 md:border-t-0">
                            <div className="flex items-center gap-1.5">
                                <span className="text-white font-bold">{articleCounts.all}</span>
                                <span>{t.articlesPage.stats.articles}</span>
                            </div>
                            <div className="hidden sm:block w-px h-3 bg-slate-700" />
                            <div className="flex items-center gap-1.5">
                                <span className="text-white font-bold">{topTopics.length}</span>
                                <span>Topics</span>
                            </div>
                            <div className="hidden sm:block w-px h-3 bg-slate-700" />
                            <div className="flex items-center gap-1.5">
                                <span className="text-white font-bold">{Math.round(totalReadingTime / 60)}h</span>
                                <span>{t.articlesPage.stats.content}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rev 7: Topic Shelf (only when not filtering) */}
            {!searchQuery && !selectedLevel && (
                <TopicGrid topics={topTopics} />
            )}

            {/* Rev 5: Search Dominant Toolbar (Sticky) */}
            <div className="sticky top-20 z-40 mb-6 lg:mx-auto max-w-7xl">
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/20 dark:shadow-black/20 rounded-2xl p-2 transition-all">
                    <div className="flex items-center gap-2">

                        {/* Search (Compact) */}
                        <div className="relative flex-1 md:flex-none md:w-80 group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors pointer-events-none">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder={t.articlesPage.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                                className="w-full pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 border border-transparent focus:border-primary-500/50 rounded-xl text-sm font-medium focus:ring-0 transition-all placeholder:text-slate-400"
                            />
                        </div>

                        <div className="flex-1 hidden md:block" />

                        {/* Right Controls */}
                        <div className="flex items-center gap-3">

                            {/* Explicit Sort Segmented Control */}
                            <SegmentedControl
                                options={[
                                    { value: 'recent', label: <span className="flex items-center gap-1.5">🆕 {t.articlesPage.sort.recent}</span> },
                                    { value: 'trending', label: <span className="flex items-center gap-1.5">🔥 {t.articlesPage.sort.trending}</span> }
                                ]}
                                value={sortBy}
                                onChange={(val) => { setSortBy(val as SortOption); setCurrentPage(1); }}
                                size="sm"
                                className="bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50"
                            />

                            {/* Filter Toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${showFilters || selectedLevel ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-200 dark:bg-primary-900/20 dark:text-primary-400 dark:ring-primary-800' : 'bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-200'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                <span className="hidden sm:inline">Filters</span>
                            </button>
                        </div>
                    </div>

                    {/* Active Filters / Discovery Drawer */}
                    {(showFilters || selectedLevel) && (
                        <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-1">

                            {/* 1. Topics Section */}
                            <div className="mb-4 xl:hidden">
                                <span className="text-[10px] items-center gap-1 font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2 hidden sm:flex">
                                    Browse Topics
                                </span>
                                <TopicsCarousel topics={topTopics} />
                            </div>

                            {/* 2. Level Section */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Level:</span>
                                <button
                                    onClick={() => handleLevelChange(null)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedLevel === null
                                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
                                        }`}
                                >
                                    All
                                </button>
                                {levels.map((level) => (
                                    <button
                                        key={level.id}
                                        onClick={() => handleLevelChange(level.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${selectedLevel === level.id
                                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
                                            }`}
                                    >
                                        <span>{level.emoji}</span>
                                        {level.name}
                                    </button>
                                ))}

                                <div className="flex-1" />

                                {(selectedLevel || searchQuery) && (
                                    <button
                                        onClick={() => { handleLevelChange(null); setSearchQuery(''); setShowFilters(false); }}
                                        className="text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 underline decoration-red-500/30"
                                    >
                                        Reset all
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">



                {/* Articles Grid */}
                {paginatedArticles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {paginatedArticles.map((article, index) => (
                            <div
                                key={article.slug}
                                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <ArticleCard article={article} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            {t.articlesPage.noArticles}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            {searchQuery ? t.articlesPage.noResults.replace('{query}', searchQuery) : 'Try selecting a different level or check back soon.'}
                        </p>
                        <button
                            onClick={() => { setSearchQuery(''); handleLevelChange(null) }}
                            className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-500 transition-colors"
                        >
                            {t.articlesPage.clearFilters}
                        </button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group min-w-[44px] min-h-[44px]"
                        >
                            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            {t.articlesPage.previous}
                        </button>

                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum: number
                                if (totalPages <= 5) {
                                    pageNum = i + 1
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i
                                } else {
                                    pageNum = currentPage - 2 + i
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${pageNum === currentPage
                                            ? 'bg-primary-600 text-white shadow-md'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                        >
                            {t.articlesPage.next}
                            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Bottom CTA - Contributor Form */}
                <ContributorInlineForm />
            </div>
        </div >
    )
}

/**
 * Inline contributor CTA
 * Redirects users to the full /contribute flow
 */
function ContributorInlineForm() {
    const { t } = useLearnLocale()

    return (
        <div id="contributor-form" className="mt-16 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 border border-slate-700/50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center">
                            <span className="text-xl">✍️</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">
                            {t.articlesPage.writingTitle}
                        </h3>
                    </div>
                    <p className="text-slate-300 max-w-xl">
                        {t.articlesPage.writingSubtitle}
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
                        <span className="flex items-center gap-1.5">
                            <span className="text-emerald-400">✓</span> {t.articlesPage.writingBenefit1}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="text-emerald-400">✓</span> {t.articlesPage.writingBenefit2}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="text-emerald-400">✓</span> {t.articlesPage.writingBenefit3}
                        </span>
                    </div>
                </div>

                <Link
                    href="/contribute"
                    className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold shadow-lg hover:shadow-xl transition-all group"
                >
                    {t.articlesPage.writingStart}
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </Link>
            </div>
        </div>
    )
}
