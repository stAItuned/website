import { allPosts } from '@/lib/contentlayer'
import { getAllProducts } from '@/lib/products'
import { HomeHero } from '@/components/home/HomeHero'
import { HomeKpi } from '@/components/home/HomeKpi'
import { HomeAnimatedSections } from '@/components/home/HomeAnimatedSections'
import { PageTransition } from '@/components/ui/PageTransition'

// Force static generation
export const dynamic = 'force-static'
export const revalidate = 86400 // ISR ogni giorno

export default async function HomePage() {
  const publishedPosts = allPosts.filter(post => post.published !== false)

  const totalArticles = publishedPosts.length
  const uniqueAuthors = new Set<string>()
  publishedPosts.forEach(post => {
    if (post.author) {
      uniqueAuthors.add(post.author)
    }
  })
  const totalWriters = uniqueAuthors.size

  // Get total product count
  const totalProducts = getAllProducts().length

  // Get the latest 20 articles for the ticker, sorted by date
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const tickerArticles = [...publishedPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20)
    .map(post => ({
      title: post.title,
      slug: post.slug,
      cover: post.cover,
      author: post.author,
      date: post.date,
      readingTime: post.readingTime,
      target: post.target,
      language: post.language,
      isNew: new Date(post.date) >= sevenDaysAgo, // New if published in last 7 days
    }))

  const businessShortlist = [
    {
      slug: 'simplifying-machine-learning-for-business-the-role-of-blogs',
      title: "Come un blog di ML può aiutare il business a capire l'AI",
      description: "Capire dove l'AI impatta davvero su costi, tempi e qualità con esempi di piloti rapidi.",
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

  // Get products from centralized source
  const allProductsList = getAllProducts()
  const productsForHome = allProductsList.slice(0, 3)
  const productShortlist = productsForHome.map(product => ({
    slug: `prodotti/${product.slug}`,
    title: product.title,
    description: product.description,
    badge: product.status === 'live' ? 'Disponibile' : product.status === 'beta' ? 'Beta' : 'Prossimamente'
  }))

  const shortlistColumns = [
    {
      heading: 'Per la tua azienda (Business)',
      description:
        "Articoli pensati per CEO e manager: come scegliere il primo pilota, valutare strumenti e misurare l'impatto.",
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
      {/* pb-32 sm:pb-36 to account for fixed ticker at bottom */}
      <main className="min-h-screen pb-32 sm:pb-36">
        {/* Hero Section - simplified, stats moved to KPI block */}
        <HomeHero />

        {/* KPI block - main stats section */}
        <HomeKpi
          articleCount={totalArticles}
          writerCount={totalWriters}
          productCount={totalProducts}
        />

        {/* Animated sections: Ticker, Dual tracks, Article shortlist, Next step */}
        <HomeAnimatedSections
          shortlistColumns={shortlistColumns}
          posts={publishedPosts}
          tickerArticles={tickerArticles}
        />

      </main>
    </PageTransition>
  )
}

