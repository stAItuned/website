import { allPosts } from '@/lib/contentlayer'
import { fetchGlobalAnalytics } from '@/lib/analytics-server'
import { HomeHeroWithAnalytics } from '@/components/home/HomeHeroWithAnalytics'
import { HomeDualTracks } from '@/components/home/HomeDualTracks'
// import { HomeBusinessCTA } from '@/components/home/HomeBusinessCTA'
import { HomeKpi } from '@/components/home/HomeKpi'
import { HomeArticleShortlist } from '@/components/home/HomeArticleShortlist'
import { HomeNextStep } from '@/components/home/HomeNextStep'
import { PageTransition } from '@/components/ui/PageTransition'

// Force static generation
export const dynamic = 'force-static'
export const revalidate = 86400 // ISR ogni giorno

export default async function HomePage() {
  const publishedPosts = allPosts.filter(post => post.published !== false)
  
  // Fetch analytics server-side during ISR
  const globalAnalytics = await fetchGlobalAnalytics()

  const totalArticles = publishedPosts.length
  const uniqueAuthors = new Set<string>()
  publishedPosts.forEach(post => {
    if (post.author) {
      uniqueAuthors.add(post.author)
    }
  })
  const totalWriters = uniqueAuthors.size

  const businessShortlist = [
    {
      slug: 'simplifying-machine-learning-for-business-the-role-of-blogs',
      title: 'Come un blog di ML può aiutare il business a capire l’AI',
      description: 'Capire dove l’AI impatta davvero su costi, tempi e qualità con esempi di piloti rapidi.',
      badge: 'Business / PMI'
    },
    {
      slug: 'google-ai-studio-guide',
      title: 'Google AI Studio: prototipi rapidi per team digitali',
      description: 'Come costruire una webapp di prova, raccogliere metriche e decidere se scalare.',
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
      description: 'Come funzionano i sistemi che consigliano prodotti e contenuti, con spazio per un proof of concept rapido.',
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

  const productShortlist = [
    {
      slug: 'docling-document-processing-ai',
      title: 'Docling: estrazione documentale pronta per diventare prodotto',
      description: 'Un esperimento nato da richieste PMI per automatizzare lettura e normalizzazione di PDF e contratti.'
    },
    {
      slug: 'ai-translator-lara-global-communication',
      title: 'LARA: traduzione AI con focus su contesto e tono',
      description: 'Da prototipo di laboratorio a webapp usata per localizzare materiali marketing e supporto clienti.'
    },
    {
      slug: 'google-vids-ai-video-creation-tool',
      title: 'Video brevi generati da prompt: cosa funziona davvero',
      description: 'Test di produzione con Google Vids per capire dove inserire automazioni video nei processi di comunicazione.'
    }
  ]

  const shortlistColumns = [
    {
      heading: 'Per la tua azienda (Business)',
      description:
        'Articoli pensati per CEO e manager: come scegliere il primo pilota, valutare strumenti e misurare l’impatto.',
  linkLabel: 'Vedi tutti gli articoli business',
  linkHref: '/learn?target=business',
      secondaryLinkLabel: 'Scopri i progetti pilota',
      secondaryLinkHref: '/azienda',
      items: businessShortlist
    },
    {
      heading: 'Per imparare (tecnico)',
      description:
        'Guide, tutorial e webapp di esempio organizzate per livello: Newbie, Midway, Expert.',
      linkLabel: 'Vai alla sezione Learn',
      linkHref: '/learn',
      secondaryLinkLabel: 'Entra nel stAItuned Lab',
      secondaryLinkHref: '/lab',
      items: technicalShortlist
    },
    {
      heading: 'Dai progetti pilota ai prodotti',
      description:
        'Esperimenti che diventano prodotti: strumenti leggeri nati da esigenze reali delle PMI, pronti da usare e adattare.',
      linkLabel: 'Esplora prodotti & webapp',
      linkHref: '/prodotti',
      secondaryLinkLabel: 'Vedi tutti i prodotti',
      secondaryLinkHref: '/prodotti',
      microCopy: 'Prodotti nati da casi reali, pronti da usare e adattare.',
      items: productShortlist
    }
  ]

  return (
    <PageTransition>
      <main className="min-h-screen">
        {/* Hero Section */}
        <HomeHeroWithAnalytics 
          totalArticles={totalArticles}
          totalWriters={totalWriters}
          initialActiveUsers={globalAnalytics.totalStats.users}
          initialSessions={globalAnalytics.totalStats.sessions}
        />
        
        {/* KPI block */}
        <HomeKpi articleCount={totalArticles} writerCount={totalWriters} />

        {/* Dual tracks overview */}
        <HomeDualTracks />

        {/* Shortlist per binari */}
        <HomeArticleShortlist columns={shortlistColumns} posts={publishedPosts} />

        {/* Next step micro-block */}
        {/* <HomeBusinessCTA /> */}
        <HomeNextStep />

      </main>
    </PageTransition>
  )
}
