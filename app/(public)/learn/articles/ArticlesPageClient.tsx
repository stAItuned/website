'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArticleCard } from '@/components/ArticleCard'
import { useLearnLocale } from '@/lib/i18n'
import { OfflineArticlesList } from '@/components/pwa'
import { usePWADetection } from '@/hooks/usePWADetection'

interface Article {
    title: string
    slug: string
    cover?: string
    author?: string
    date: string
    meta?: string
    readingTime?: number
    target?: string
    language?: string
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
}

const PAGE_SIZE = 12

export function ArticlesPageClient({ articles, levels, articleCounts }: ArticlesPageClientProps) {
    const { t } = useLearnLocale()
    const searchParams = useSearchParams()
    const router = useRouter()
    const levelFromUrl = searchParams.get('level')
    const { isPWA } = usePWADetection()

    const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')
    const [showOfflineSection, setShowOfflineSection] = useState(false)

    // Set initial level from URL param
    useEffect(() => {
        if (levelFromUrl && ['newbie', 'midway', 'expert'].includes(levelFromUrl.toLowerCase())) {
            setSelectedLevel(levelFromUrl.toLowerCase())
        }
    }, [levelFromUrl])

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

    // Filter articles by selected level and search
    const filteredArticles = useMemo(() => {
        let result = articles
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
        return result
    }, [articles, selectedLevel, searchQuery])

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
        <div className="max-w-7xl mx-auto mt-16 md:mt-[100px] mb-24 px-4 lg:px-8">
            {/* Hero Section with Stats */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-5 sm:p-8 lg:p-12 mb-6 sm:mb-10">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

                <div className="relative z-10">
                    {/* Breadcrumb + Free Badge Row */}
                    <div className="relative flex items-center mb-4 sm:mb-6">
                        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <span>/</span>
                            <Link href="/learn" className="hover:text-white transition-colors">Learn</Link>
                            <span>/</span>
                            <span className="text-white font-medium">Articles</span>
                        </nav>

                        {/* Centered badge */}
                        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium border border-emerald-500/30 absolute left-1/2 -translate-x-1/2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            100% {t.articlesPage.privacyNote.includes('Privacy') ? 'Free' : 'Gratis'} • No Paywall • Ever
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 sm:gap-8">
                        <div className="space-y-3 sm:space-y-4 max-w-2xl">

                            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white leading-tight">
                                {t.articlesPage.title}<span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">{t.articlesPage.highlight}</span>
                            </h1>

                            <p className="text-sm sm:text-lg text-slate-300 leading-relaxed">
                                {t.articlesPage.description}
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
                            <div className="text-center p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                                <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-0.5 sm:mb-1">{articleCounts.all}</div>
                                <div className="text-[10px] sm:text-xs lg:text-sm text-slate-400">{t.articlesPage.stats.articles}</div>
                            </div>
                            <div className="text-center p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                                <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-0.5 sm:mb-1">{Math.round(totalReadingTime / 60)}h</div>
                                <div className="text-[10px] sm:text-xs lg:text-sm text-slate-400">{t.articlesPage.stats.content}</div>
                            </div>
                            <div className="text-center p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                                <div className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-0.5 sm:mb-1">3</div>
                                <div className="text-[10px] sm:text-xs lg:text-sm text-slate-400">{t.articlesPage.stats.levels}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search + Filter Bar */}
            <div className="sticky top-20 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg py-2 sm:py-4 -mx-4 px-4 lg:-mx-8 lg:px-8 mb-6 sm:mb-8 border-b border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center justify-between max-w-full">
                    {/* Search */}
                    <div className="relative w-full sm:w-80 flex-shrink-0">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder={t.articlesPage.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Level Filter Pills */}
                    <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
                            <button
                                onClick={() => handleLevelChange(null)}
                                className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all min-h-[36px] sm:min-h-[44px] ${selectedLevel === null
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                {t.articlesPage.all} ({articleCounts.all})
                            </button>
                            {levels.map((level) => {
                                const isSelected = selectedLevel === level.id
                                const count = articleCounts[level.id as keyof typeof articleCounts]
                                return (
                                    <button
                                        key={level.id}
                                        onClick={() => handleLevelChange(isSelected ? null : level.id)}
                                        className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all min-h-[36px] sm:min-h-[44px] ${isSelected
                                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        {level.emoji} {level.name} ({count})
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Level Explainer Cards (collapsed by default, show only when filtering) */}
            {selectedLevel && (
                <div className="mb-8 animate-in slide-in-from-top-2 duration-300">
                    {levels.filter(l => l.id === selectedLevel).map((level) => (
                        <div key={level.id} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <span className="text-3xl">{level.emoji}</span>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{level.name} Level</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{level.description}</p>
                            </div>
                            <button
                                onClick={() => handleLevelChange(null)}
                                className="ml-auto p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                aria-label="Clear filter"
                            >
                                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Offline Articles Section - Only visible in PWA mode */}
            {isPWA && (
                <div className="mb-8 animate-in fade-in duration-300">
                    <button
                        onClick={() => setShowOfflineSection(!showOfflineSection)}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl">📥</span>
                            <span className="font-medium text-emerald-800 dark:text-emerald-300">
                                Articoli Salvati Offline
                            </span>
                        </div>
                        <svg
                            className={`w-5 h-5 text-emerald-600 dark:text-emerald-400 transition-transform ${showOfflineSection ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {showOfflineSection && (
                        <div className="mt-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-800">
                            <OfflineArticlesList />
                        </div>
                    )}
                </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {searchQuery || selectedLevel ? (
                        <>Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{filteredArticles.length}</span> results</>
                    ) : (
                        <>All <span className="font-semibold text-slate-700 dark:text-slate-200">{articleCounts.all}</span> articles</>
                    )}
                </p>

                {/* Contributor CTA - inline */}
                <button
                    onClick={() => document.getElementById('contributor-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
                >
                    <span>{t.articlesPage.writeCTA}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </button>
            </div>

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
    )
}

/**
 * Inline contributor application form
 * Sends to /api/contributors/apply which triggers Telegram notification
 */
function ContributorInlineForm() {
    const { t } = useLearnLocale()
    const [isExpanded, setIsExpanded] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', expertise: '', consent: false })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim() || !formData.email.trim() || !formData.expertise.trim()) {
            setStatus('error')
            setMessage('Please fill in all fields')
            return
        }
        if (!formData.consent) {
            setStatus('error')
            setMessage('Please accept the privacy policy')
            return
        }

        setStatus('loading')
        try {
            const res = await fetch('/api/contributors/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    expertise: formData.expertise,
                    bio: `Quick application from /learn/articles`,
                    source: 'articles-inline-form',
                    website: '', // honeypot
                }),
            })

            if (res.ok) {
                setStatus('success')
                setMessage('🎉 Application received! We\'ll be in touch soon.')
                setFormData({ name: '', email: '', expertise: '', consent: false })
            } else {
                const data = await res.json().catch(() => ({}))
                setStatus('error')
                setMessage(data.error || 'Something went wrong')
            }
        } catch {
            setStatus('error')
            setMessage('Connection error. Please try again.')
        }
    }

    return (
        <div id="contributor-form" className="mt-16 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 border border-slate-700/50">
            {status === 'success' ? (
                <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/20 mb-4">
                        <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-lg font-semibold text-white">{message}</p>
                    <p className="text-sm text-slate-400 mt-2">Check your inbox for next steps.</p>
                </div>
            ) : !isExpanded ? (
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

                    <button
                        onClick={() => setIsExpanded(true)}
                        className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold shadow-lg hover:shadow-xl transition-all group"
                    >
                        {t.articlesPage.writingStart}
                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span>✍️</span> {t.articlesPage.writingStart}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">{t.articlesPage.writingResponseTime}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsExpanded(false)}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                            disabled={status === 'loading'}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            required
                            disabled={status === 'loading'}
                        />
                    </div>

                    <textarea
                        placeholder="What article would you like to write? (e.g. 'A guide to fine-tuning LLMs for RAG')"
                        value={formData.expertise}
                        onChange={(e) => setFormData(prev => ({ ...prev, expertise: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        rows={2}
                        required
                        disabled={status === 'loading'}
                    />

                    {status === 'error' && (
                        <p className="text-sm text-red-400">{message}</p>
                    )}

                    {/* Privacy consent */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={formData.consent}
                            onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                            className="mt-0.5 w-4 h-4 rounded border-slate-500 bg-slate-700 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
                            disabled={status === 'loading'}
                        />
                        <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                            {t.articlesPage.privacyNote.split('Privacy Policy')[0]}
                            <a href="/privacy" target="_blank" className="text-primary-400 hover:underline">
                                Privacy Policy
                            </a>
                            {t.articlesPage.privacyNote.split('Privacy Policy')[1]}
                        </span>
                    </label>

                    <div className="flex items-center justify-between gap-4">
                        <p className="text-xs text-slate-500">
                            {t.articlesPage.writingResponseTime}
                        </p>
                        <button
                            type="submit"
                            disabled={status === 'loading' || !formData.consent}
                            className="px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-400 text-white font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                        >
                            {status === 'loading' ? t.articlesPage.writingSending : t.articlesPage.writingSend}
                        </button>
                    </div>

                    {/* Honeypot */}
                    <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
                </form>
            )}
        </div>
    )
}
