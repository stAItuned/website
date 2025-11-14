import { allPosts } from '@/lib/contentlayer'
import { HomeHeroWithAnalytics } from '@/components/home/HomeHeroWithAnalytics'
import { HomeDualTracks } from '@/components/home/HomeDualTracks'
import { ArticleSection } from '@/components/home/ArticleSection'
import { PageTransition } from '@/components/ui/PageTransition'

// Force static generation
export const dynamic = 'force-static'
export const revalidate = 86400 // ISR ogni giorno

export default function HomePage() {
  // Sort posts by date and get recent ones
  const recentArticles = allPosts
    .filter(post => post.published !== false)
    .sort((a, b) => {
      if (!a.date || !b.date) return 0;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 10);

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
  
  // Analytics data will be loaded client-side to avoid build-time fetch issues
  const activeUsers = 0; // Placeholder, will be updated via client-side
  const sessions = 0; // Placeholder, will be updated via client-side

  return (
    <PageTransition>
      <main className="min-h-screen">
        {/* Hero Section */}
        <HomeHeroWithAnalytics 
          totalArticles={totalArticles}
          totalWriters={totalWriters}
          initialActiveUsers={activeUsers}
          initialSessions={sessions}
        />
        
        {/* Dual tracks overview */}
        <HomeDualTracks />
        
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
