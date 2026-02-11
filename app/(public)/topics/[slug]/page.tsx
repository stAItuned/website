import { allTopics, allPosts } from '@/lib/contentlayer'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getTopicHub } from '@/config/topics'
import { TopicHubHero } from '../components/TopicHubHero'
import { TopicOverview } from '../components/TopicOverview'
import { TopicDeepDives } from '../components/TopicDeepDives'
import { StartHereSection } from '../components/StartHereSection'
import fs from 'fs'
import path from 'path'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')

export async function generateStaticParams() {
    return allTopics.map((topic) => ({
        slug: topic.slug,
    }))
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const params = await props.params;
    const topic = allTopics.find((t) => t.slug === params.slug)
    if (!topic) return {}
    const url = `${SITE_URL}/topics/${topic.slug}`

    return {
        title: topic.seoTitle || `${topic.title} | stAItuned`,
        description: topic.seoDescription || topic.description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            url,
            title: topic.seoTitle || `${topic.title} | stAItuned`,
            description: topic.seoDescription || topic.description,
            type: 'website',
        },
    }
}

/**
 * Topic Hub Detail Page
 * 
 * Premium "Knowledge Dashboard" layout with:
 * - Premium hero with topic colors
 * - Glassmorphism "Start Here" sidebar
 * - Editorial content from markdown
 * - Deep dives article list
 */
export default async function TopicHubPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const topic = allTopics.find((t) => t.slug === params.slug)

    if (!topic) {
        notFound()
    }

    // Attempt to load Italian content
    const italianContentPath = path.join(process.cwd(), 'public/content/topics', `${topic.slug}.it.md`)
    let rawContentIt = ''
    try {
        if (fs.existsSync(italianContentPath)) {
            rawContentIt = fs.readFileSync(italianContentPath, 'utf-8')
        }
    } catch (e) {
        // Ignore error, fallback to English only
        console.warn(`Could not load Italian content for ${topic.slug}`, e)
    }

    // Get hub config for colors
    const hubConfig = getTopicHub(topic.slug)
    const accentColor = hubConfig?.colorFrom || '#6366f1'

    // Get articles for this topic
    const topicArticles = allPosts
        .filter(article => article.primaryTopic === topic.slug && article.published)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // "Start Here" Logic: Try to pick 1 Newbie, 1 Midway, 1 High Value/Recent
    const newbie = topicArticles.find(a => a.target?.toLowerCase() === 'newbie')
    const midway = topicArticles.find(a => a.target?.toLowerCase() === 'midway' && a._id !== newbie?._id)
    const otherStart = topicArticles.find(a => a._id !== newbie?._id && a._id !== midway?._id)

    const startHere = [newbie, midway, otherStart].filter(Boolean).slice(0, 3)
    // Cast to Article type expected by Sidebar (removing nullable checks from filter)
    const validStartHere = startHere as any[]

    // Use all articles for the main list
    const deepDives = topicArticles

    return (
        <div className="max-w-5xl mx-auto px-4 pt-8 md:pt-12 pb-20">
            {/* Hero Section */}
            <TopicHubHero
                topic={topic}
                articleCount={topicArticles.length}
            />

            {/* Start Here Section - Prominent Learning Path */}
            {startHere.length > 0 && (
                <StartHereSection
                    articles={validStartHere}
                    accentColor={accentColor}
                />
            )}

            {/* Main Content */}
            <div className="space-y-10">
                {/* Editorial Content - Dashboard View */}
                <TopicOverview
                    rawContentEn={topic.body.raw}
                    rawContentIt={rawContentIt}
                    accentColor={accentColor}
                />

                {/* Deep Dives Section */}
                {deepDives.length > 0 && (
                    <TopicDeepDives
                        articles={deepDives}
                        accentColor={accentColor}
                    />
                )}

                {/* Empty state if no articles */}
                {topicArticles.length === 0 && (
                    <div
                        className="text-center py-16 px-8 rounded-2xl border border-dashed"
                        style={{
                            borderColor: `${accentColor}30`,
                            background: `linear-gradient(135deg, ${accentColor}05, transparent)`
                        }}
                    >
                        <div className="text-5xl mb-5">📝</div>
                        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                            Coming Soon
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                            We're working on new articles for this topic. Check back soon for in-depth guides and tutorials!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
