'use client'

import Link from 'next/link'
import { useLearnLocale } from '@/lib/i18n'

interface Article {
    _id: string
    title: string
    slug: string
    date: string
    meta?: string
    url: string
    cover?: string
    target?: string
    readingTime: number
    imagePath?: string
}

interface StartHereSectionProps {
    articles: Article[]
    accentColor: string
}

/**
 * StartHereSection - Full-width "Percorso Consigliato" section
 * 
 * Redesigned from sidebar to prominent full-width section
 * positioned before the Definition Card for better UX.
 * 
 * Features:
 * - Horizontal card layout with numbered badges
 * - Gradient border on hover
 * - Level-based color coding
 * - Responsive grid layout
 */
export function StartHereSection({ articles, accentColor }: StartHereSectionProps) {
    const { t, locale } = useLearnLocale()

    if (!articles || articles.length === 0) return null

    // Subtitle based on locale
    const subtitle = locale === 'it'
        ? 'Segui questo percorso consigliato'
        : 'Follow this recommended learning path'

    const levelColors: Record<string, { bg: string, text: string, border: string, gradient: string }> = {
        newbie: {
            bg: 'bg-emerald-500/10',
            text: 'text-emerald-600 dark:text-emerald-400',
            border: 'border-emerald-500/20',
            gradient: 'from-emerald-500 to-teal-500'
        },
        midway: {
            bg: 'bg-amber-500/10',
            text: 'text-amber-600 dark:text-amber-400',
            border: 'border-amber-500/20',
            gradient: 'from-amber-500 to-orange-500'
        },
        expert: {
            bg: 'bg-rose-500/10',
            text: 'text-rose-600 dark:text-rose-400',
            border: 'border-rose-500/20',
            gradient: 'from-rose-500 to-pink-500'
        },
    }

    return (
        <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{
                        background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)`,
                        border: `1px solid ${accentColor}30`
                    }}
                >
                    🏁
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {t.topicHub.sidebar.startHere}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Articles Grid - Horizontal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {articles.map((article, idx) => {
                    const level = article.target?.toLowerCase() || 'general'
                    const levelStyle = levelColors[level] || {
                        bg: 'bg-slate-100 dark:bg-slate-800',
                        text: 'text-slate-600 dark:text-slate-400',
                        border: 'border-slate-200 dark:border-slate-700',
                        gradient: 'from-slate-500 to-slate-600'
                    }

                    return (
                        <Link
                            key={article._id}
                            href={article.url}
                            className="group relative flex items-start gap-4 p-4 rounded-2xl
                                       bg-white dark:bg-slate-900 
                                       border border-slate-200 dark:border-slate-800
                                       hover:border-transparent hover:shadow-xl
                                       transition-all duration-300 hover:-translate-y-1"
                        >
                            {/* Gradient border on hover */}
                            <div
                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                                style={{
                                    background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)`,
                                    padding: '1px'
                                }}
                            />

                            {/* Number Badge */}
                            <div
                                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
                                style={{
                                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                                    boxShadow: `0 4px 12px -2px ${accentColor}40`
                                }}
                            >
                                {idx + 1}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                                    {article.title}
                                </h3>

                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                    {/* Level Badge */}
                                    {article.target && (
                                        <span className={`uppercase font-bold px-2 py-1 rounded-md border ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}>
                                            {article.target === 'Newbie' && '🌱 '}
                                            {article.target === 'Midway' && '⚡ '}
                                            {article.target === 'Expert' && '🔬 '}
                                            {article.target}
                                        </span>
                                    )}

                                    {/* Reading Time */}
                                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {article.readingTime} min
                                    </span>
                                </div>
                            </div>

                            {/* Arrow on hover */}
                            <div className="flex-shrink-0 self-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}
