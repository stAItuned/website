'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useLearnLocale } from '@/lib/i18n'
import { useFastAnalytics, formatAnalyticsNumber } from '@/lib/hooks/useFastAnalytics'

interface ArticleCardProps {
    article: {
        _id: string
        title: string
        slug: string
        meta?: string
        url: string
        cover?: string
        target?: string
        readingTime: number
        imagePath?: string
        date?: string
    }
    /** Topic color for accents */
    accentColor: string
    /** Variant: 'list' for deep dives, 'compact' for sidebar */
    variant?: 'list' | 'compact'
    /** Index for numbered items */
    index?: number
    /** Optional view count from parent (avoids refetch) */
    pageViews?: number
}

// Helper to format date
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

/**
 * ArticleCard (Topics Local) - Premium card matching stAItuned design patterns
 * 
 * Features:
 * - List variant with hover shadow and image zoom
 * - Compact variant with numbered badges
 * - Consistent level badge styling
 * - Smooth micro-animations
 */
export function ArticleCard({ article, accentColor, variant = 'list', index, pageViews }: ArticleCardProps) {
    const { t } = useLearnLocale()

    const levelColors: Record<string, { bg: string, text: string, border: string }> = {
        newbie: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' },
        midway: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' },
        expert: { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/20' },
    }

    // Only fetch if pageViews not provided
    const { data: analyticsData, loading: analyticsLoading } = useFastAnalytics({
        slug: article.slug,
        enabled: pageViews === undefined
    })

    // Use passed views or fetched views
    const views = pageViews !== undefined ? pageViews : (analyticsData?.pageViews || 0)
    const isLoading = pageViews === undefined && analyticsLoading

    const level = article.target?.toLowerCase() || 'general'
    const levelStyle = levelColors[level] || { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-700' }

    // Sidebar Compact Variant
    if (variant === 'compact') {
        return (
            <Link href={article.url} className="block group">
                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 group-hover:-translate-x-0.5">
                    {/* Number badge with accent color */}
                    {index !== undefined && (
                        <div
                            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white mt-0.5 shadow-lg transition-transform duration-300 group-hover:scale-110"
                            style={{
                                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                                boxShadow: `0 4px 12px -2px ${accentColor}40`
                            }}
                        >
                            {index + 1}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 leading-snug mb-2">
                            {article.title}
                        </h4>
                        <div className="flex items-center gap-2.5 text-xs text-slate-500">
                            {article.target && (
                                <span className={`uppercase font-bold text-[10px] px-2 py-1 rounded-md border ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}>
                                    {article.target === 'Newbie' && '🌱 '}
                                    {article.target === 'Midway' && '⚡ '}
                                    {article.target === 'Expert' && '🔬 '}
                                    {article.target}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {article.readingTime} min
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        )
    }

    // List Variant (Deep Dives) - Premium Design
    return (
        <Link
            href={article.url}
            className="group relative flex flex-col sm:flex-row gap-5 sm:gap-6 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
        >
            {/* Subtle accent glow on hover */}
            <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl -z-10"
                style={{ background: `linear-gradient(135deg, ${accentColor}15, transparent)` }}
            />

            {/* Cover image with overlay */}
            {article.cover && (
                <div className="w-full sm:w-52 h-36 relative flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                        src={article.cover?.startsWith('/') || article.cover?.startsWith('http')
                            ? article.cover
                            : `${article.imagePath || ''}/${article.cover}`}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 640px) 100vw, 208px"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2.5 mb-3 text-xs">
                    {/* Target / Level - First */}
                    {article.target && (
                        <span className={`uppercase font-bold px-2.5 py-1 rounded-md border ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}>
                            {article.target === 'Newbie' && '🌱 '}
                            {article.target === 'Midway' && '⚡ '}
                            {article.target === 'Expert' && '🔬 '}
                            {article.target}
                        </span>
                    )}

                    {/* Separator if target exists */}
                    {article.target && <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />}

                    {/* Date */}
                    {article.date && (
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                            {formatDate(article.date)}
                        </span>
                    )}

                    {/* Views */}
                    {views > 0 && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {isLoading ? '...' : formatAnalyticsNumber(views)}
                            </span>
                        </>
                    )}

                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />

                    {/* Reading Time */}
                    <span className="text-slate-500 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {article.readingTime} {t.topicHub.card.minRead}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                    {article.title}
                </h3>

                {/* Description */}
                {article.meta && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {article.meta}
                    </p>
                )}

                {/* Read more with slide-in animation */}
                <div className="mt-auto flex items-center text-sm font-semibold text-primary-600 dark:text-primary-400 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    {t.topicHub.card.readArticle}
                    <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </div>
            </div>
        </Link>
    )
}
