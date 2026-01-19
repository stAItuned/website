'use client'

import { topicHubs, categoryLabels, TopicHub } from '@/config/topics'
import { TopicCard } from './TopicCard'
import { useLearnLocale } from '@/lib/i18n'

interface Topic {
    _id: string
    title: string
    description: string
    slug: string
    url: string
    icon?: string
    body: {
        raw: string
    }
}

interface TopicsIndexClientProps {
    allTopics: Topic[]
    topicCounts: Record<string, number>
}

export function TopicsIndexClient({ allTopics, topicCounts }: TopicsIndexClientProps) {
    const { locale, t } = useLearnLocale()

    // Filter topics:
    // 1. Must be a valid Hub in config
    // 2. Select correct language variant:
    //    - If locale is 'it', check for [slug].it.md (generated as [slug].it)
    //    - If not found or locale is 'en', use base [slug].md (generated as [slug])

    // Config only lists base slugs (e.g. 'rag', 'agents')
    const validBaseSlugs = new Set(topicHubs.map(h => h.slug))

    const hubs = topicHubs
        .filter(hubConfig => validBaseSlugs.has(hubConfig.slug))
        .map(hubConfig => {
            const baseSlug = hubConfig.slug

            // Find variants
            const enTopic = allTopics.find(t => t.slug === baseSlug)
            const itTopic = allTopics.find(t => t.slug === `${baseSlug}.it`)

            // Select topic based on locale
            let selectedTopic = enTopic
            if (locale === 'it' && itTopic) {
                selectedTopic = itTopic
            }

            // Fallback to English if Italian not found
            if (!selectedTopic) selectedTopic = enTopic

            // If absolutely nothing found (config exists but no markdown), skip
            if (!selectedTopic) return null

            // Override URL to always point to base slug (nextjs route handles i18n via component logic)
            // But wait, the link href in TopicCard is topic.url. 
            // contentlayer generates url as /topics/rag (for rag.md) and /topics/rag.it (for rag.it.md)
            // We want the link to ALWAYS be /topics/rag.
            // So we force the url:

            return {
                ...selectedTopic,
                url: `/topics/${baseSlug}`, // Force clean URL
                hubConfig,
                articleCount: topicCounts[baseSlug] || 0
            }
        })
        .filter((h): h is NonNullable<typeof h> => h !== null)

    // Group hubs by category
    const categories: TopicHub['category'][] = ['core', 'applications', 'career', 'operations']

    console.log('TopicsIndexClient slugs:', allTopics.map(t => t.slug))

    const hubsByCategory = categories.reduce((acc, category) => {
        acc[category] = hubs.filter(h => h.hubConfig.category === category)
            .sort((a, b) => b.articleCount - a.articleCount) // Sort by article count descending
        return acc
    }, {} as Record<TopicHub['category'], typeof hubs>)

    return (
        <div className="space-y-12 pb-16">
            {categories.map(category => {
                const categoryHubs = hubsByCategory[category]
                if (!categoryHubs || categoryHubs.length === 0) return null

                // Translate category label
                const label = t.topicsIndex.categories[category as keyof typeof t.topicsIndex.categories] || categoryLabels[category]

                return (
                    <section key={category} className="space-y-6">
                        {/* Category Header */}
                        <div className="flex items-center gap-3">
                            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                            <h2 className="text-lg font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                {label}
                            </h2>
                            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                        </div>

                        {/* Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categoryHubs.map((hub, index) => (
                                <TopicCard
                                    key={hub._id}
                                    topic={hub}
                                    hubConfig={hub.hubConfig}
                                    articleCount={hub.articleCount}
                                    index={index}
                                />
                            ))}
                        </div>
                    </section>
                )
            })}
        </div>
    )
}
