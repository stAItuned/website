import { allTopics, allPosts } from '@/lib/contentlayer'
import { TopicsHero } from './components/TopicsHero'
import { TopicsIndexClient } from './components/TopicsIndexClient'

export const metadata = {
    title: 'Topics Hub | stAItuned',
    description: 'Explore our AI architecture and learning paths. Structured guides on RAG, Agents, LLMs, and Career.',
}

/**
 * Topics Index Page
 * 
 * Displays all topic hubs organized by category with premium visual design.
 */
export default function TopicsIndexPage() {
    // Calculate article counts per Primary Topic
    const topicCounts = allPosts.reduce((acc, post) => {
        if (!post.published || !post.primaryTopic) return acc
        const slug = post.primaryTopic
        acc[slug] = (acc[slug] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    return (
        <div className="max-w-7xl mx-auto px-4 pt-8 md:pt-12">
            {/* Hero Section */}
            <TopicsHero />

            {/* Topics Grid by Category (Client Component for I18n) */}
            <TopicsIndexClient allTopics={allTopics} topicCounts={topicCounts} />
        </div>
    )
}

