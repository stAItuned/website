'use client'

import Link from 'next/link'
import { ArticleCard } from './ArticleCard'
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

interface TopicSidebarProps {
    startHereArticles: Article[]
    accentColor: string
}

export function TopicSidebar({ startHereArticles, accentColor }: TopicSidebarProps) {
    const { t } = useLearnLocale()

    return (
        <aside className="space-y-6">
            {/* Start Here Section */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                    <span className="text-xl">🏁</span>
                    {t.topicHub.sidebar.startHere}
                </h3>
                <div className="space-y-3">
                    {startHereArticles.map((article, idx) => (
                        <ArticleCard
                            key={article._id}
                            article={article}
                            accentColor={accentColor}
                            variant="compact"
                            index={idx}
                        />
                    ))}
                </div>
            </div>

            {/* Newsletter / CTA Placeholder - Could be added here later */}

            {/* View All Link */}
            <Link
                href="/learn/articles"
                className="block text-center p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-primary-600 hover:border-primary-300 transition-colors text-sm font-medium"
            >
                {t.topicHub.sidebar.viewAll}
            </Link>
        </aside>
    )
}
