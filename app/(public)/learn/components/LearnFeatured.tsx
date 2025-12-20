'use client'

import Link from 'next/link'
import { ArticleCard } from '@/components/ArticleCard'
import { useLearnLocale } from '@/lib/i18n'

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

interface LearnFeaturedProps {
    articles: Article[]
    maxArticles?: number
    className?: string
}

// Available tags for browsing (using existing targets for now)
const BROWSE_TAGS = [
    { id: 'newbie', label: 'Newbie', color: 'emerald' },
    { id: 'midway', label: 'Midway', color: 'amber' },
    { id: 'expert', label: 'Expert', color: 'rose' },
]

/**
 * Featured articles section with tag browsing
 * 
 * Shows max 6 featured articles + browse by level tags
 */
export function LearnFeatured({ articles, maxArticles = 6, className = '' }: LearnFeaturedProps) {
    const { t } = useLearnLocale()

    const displayArticles = articles.slice(0, maxArticles)

    if (displayArticles.length === 0) {
        return null
    }

    return (
        <section className={`${className}`}>
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {t.featured.title}
                </h2>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2">
                    {BROWSE_TAGS.map((tag) => {
                        const colorClasses = {
                            emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700/50 dark:hover:bg-emerald-900/50',
                            amber: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700/50 dark:hover:bg-amber-900/50',
                            rose: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-700/50 dark:hover:bg-rose-900/50',
                        }

                        return (
                            <Link
                                key={tag.id}
                                href={`/learn?target=${tag.id}`}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${colorClasses[tag.color as keyof typeof colorClasses]}`}
                            >
                                {tag.label}
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayArticles.map((article) => (
                    <div className="h-full" key={article.slug}>
                        <ArticleCard
                            article={{
                                title: article.title,
                                slug: article.slug,
                                cover: article.cover,
                                author: article.author,
                                date: article.date,
                                meta: article.meta,
                                readingTime: article.readingTime,
                                target: article.target,
                                language: article.language
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* View All CTA */}
            <div className="mt-8 text-center">
                <Link
                    href="/learn?target=newbie"
                    className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
                >
                    {t.featured.cta}
                    <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </Link>
            </div>
        </section>
    )
}
