'use client'

import { useState } from 'react'
import { HomeHero } from './HomeHero'
import { TickerArticle } from '@/components/ui/ArticleTicker'
import { ArticleCard } from '@/components/ArticleCard'
import Link from 'next/link'
import { useLearnLocale, homeTranslations } from '@/lib/i18n'
import { useCTADismiss } from '@/lib/hooks/useCTADismiss'

interface HomePageClientProps {
    tickerArticles: TickerArticle[]
    contributorCount: number
    articleCount: number
}

type ArticleFilter = 'recent' | 'trending'

export function HomePageClient({ tickerArticles, contributorCount, articleCount }: HomePageClientProps) {
    const { locale } = useLearnLocale()
    const t = homeTranslations[locale]
    const { shouldShow: shouldShowIntermezzo, dismiss: dismissIntermezzo } = useCTADismiss('intermezzo-cta', 30)

    const [articleFilter, setArticleFilter] = useState<ArticleFilter>('recent')

    // Limit to 6 articles (3 top, 3 bottom)
    const latestPosts = tickerArticles.slice(0, 6)

    // Sort by date (recent) or keep as-is (trending = already sorted by views from server)
    const displayedPosts = articleFilter === 'recent'
        ? [...latestPosts].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
        : latestPosts

    const firstRowPosts = displayedPosts.slice(0, 3)
    const secondRowPosts = displayedPosts.slice(3, 6)

    return (
        <>
            {/* 1. Hero Section */}
            <HomeHero contributorCount={contributorCount} articleCount={articleCount} />

            {/* 2. Authority Feed (Articles with Toggle) */}
            <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto" id="articles">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            {t.articles.title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            {t.articles.subtitle}
                        </p>
                    </div>

                    {/* Trending/Recent Toggle */}
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full p-1">
                        <button
                            onClick={() => setArticleFilter('trending')}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${articleFilter === 'trending'
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            🔥 {t.articles.trending}
                        </button>
                        <button
                            onClick={() => setArticleFilter('recent')}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${articleFilter === 'recent'
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            🆕 {t.articles.recent}
                        </button>
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

                {/* Mid-Grid Subtle CTA */}
                <div className="w-full my-8 py-6 px-6 border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-center md:text-left">
                        {t.articles.midSection.text}
                    </p>
                    <a
                        href="#newsletter" // Placeholder or smooth scroll to footer newsletter if exists, or lead magnet
                        className="text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-1"
                        onClick={(e) => {
                            e.preventDefault();
                            // Logic to open newsletter modal or scroll
                            window.location.href = '/audit'; // Using Audit as main soft convert for now
                        }}
                    >
                        {t.articles.midSection.cta} →
                    </a>
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
            <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-[#0f1117] dark:to-[#151925]">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-700">
                        <span className="inline-block text-4xl mb-4">🧭</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                            {t.leadMagnet.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">
                            {t.leadMagnet.description}
                        </p>
                        <a
                            href="/audit"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
                        >
                            <span>📥</span>
                            <span>{t.leadMagnet.cta}</span>
                        </a>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">
                            {t.leadMagnet.disclaimer}
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Intermezzo: Career OS CTA (with Dismiss) */}
            {shouldShowIntermezzo && (
                <section className="py-24 bg-slate-50 dark:bg-[#151925] border-y border-slate-200 dark:border-slate-800">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        {/* Italy Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 mb-8">
                            <span className="text-lg">🇮🇹</span>
                            <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                {t.intermezzo.badge}
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold mb-6 text-[#1A1E3B] dark:text-white">
                            {t.intermezzo.headline}
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                            {t.intermezzo.subtext}
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                href="/career-os"
                                className="px-8 py-3 rounded-full bg-[#1A1E3B] text-white font-bold hover:bg-[#383F74] transition-all shadow-lg"
                            >
                                {t.intermezzo.ctaCareerOS}
                            </Link>
                            <a
                                href="/audit"
                                className="px-8 py-3 rounded-full border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
                            >
                                📥 {t.intermezzo.ctaLeadMagnet}
                            </a>
                        </div>

                        {/* Dismiss button */}
                        <button
                            onClick={dismissIntermezzo}
                            className="mt-6 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors underline underline-offset-2"
                        >
                            {t.intermezzo.dismiss}
                        </button>
                    </div>
                </section>
            )}

            {/* Fallback: Keep Reading link when intermezzo is dismissed */}
            {!shouldShowIntermezzo && (
                <section className="py-12 text-center">
                    <a
                        href="#articles"
                        className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                        ↑ {t.intermezzo.keepReading}
                    </a>
                </section>
            )}
        </>
    )
}

