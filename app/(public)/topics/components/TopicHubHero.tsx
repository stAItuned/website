'use client'

import Link from 'next/link'
import { getTopicHub } from '@/config/topics'
import { useLearnLocale } from '@/lib/i18n'

interface TopicHubHeroProps {
    topic: {
        slug: string
        title: string
        description: string
        icon?: string
    }
    articleCount: number
}

/**
 * TopicHubHero - Premium hero for individual topic hub pages
 * 
 * Features:
 * - Animated glow on icon (topic color)
 * - Subtle gradient orbs
 * - Enhanced stats badge with gradient border
 * - Premium breadcrumb styling
 */
export function TopicHubHero({ topic, articleCount }: TopicHubHeroProps) {
    const hubConfig = getTopicHub(topic.slug)
    const colorFrom = hubConfig?.colorFrom || '#6366f1'
    const colorTo = hubConfig?.colorTo || '#9333ea'
    const icon = hubConfig?.icon || topic.icon || '📚'

    // Hooks
    const { t } = useLearnLocale()

    return (
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl mb-10">
            {/* Premium Dark Background */}
            {/* Premium Background (Adaptive) */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

            {/* Animated Gradient Orbs with Topic Colors - Toned Down */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-0 right-1/4 w-72 h-72 rounded-full blur-[100px] opacity-10 dark:opacity-20"
                    style={{ background: colorFrom }}
                />
                <div
                    className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full blur-[80px] opacity-10 dark:opacity-15"
                    style={{ background: colorTo }}
                />
            </div>

            {/* Subtle Dot Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

            {/* Content */}
            <div className="relative z-10 p-6 sm:p-10 lg:p-12">
                {/* Breadcrumb */}
                <nav className="flex items-center justify-center sm:justify-start gap-2 text-sm text-slate-500 mb-8">
                    <Link href="/" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-200">{t.topicHub.breadcrumbs.home}</Link>
                    <span className="text-slate-400 dark:text-slate-600">/</span>
                    <Link href="/topics" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-200">{t.topicHub.breadcrumbs.topics}</Link>
                    <span className="text-slate-400 dark:text-slate-600">/</span>
                    <span className="text-slate-900 dark:text-white font-medium">{topic.title}</span>
                </nav>

                <div className="flex flex-col items-center sm:items-start gap-6">
                    {/* Icon + Title + Description */}
                    <div className="text-center sm:text-left w-full">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-5">
                            {/* Icon with Animated Glow */}
                            <div className="relative group">
                                {/* Animated glow */}
                                <div
                                    className="absolute inset-0 rounded-2xl blur-xl animate-pulse opacity-50 group-hover:opacity-80 transition-opacity"
                                    style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})` }}
                                />
                                <div
                                    className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl text-3xl sm:text-4xl bg-white/50 dark:bg-white/10 backdrop-blur-sm border border-slate-200 dark:border-white/20 shadow-2xl"
                                    style={{ boxShadow: `0 0 40px -10px ${colorFrom}60` }}
                                >
                                    {icon}
                                </div>
                            </div>

                            <div className="text-center sm:text-left flex-1">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2 leading-tight tracking-tight">
                                    {topic.title}
                                </h1>
                                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                                    {topic.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row - Inline badges */}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                        {/* Articles Count Badge */}
                        <div
                            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm"
                        >
                            <div
                                className="flex items-center justify-center w-8 h-8 rounded-lg"
                                style={{ background: `linear-gradient(135deg, ${colorFrom}25, ${colorTo}15)` }}
                            >
                                <svg className="w-4 h-4 text-slate-700 dark:text-slate-200" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <div className="text-xl font-bold text-slate-900 dark:text-white leading-none">
                                    {articleCount}
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
                                    {articleCount === 1 ? t.topicHub.stats.article : t.topicHub.stats.articles}
                                </div>
                            </div>
                        </div>

                        {/* Visual separator */}
                        <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-700" />

                        {/* Topic badge with color */}
                        <div
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border"
                            style={{
                                background: `linear-gradient(135deg, ${colorFrom}10, ${colorTo}05)`,
                                borderColor: `${colorFrom}30`
                            }}
                        >
                            <span className="text-lg">{icon}</span>
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Topic Hub</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
