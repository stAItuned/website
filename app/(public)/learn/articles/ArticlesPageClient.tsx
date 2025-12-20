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
                    {/* Breadcrumb + Free Badge Row */}
                    <div className="relative flex items-center mb-6">
                        <nav className="flex items-center gap-2 text-sm text-slate-400">
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                            <span>/</span>
                            <Link href="/learn" className="hover:text-white transition-colors">Learn</Link>
                            <span>/</span>
                            <span className="text-white font-medium">Articles</span>
                        </nav>

                        {/* Centered badge */}
                        <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium border border-emerald-500/30 absolute left-1/2 -translate-x-1/2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            100% Free • No Paywall • Ever
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        <div className="space-y-4 max-w-2xl">

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight whitespace-nowrap">
                                AI Knowledge, <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">Distilled</span>
                            </h1>

                            <p className="text-lg text-slate-300 leading-relaxed">
                                Practical guides, benchmarks, and deep dives. Written by practitioners,
                                reviewed by experts. <strong>No fluff, just actionable knowledge.</strong>
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
                <button
                    onClick={() => document.getElementById('contributor-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
                >
                    <span>✍️ Write for us</span>
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
                                Build Your AI Reputation
                            </h3>
                        </div>
                        <p className="text-slate-300 max-w-xl">
                            Write for stAItuned and join a growing community of AI practitioners.
                            <span className="text-white font-medium"> Gain visibility, build your portfolio, and connect with professionals</span> who share your passion.
                        </p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-400">✓</span> 10k+ LinkedIn reach
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-400">✓</span> Editorial support
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-emerald-400">✓</span> Portfolio builder
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsExpanded(true)}
                        className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold shadow-lg hover:shadow-xl transition-all group"
                    >
                        Start Writing
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
                                <span>✍️</span> Start Writing
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">Just a quick intro – no commitment required</p>
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
                            I agree to the{' '}
                            <a href="/privacy" target="_blank" className="text-primary-400 hover:underline">
                                Privacy Policy
                            </a>
                            . We'll only use your data to contact you about contributing.
                        </span>
                    </label>

                    <div className="flex items-center justify-between gap-4">
                        <p className="text-xs text-slate-500">
                            We'll get back to you within 48h
                        </p>
                        <button
                            type="submit"
                            disabled={status === 'loading' || !formData.consent}
                            className="px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-400 text-white font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                        >
                            {status === 'loading' ? 'Sending...' : 'Send'}
                        </button>
                    </div>

                    {/* Honeypot */}
                    <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
                </form>
            )}
        </div>
    )
}
