'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArticleCard } from '@/components/ArticleCard'

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
    const searchParams = useSearchParams()
    const levelFromUrl = searchParams.get('level')

    const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')

    // Set initial level from URL param
    useEffect(() => {
        if (levelFromUrl && ['newbie', 'midway', 'expert'].includes(levelFromUrl.toLowerCase())) {
            setSelectedLevel(levelFromUrl.toLowerCase())
        }
    }, [levelFromUrl])

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
        <div className="max-w-7xl mx-auto mt-[100px] mb-24 px-4 lg:px-8">
            {/* Hero Section with Stats */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 sm:p-12 mb-10">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

                <div className="relative z-10">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                        <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/learn" className="hover:text-white transition-colors">Learn</Link>
                        <span>/</span>
                        <span className="text-white font-medium">Articles</span>
                    </nav>

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium border border-emerald-500/30">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                100% Free • No Paywall • Ever 
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                AI Knowledge,
                                <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent"> Distilled</span>
                            </h1>

                            <p className="text-lg text-slate-300 leading-relaxed">
                                Practical guides, benchmarks, and deep dives. Written by practitioners,
                                reviewed by experts. No fluff, just actionable knowledge.
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 lg:gap-6">
                            <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{articleCounts.all}</div>
                                <div className="text-xs sm:text-sm text-slate-400">Articles</div>
                            </div>
                            <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{Math.round(totalReadingTime / 60)}h</div>
                                <div className="text-xs sm:text-sm text-slate-400">Content</div>
                            </div>
                            <div className="text-center p-4 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
                                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">3</div>
                                <div className="text-xs sm:text-sm text-slate-400">Levels</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search + Filter Bar */}
            <div className="sticky top-20 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg py-4 -mx-4 px-4 lg:-mx-8 lg:px-8 mb-8 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    {/* Search */}
                    <div className="relative w-full sm:w-80">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Level Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                        <button
                            onClick={() => handleLevelChange(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedLevel === null
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                        >
                            All ({articleCounts.all})
                        </button>
                        {levels.map((level) => {
                            const isSelected = selectedLevel === level.id
                            const count = articleCounts[level.id as keyof typeof articleCounts]
                            return (
                                <button
                                    key={level.id}
                                    onClick={() => handleLevelChange(isSelected ? null : level.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${isSelected
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
                <Link
                    href="/learn#contribute"
                    className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
                >
                    <span>✍️ Write for us</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                </Link>
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
                        No articles found
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        {searchQuery ? `No results for "${searchQuery}"` : 'Try selecting a different level or check back soon.'}
                    </p>
                    <button
                        onClick={() => { setSearchQuery(''); handleLevelChange(null) }}
                        className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-500 transition-colors"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
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
                        Next
                        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Bottom CTA Section */}
            <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-500 to-cyan-500 p-8 sm:p-12">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    <div className="space-y-4 max-w-xl">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white">
                            Share Your Knowledge
                        </h2>
                        <p className="text-lg text-white/90">
                            Got insights to share? Join our contributor program. Get editorial support, reach thousands of AI practitioners, and build your reputation.
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-white/80">
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                                Editorial review
                            </span>
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                                Build your portfolio
                            </span>
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                                Reach thousands
                            </span>
                        </div>
                    </div>

                    <Link
                        href="/learn#contribute"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary-600 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        Become a Contributor
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    )
}
