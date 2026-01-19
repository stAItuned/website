'use client'

import { useState, useMemo } from 'react'
import { getTopicHub } from '@/config/topics'
import { useLearnLocale } from '@/lib/i18n'
import { ArticleCard } from './ArticleCard'
import { useBatchAnalytics } from '@/lib/hooks/useBatchAnalytics'

interface Article {
    _id: string
    title: string
    slug: string
    date: string // Assuming Contentlayer provides ISO string
    meta?: string
    url: string
    cover?: string
    target?: string
    readingTime: number
    imagePath?: string
    primaryTopic?: string
    language?: string
    topics?: string[]
}

interface TopicDeepDivesProps {
    articles: Article[]
    accentColor: string
}

type SortOption = 'recency' | 'trending'

export function TopicDeepDives({ articles, accentColor }: TopicDeepDivesProps) {
    const { t } = useLearnLocale()
    const [sortBy, setSortBy] = useState<SortOption>('recency')

    // Prepare slugs for batch analytics fetching
    const articleSlugs = useMemo(() => {
        return articles.map(a => a.slug)
    }, [articles])

    const { data: analyticsData, loading: analyticsLoading } = useBatchAnalytics(articleSlugs)

    // Sort articles based on selection
    const sortedArticles = useMemo(() => {
        let sorted = [...articles]

        if (sortBy === 'recency') {
            sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        } else if (sortBy === 'trending') {
            sorted.sort((a, b) => {
                const viewsA = analyticsData[a.slug]?.pageViews || 0
                const viewsB = analyticsData[b.slug]?.pageViews || 0
                return viewsB - viewsA
            })
        }
        return sorted
    }, [articles, sortBy, analyticsData])

    return (
        <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
                    <span
                        className="w-1.5 h-10 rounded-full"
                        style={{ background: `linear-gradient(180deg, ${accentColor}, ${accentColor}60)` }}
                    />
                    {t.topicHub.deepDives.title}
                </h2>

                {/* Sorting Controls */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
                    <button
                        onClick={() => setSortBy('recency')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${sortBy === 'recency'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        {t.topicHub.deepDives.sort.newest}
                    </button>
                    <button
                        onClick={() => setSortBy('trending')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${sortBy === 'trending'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                    >
                        {t.topicHub.deepDives.sort.trending}
                    </button>
                </div>
            </div>

            <div className="grid gap-5 animate-in fade-in duration-500">
                {sortedArticles.map(article => {
                    return (
                        <ArticleCard
                            key={article._id}
                            article={article}
                            accentColor={accentColor}
                            variant="list"
                            pageViews={analyticsData[article.slug]?.pageViews}
                        />
                    )
                })}
            </div>
        </section>
    )
}
