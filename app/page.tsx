import { allPosts } from '@/lib/contentlayer'
import { HomeHeroWithAnalytics } from '@/components/home/HomeHeroWithAnalytics'
import { HomeDualTracks } from '@/components/home/HomeDualTracks'
import { HomeKpi } from '@/components/home/HomeKpi'
import { HomeArticleShortlist } from '@/components/home/HomeArticleShortlist'
import { HomeNextStep } from '@/components/home/HomeNextStep'
import { ArticleSection } from '@/components/home/ArticleSection'
import { PageTransition } from '@/components/ui/PageTransition'

// Force static generation
export const dynamic = 'force-static'
export const revalidate = 86400 // ISR ogni giorno

export default function HomePage() {
  const publishedPosts = allPosts.filter(post => post.published !== false)

  // Sort posts by date and get recent ones
  const recentArticles = publishedPosts
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
    .map(slug => publishedPosts.find(post => post.slug.includes(slug)))
    .filter(Boolean)
    .slice(0, 22);

  const totalArticles = publishedPosts.length;
  const totalWriters = 15; // You can calculate this from team data
  
  // Analytics data will be loaded client-side to avoid build-time fetch issues
  const activeUsers = 0; // Placeholder, will be updated via client-side
  const sessions = 0; // Placeholder, will be updated via client-side

  const businessShortlist = [
    {
      slug: 'simplifying-machine-learning-for-business-the-role-of-blogs',
      title: 'Come un blog di ML può aiutare il business a capire l’AI',
      description: 'Per spiegare bene l’AI ai decisori PMI e partire da un esperimento rapido, mostrando impatto su costi, tempi e qualità.',
      badge: 'Business / PMI'
    },
    {
      slug: 'google-ai-studio-guide',
      title: 'Google AI Studio: prototipi rapidi per team digitali',
      description: 'Una guida su come costruire una webapp di prova, raccogliere metriche e decidere se investire in produzione.',
      badge: 'Business / Strumenti'
    },
    {
      slug: 'perplexity-ai-vs-chatgpt-differences-use-cases',
      title: 'Quale copilot intelligente serve davvero alla tua azienda?',
      description: 'Un confronto pensato per capire quale soluzione integrare nei processi di customer care o vendita, con attenzione a costi e affidabilità.',
      badge: 'Business / Decisioni'
    }
  ]

  const technicalShortlist = [
    {
      slug: 'understanding-how-recommendation-suggestions-work',
      title: 'Understanding how recommendation systems work',
      description: 'Come funzionano i sistemi che consigliano prodotti e contenuti, con spazio per arrivare subito a un proof of concept.',
    },
    {
      slug: 'stable-diffusion-creare-immagini-a-partire-dal-testo',
      title: 'Stable Diffusion: creare immagini a partire dal testo',
      description: 'Tecniche pratiche per usare modelli generativi, fine-tuning leggero e valutazione della qualità delle immagini.',
    },
    {
      slug: 'using-autoencoders-for-anomaly-detection-in-strong-unbalanced-datasets',
      title: 'Using autoencoders for anomaly detection in strong unbalanced datasets',
      description: 'Impariamo a costruire modelli che individuano anomalie in dati sbilanciati, con un occhio ai controlli di qualità.',
      badge: 'Expert'
    }
  ]

  const shortlistColumns = [
    {
      heading: 'Per la tua azienda',
      description: 'Articoli per capire in modo semplice dove l’AI può aiutarti nei processi di tutti i giorni.',
      linkLabel: 'Vedi tutte le risorse per le aziende',
      linkHref: '/aziende',
      items: businessShortlist
    },
    {
      heading: 'Per imparare (tecnico)',
      description: 'Approfondimenti per data scientist, ingegneri e curiosi di AI.',
      linkLabel: 'Vai a tutti gli articoli',
      linkHref: '/learn',
      items: technicalShortlist
    }
  ]

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
        
        {/* KPI block */}
        <HomeKpi />

        {/* Dual tracks overview */}
        <HomeDualTracks />

        {/* Shortlist per binari */}
        <HomeArticleShortlist columns={shortlistColumns} posts={publishedPosts} />

        {/* Next step micro-block */}
        <HomeNextStep />

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
