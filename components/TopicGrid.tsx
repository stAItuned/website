'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLearnLocale } from '@/lib/i18n'

interface Topic {
    name: string
    slug: string
    count: number
    description?: string
    icon?: string
}

interface TopicGridProps {
    topics: Topic[]
}

export function TopicGrid({ topics }: TopicGridProps) {
    const { t } = useLearnLocale()
    const [isOpen, setIsOpen] = useState(false)
    // Show top 7 topics + "All Topics" card = 8 slots grid
    const displayTopics = topics.slice(0, 7)

    return (
        <div className="mb-8">
            {/* Toggle Header with Inline Ticker */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-3 px-4 sm:px-6 rounded-2xl sm:rounded-3xl transition-all relative overflow-hidden cursor-pointer bg-gradient-to-r from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary-200/50 dark:hover:border-primary-700/30 group"
            >
                {/* Left: Title Group (Clickable Toggle) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-3 flex-shrink-0 z-20 relative hover:opacity-80 transition-opacity text-left text-slate-900 dark:text-white"
                >
                    <span className="text-xl grayscale group-hover:grayscale-0 transition-all">📚</span>
                    <h2 className="text-lg font-bold">
                        {t.topicGrid.browseByTopic}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
                        {topics.length}
                    </span>
                </button>

                {/* Middle: Inline Ticker (Visible only when closed) */}
                <div
                    className={`flex-1 mx-4 sm:mx-8 overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'opacity-0 max-w-0 pointer-events-none' : 'opacity-100 max-w-[2000px]'}`}
                    style={{ maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)' }}
                >
                    <div className="relative flex overflow-x-hidden group/ticker">
                        {/* Gradient Masks (optional given css mask) */}
                        <div
                            className="flex items-center whitespace-nowrap hover:[animation-play-state:paused]"
                            style={{
                                animation: `ticker-marquee ${Math.max(60, topics.length * 6)}s linear infinite`,
                                width: 'max-content',
                            }}
                        >
                            {[...topics, ...topics].map((topic, i) => (
                                <Link
                                    key={`${topic.slug}-${i}-ticker`}
                                    href={`/topics/${topic.slug}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center gap-2 px-4 py-2 mx-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-primary-500 hover:text-primary-600 hover:shadow-sm transition-all shadow-sm"
                                >
                                    <span>{topic.icon}</span>
                                    <span>{topic.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Chevron (Clickable Toggle) */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex-shrink-0 z-20 relative p-1.5 rounded-full bg-slate-100/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                >
                    <svg
                        className={`w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Collapsible Content */}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100 pt-6 pb-2' : 'max-h-0 opacity-0 py-0'}`}>
                {displayTopics.map((topic) => (
                    <Link
                        key={topic.slug}
                        href={`/topics/${topic.slug}`}
                        className="group/card relative flex flex-col p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary-500/50 dark:hover:border-primary-500/50 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <span className="text-2xl group-hover/card:scale-110 transition-transform duration-300">
                                {topic.icon || '📚'}
                            </span>
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                {topic.count}
                            </span>
                        </div>

                        <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover/card:text-primary-600 dark:group-hover/card:text-primary-400 transition-colors">
                            {topic.name}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                            {topic.description || t.topicGrid.fallbackDescription}
                        </p>

                        <div className="flex items-center text-xs font-bold text-primary-600 dark:text-primary-400 opacity-0 -translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-300">
                            {t.topicGrid.explore} <span className="ml-1">→</span>
                        </div>
                    </Link>
                ))}

                {/* "All Topics" Card */}
                <Link
                    href="/topics"
                    className="group/card relative flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm mb-3 group-hover/card:scale-110 transition-transform">
                        <span className="text-2xl">📚</span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                        {t.topicGrid.allTopics}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                        {t.topicGrid.viewFullCatalog}
                    </p>
                    <div className="mt-3 flex items-center text-xs font-bold text-slate-600 dark:text-slate-300 group-hover/card:underline">
                        {t.topicGrid.seeAll} ({topics.length})
                    </div>
                </Link>
            </div>
        </div>
    )
}
