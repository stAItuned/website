import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PageTransition } from '@/components/ui/PageTransition'
import { PWAInstallBanner } from '@/components/pwa'
import { allPosts, allTopics } from '@/lib/contentlayer'
import { ArticlesPageClient } from './ArticlesPageClient'
import { topicHubs } from '@/config/topics'

export const dynamic = 'force-static'
export const revalidate = 86400 // ISR ogni giorno

export const metadata: Metadata = {
    title: {
        absolute: 'Blog stAItuned | AI & GenAI: guide e tutorial'
    },
    description: 'Blog su AI e GenAI con guide, tutorial e risorse per capire e applicare l’intelligenza artificiale nel lavoro e nei progetti.',
    openGraph: {
        title: 'Blog stAItuned | AI & GenAI: guide e tutorial',
        description: 'Blog su AI e GenAI con guide, tutorial e risorse per capire e applicare l’intelligenza artificiale nel lavoro e nei progetti.',
    }
}

// Level definitions for the filter UI
const levels = [
    {
        id: 'newbie',
        name: 'Newbie',
        emoji: '🌱',
        color: 'emerald',
        description: 'Starting your AI journey. Fundamentals, introductions, first steps.',
    },
    {
        id: 'midway',
        name: 'Midway',
        emoji: '⚡',
        color: 'amber',
        description: 'Building on the basics. Practical implementations, patterns, trade-offs.',
    },
    {
        id: 'expert',
        name: 'Expert',
        emoji: '🔬',
        color: 'rose',
        description: 'Deep dives. Advanced techniques, optimizations, cutting-edge research.',
    },
]

export default function ArticlesPage() {
    // Prepare all published articles
    const allArticles = allPosts
        .filter(post => post.published !== false)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map(post => ({
            title: post.title,
            slug: post.slug,
            cover: post.cover,
            author: post.author,
            date: post.date,
            meta: post.meta,
            readingTime: post.readingTime,
            target: post.target,
            language: post.language,
            primaryTopic: post.primaryTopic,
        }))

    // Calculate count per Primary Topic (Hubs)
    const topicCounts = allPosts.reduce((acc, post) => {
        if (!post.published || !post.primaryTopic) return acc
        const slug = post.primaryTopic
        acc[slug] = (acc[slug] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    // Map Hubs to topTopics format
    const topTopics = topicHubs.map(hub => ({
        name: hub.name,
        slug: hub.slug,
        count: topicCounts[hub.slug] || 0,
        description: hub.description,
        icon: hub.icon
    })).sort((a, b) => b.count - a.count)


    // Count articles per level
    const articleCounts = {
        all: allArticles.length,
        newbie: allArticles.filter(a => a.target?.toLowerCase() === 'newbie').length,
        midway: allArticles.filter(a => a.target?.toLowerCase() === 'midway').length,
        expert: allArticles.filter(a => a.target?.toLowerCase() === 'expert').length,
    }

    return (
        <>
            {/* Blue sticky install bar above header */}
            <PWAInstallBanner />

            <PageTransition>
                <Suspense fallback={<ArticlesPageSkeleton />}>
                    <ArticlesPageClient
                        articles={allArticles}
                        levels={levels}
                        articleCounts={articleCounts}
                        topTopics={topTopics}
                        topicCount={allTopics.length}
                    />
                </Suspense>
            </PageTransition>
        </>
    )
}

function ArticlesPageSkeleton() {
    return (
        <div className="max-w-6xl mx-auto mt-[100px] mb-24 px-4 lg:px-6 space-y-8">
            {/* Header skeleton */}
            <div className="space-y-4">
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-48 animate-pulse" />
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-96 animate-pulse" />
            </div>

            {/* Filters skeleton */}
            <div className="flex gap-3">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded-full w-24 animate-pulse" />
                ))}
            </div>

            {/* Grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
                ))}
            </div>
        </div>
    )
}
