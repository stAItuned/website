'use client'

import Link from 'next/link'
import { TopicHub } from '@/config/topics'
import { useLearnLocale } from '@/lib/i18n'

interface TopicCardProps {
    topic: {
        _id: string
        title: string
        description: string
        icon?: string
        url: string
    }
    /** Hub configuration with colors */
    hubConfig: TopicHub
    /** Number of articles in this topic */
    articleCount: number
    /** Animation delay index for stagger effect */
    index?: number
}

/**
 * TopicCard - Premium Topic Hub Entry Card
 * 
 * Features:
 * - Animated gradient border on hover
 * - Glow effect behind card
 * - Topic-colored icon with gradient
 * - Smooth micro-animations
 */
export function TopicCard({ topic, hubConfig, articleCount, index = 0 }: TopicCardProps) {
    const { colorFrom, colorTo } = hubConfig
    const { t } = useLearnLocale()

    return (
        <Link
            href={topic.url}
            className="group relative block h-full stagger-item"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {/* Animated gradient border on hover */}
            <div
                className="absolute -inset-[2px] rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500"
                style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
            />
            <div
                className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-all duration-500"
                style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
            />

            {/* Glow effect on hover */}
            <div
                className="absolute inset-0 rounded-2xl blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
            />

            <div className="relative h-full flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
                {/* Icon + Count Row */}
                <div className="flex items-start justify-between mb-5">
                    {/* Icon with gradient background */}
                    <div className="relative">
                        <div
                            className="absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                            style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
                        />
                        <div
                            className="relative flex items-center justify-center w-14 h-14 rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110"
                            style={{
                                background: `linear-gradient(135deg, ${colorFrom}20, ${colorTo}15)`,
                                border: `1px solid ${colorFrom}30`
                            }}
                        >
                            <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
                                {hubConfig.icon || topic.icon || '📚'}
                            </span>
                        </div>
                    </div>

                    {/* Article count badge */}
                    <span
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300"
                        style={{
                            background: `${colorFrom}10`,
                            color: colorFrom,
                            border: `1px solid ${colorFrom}20`
                        }}
                    >
                        {articleCount} {articleCount === 1 ? t.topicsIndex.card.article : t.topicsIndex.card.articles}
                    </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
                    {topic.title}
                </h2>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-5 flex-grow">
                    {topic.description}
                </p>

                {/* Footer Action with slide-in animation */}
                <div className="mt-auto flex items-center text-sm font-semibold opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    <span style={{ color: colorFrom }}>{t.topicsIndex.card.explore}</span>
                    <svg
                        className="w-4 h-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke={colorFrom}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </div>
            </div>
        </Link>
    )
}
