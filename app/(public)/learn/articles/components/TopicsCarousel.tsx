'use client'

import Link from 'next/link'
import { getTopicHub } from '@/config/topics'

interface TopicsCarouselProps {
    topics: {
        name: string
        count: number
        slug: string
    }[]
    variant?: 'default' | 'inline'
}

export function TopicsCarousel({ topics, variant = 'default' }: TopicsCarouselProps) {
    if (variant === 'inline') {
        return (
            <div className="hidden xl:flex flex-1 min-w-0 mx-4 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white/95 dark:from-slate-900/95 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/95 dark:from-slate-900/95 to-transparent z-10 pointer-events-none" />

                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide no-scrollbar py-1 px-8">
                    {topics.map((topic) => {
                        const hub = getTopicHub(topic.slug)
                        const icon = hub?.icon || '📚'
                        return (
                            <Link
                                key={topic.slug}
                                href={`/topics/${topic.slug}`}
                                className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all group"
                            >
                                <span className="text-xs opacity-70 grayscale group-hover:grayscale-0 transition-all">{icon}</span>
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 whitespace-nowrap">
                                    {topic.name}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full mb-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 scrollbar-hide mask-linear-fade px-4 lg:px-0 -mx-4 lg:mx-0">
                <Link
                    href="/topics"
                    className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <svg className="w-3 h-3 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">All Topics</span>
                </Link>

                {topics.map((topic) => {
                    const hub = getTopicHub(topic.slug)
                    const icon = hub?.icon || '📚'

                    return (
                        <Link
                            key={topic.slug}
                            href={`/topics/${topic.slug}`}
                            className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary-500/50 dark:hover:border-primary-500/50 hover:shadow-sm transition-all"
                        >
                            <span className="text-sm">{icon}</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                {topic.name}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
