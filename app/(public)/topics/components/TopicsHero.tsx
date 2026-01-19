'use client'

import { topicHubs } from '@/config/topics'
import { allPosts } from '@/lib/contentlayer'
import { useLearnLocale } from '@/lib/i18n'

/**
 * TopicsHero - Premium hero section for the Topics index page
 * 
 * Features:
 * - Animated gradient orbs (matching LearnHero)
 * - Glassmorphism KPI badges
 * - Premium gradient text treatment
 * - Subtle dot pattern overlay
 */
export function TopicsHero() {
    // Calculate total articles across all topic hubs
    const totalArticles = allPosts.filter(p => p.published && p.primaryTopic).length
    const { t } = useLearnLocale()

    return (
        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl mb-10">
            {/* Premium Dark Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

            {/* Animated Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary-500/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-[120px] animate-[pulse_4s_ease-in-out_infinite]" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/15 rounded-full blur-[80px] animate-[pulse_5s_ease-in-out_infinite]" />
            </div>

            {/* Subtle Dot Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

            {/* Content */}
            <div className="relative z-10 text-center space-y-6 p-6 sm:p-10 lg:p-14">
                {/* Floating Badge */}
                <div className="flex justify-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/15 via-indigo-500/10 to-primary-500/15 border border-primary-500/30 text-sm font-medium text-primary-400 backdrop-blur-sm shadow-lg shadow-primary-500/10">
                        <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                        {t.topicsIndex.hero.badge}
                    </span>
                </div>

                {/* Headline with Gradient Text */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight max-w-4xl mx-auto">
                    <span className="bg-gradient-to-br from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                        {t.topicsIndex.hero.titlePrefix}{' '}
                    </span>
                    <span className="bg-gradient-to-r from-primary-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                        {t.topicsIndex.hero.titleHighlight}
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
                    {t.topicsIndex.hero.subtitle}
                </p>

                {/* KPI Stats with Glassmorphism */}
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
                    {/* Topic Hubs */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-indigo-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white backdrop-blur-sm text-sm font-medium shadow-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-600/10">
                                <svg className="w-4 h-4 text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                </svg>
                            </div>
                            <span className="font-bold">{topicHubs.length}</span> {t.topicsIndex.hero.stats.hubs}
                        </span>
                    </div>

                    {/* Articles */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white backdrop-blur-sm text-sm font-medium shadow-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10">
                                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="font-bold">{totalArticles}+</span> {t.topicsIndex.hero.stats.articles}
                        </span>
                    </div>

                    {/* Free & Open */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white backdrop-blur-sm text-sm font-medium shadow-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10">
                                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                </svg>
                            </div>
                            {t.topicsIndex.hero.stats.free}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
