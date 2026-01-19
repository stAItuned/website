'use client'

import { useState, useEffect } from 'react'
import { HomeHero } from './HomeHero'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { TickerArticle } from '@/components/ui/ArticleTicker'
import { NewsletterModal } from '@/components/ui/NewsletterModal'
import { ArticleCard } from '@/components/ArticleCard'
import Link from 'next/link'
import { useLearnLocale, homeTranslations } from '@/lib/i18n'


interface HomePageClientProps {
    tickerArticles: TickerArticle[]
    contributorCount: number
    articleCount: number
}

type ArticleFilter = 'recent' | 'trending'

export function HomePageClient({ tickerArticles, contributorCount, articleCount }: HomePageClientProps) {
    const { locale } = useLearnLocale()
    const t = homeTranslations[locale]


    const [articleFilter, setArticleFilter] = useState<ArticleFilter>('recent')
    const [trendingArticles, setTrendingArticles] = useState<TickerArticle[] | null>(null)
    const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false)

    // Limit to 6 articles (3 top, 3 bottom)
    const latestPosts = tickerArticles.slice(0, 6)

    // Fetch trending articles on mount
    useEffect(() => {
        const fetchTrending = async () => {
            // Avoid double fetching
            if (trendingArticles) return

            try {
                const res = await fetch('/api/analytics')
                if (!res.ok) return
                const json = await res.json()
                if (json.success && Array.isArray(json.data)) {
                    // Map API data to TickerArticle format
                    const mapped: TickerArticle[] = json.data.slice(0, 6).map((item: any) => {
                        // If date is missing, use Epoch to avoid showing "New" badge (which compares with today)
                        const date = item.date || item.updatedAt || new Date(0).toISOString()
                        const d = new Date(date)
                        const now = new Date()
                        const isToday = d.getDate() === now.getDate() &&
                            d.getMonth() === now.getMonth() &&
                            d.getFullYear() === now.getFullYear()

                        return {
                            title: item.title,
                            slug: item.articleUrl.split('/').pop(),
                            cover: item.cover,
                            author: item.author,
                            date: date,
                            readingTime: item.readingTime, // corrected from readTime
                            target: item.target,
                            language: item.language,
                            meta: item.meta,
                            isNew: isToday
                        }
                    })
                    setTrendingArticles(mapped)
                }
            } catch (e) {
                console.error("Failed to fetch trending articles", e)
            }
        }

        fetchTrending()
    }, [])

    // THIS IS A PLACEHOLDER - I NEED TO FIX API FIRST
    // Sort by date (recent) or keep as-is (trending = sorted by views from server)
    const displayedPosts = articleFilter === 'recent'
        ? [...latestPosts].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
        : (trendingArticles && trendingArticles.length > 0 ? trendingArticles : latestPosts)

    const firstRowPosts = displayedPosts.slice(0, 3)
    const secondRowPosts = displayedPosts.slice(3, 6)

    return (
        <>
            {/* 1. Hero Section */}
            <HomeHero contributorCount={contributorCount} articleCount={articleCount} />

            {/* 2. Authority Feed (Articles with Toggle) */}
            <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto" id="articles">
                <div className="flex flex-col gap-8 mb-12">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            {t.articles.title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            {t.articles.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6">
                        <div className="hidden md:block" />

                        {/* Trending/Recent Toggle - Centered */}
                        <div className="flex justify-center">
                            <SegmentedControl
                                options={[
                                    { value: 'trending', label: `🔥 ${t.articles.trending}` },
                                    { value: 'recent', label: `🆕 ${t.articles.recent}` }
                                ]}
                                value={articleFilter}
                                onChange={(val) => setArticleFilter(val as ArticleFilter)}
                            />
                        </div>

                        {/* View All Button - Right aligned */}
                        <div className="flex justify-center md:justify-end">
                            <Link
                                href="/learn/articles"
                                className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 font-bold text-sm shadow-sm transition-all hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 dark:hover:text-slate-900 hover:border-transparent hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5"
                            >
                                <span>{t.articles.viewAll}</span>
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-white group-hover:bg-white group-hover:text-amber-500 dark:group-hover:bg-slate-900 dark:group-hover:text-amber-500 transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                                        <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* First Row (3 Articles) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {firstRowPosts.map((post) => (
                        <ArticleCard
                            key={post.slug}
                            article={post}
                        />
                    ))}
                </div>

                {/* Mid-Grid Newsletter CTA - High Contrast & Ultra Slim */}
                <div className="w-full my-6 relative group">
                    {/* Animated Outer Glow (Subtle) */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/50 via-orange-500/50 to-amber-500/50 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000"></div>

                    <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
                        {/* High Contrast Background Effects */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/20 via-slate-900/0 to-slate-900/0 opacity-100"></div>
                        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl"></div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 md:px-8 md:py-6 relative z-10">
                            <div className="text-center md:text-left flex-1 min-w-0">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-1.5">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                                        </span>
                                        {t.articles.midSection.socialProof}
                                    </div>
                                </div>

                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 tracking-tight">
                                    {t.articles.midSection.title}
                                </h3>

                                <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed line-clamp-2 sm:line-clamp-1">
                                    {t.articles.midSection.subtitle}
                                </p>
                            </div>

                            <button
                                onClick={() => setIsNewsletterModalOpen(true)}
                                className="w-full sm:w-auto shrink-0 group/btn relative inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-2.5 rounded-lg bg-white text-slate-900 font-bold text-sm transition-all hover:bg-amber-50 hover:scale-105 active:scale-95 shadow-lg shadow-amber-900/20"
                            >
                                <span>{t.articles.midSection.cta}</span>
                                <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Second Row (3 Articles) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {secondRowPosts.map((post) => (
                        <ArticleCard
                            key={post.slug}
                            article={post}
                        />
                    ))}
                </div>

                <div className="mt-16 flex justify-center">
                    <Link
                        href="/learn/articles"
                        className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-slate-50 dark:bg-slate-900/50 border-2 border-amber-300 dark:border-amber-600/50 text-amber-700 dark:text-amber-400 font-bold transition-all hover:bg-gradient-to-r hover:from-amber-400 hover:to-amber-500 dark:hover:from-amber-500 dark:hover:to-amber-600 hover:text-white dark:hover:text-slate-900 hover:border-transparent dark:hover:border-transparent hover:shadow-xl hover:shadow-amber-500/20 dark:hover:shadow-amber-400/30 hover:-translate-y-1"
                    >
                        <span>{t.articles.viewAll}</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </section>

            {/* 2b. Lead Magnet: Role-Fit Guide */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900 dark:bg-[#0f1117]"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>

                {/* Glow effects */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl"></div>

                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                        </svg>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                        {t.leadMagnet.title}
                    </h3>

                    <div className="max-w-2xl mx-auto mb-10">
                        <p className="text-lg text-slate-300 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: t.leadMagnet.description.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <Link
                            href="/role-fit-audit"
                            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95"
                        >
                            <span className="mr-2 text-xl">✨</span>
                            {t.leadMagnet.cta}
                            <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </Link>
                    </div>

                    <p className="mt-6 text-sm text-slate-500 font-medium flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        {t.leadMagnet.disclaimer}
                    </p>
                </div>
            </section >


            {/* Newsletter Modal */}
            <NewsletterModal
                isOpen={isNewsletterModalOpen}
                onClose={() => setIsNewsletterModalOpen(false)}
            />
        </>
    )
}

