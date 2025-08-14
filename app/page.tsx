import { allPosts } from '@/lib/contentlayer'
import { HomeHero } from '@/components/home/HomeHero'
import { ArticleSection } from '@/components/home/ArticleSection'
import { PageTransition } from '@/components/ui/PageTransition'

// Force static generation
export const dynamic = 'force-static'
export const revalidate = 86400 // ISR ogni 10 minuti

async function getAnalyticsData() {
  try {
    const response = await fetch(new URL('/api/analytics/stats', process.env.VERCEL_URL || 'http://localhost:3000'), {
      next: { revalidate: revalidate, tags: ['analytics-stats'] }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch analytics')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return { activeUsers: 0, sessions: 0 }
  }
}

export default async function HomePage() {
  // Sort posts by date and get recent ones
  const recentArticles = allPosts
    .filter(post => post.published !== false)
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 22);

  // Relevant articles based on specific slugs (you can customize this)
  const relevantArticleSlugs = [
    'imarena-ai-benchmarking-platform',
    'deepseek-v3-open-source-ai',
    'large-concept-model-meta',
    'google-ai-studio-guide',
    'modernbert-transformer-innovations',
    'gartner-hype-cycle-generative-ai-2024',
    'deep-learning-pytorch-template',
    'ai-for-breast-cancer-diagnosis',
    'artificial-intelligence-in-videogames',
    'generative-adversarial-networks',
  ];

  const relevantArticles = relevantArticleSlugs
    .map(slug => allPosts.find(post => post.slug.includes(slug)))
    .filter(Boolean)
    .slice(0, 22);

  const totalArticles = allPosts.length;
  const totalWriters = 15; // You can calculate this from team data
  
  // Fetch analytics data server-side con caching
  const analyticsData = await getAnalyticsData()
  const { activeUsers, sessions } = analyticsData

  return (
    <PageTransition>
      <main className="min-h-screen">
        {/* Hero Section */}
        <HomeHero 
          totalArticles={totalArticles}
          totalWriters={totalWriters}
          activeUsers={activeUsers}
          sessions={sessions}
        />
        
        {/* Stats Note */}
        <p className="text-xs text-right px-2 bg-transparent">
          * Users and sessions are from Google Analytics (last three months)
        </p>

        {/* Articles Section */}
        <ArticleSection 
          recentArticles={recentArticles}
          relevantArticles={relevantArticles}
        />
      </main>
    </PageTransition>
  )
}
