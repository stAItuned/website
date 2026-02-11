import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PageTransition } from '@/components/ui/PageTransition'
import { getProductBySlug, getAllProductSlugs } from '@/lib/products'
import type { Product } from '@/types/product'
import { VideoPlayer } from '@/components/VideoPlayer'
import { MarkdownContent } from '@/components/MarkdownContent'

export const dynamic = 'force-static'
export const revalidate = 21600 // 6 hours
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')

/**
 * Generate static params for all products
 */
export async function generateStaticParams() {
  const slugs = getAllProductSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Prodotto non trovato - stAItuned',
    }
  }
  const url = `${SITE_URL}/prodotti/${product.slug}`

  return {
    title: `${product.title} - stAItuned`,
    description: product.metaDescription || product.description,
    keywords: product.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      title: `${product.title} - stAItuned`,
      description: product.metaDescription || product.description,
      type: 'website',
      images: product.coverImage ? [product.coverImage] : product.image ? [product.image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} - stAItuned`,
      description: product.metaDescription || product.description,
      images: product.coverImage ? [product.coverImage] : product.image ? [product.image] : [],
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Language-specific labels
  const lang = product.language || 'it'

  const labels = {
    en: {
      statusLabels: {
        'coming-soon': '🔨 Coming Soon',
        'beta': '🧪 Beta',
        'live': '✅ Available'
      },
      breadcrumb: {
        home: 'Home',
        products: 'Products'
      },
      sections: {
        techStack: 'Tech Stack',
        tryDemo: 'Try Demo',
        contact: 'Contact Us',
        problem: '⚠️ The Problem',
        problemHeading: 'What it Solves',
        solution: '✨ The Solution',
        solutionHeading: 'How it Works',
        features: '⚡ Features',
        featuresHeading: 'Key Features',
        benefits: '📈 Benefits',
        benefitsHeading: 'Key Benefits',
        useCases: '💼 Use Cases',
        useCasesHeading: 'Real-World Scenarios',
        before: 'Before',
        after: 'After',
        caseStudy: '📊 Case Study',
        caseStudyHeading: 'Success Story',
        company: 'Company',
        industry: 'Industry',
        challenge: 'Challenge',
        implementation: 'Implementation',
        results: 'Results',
        faq: '❓ FAQ',
        faqHeading: 'Frequently Asked Questions'
      },
      cta: {
        live: {
          heading: 'Ready to adapt it to your case?',
          description: 'We can customize this webapp for your specific needs in 2-4 weeks. We start with a working prototype and iterate based on feedback.',
          bookCall: 'Book a free call',
          seeProducts: 'See other products'
        },
        beta: {
          heading: 'Interested in this type of solution?',
          description: 'This product is in development. If you have a similar use case, we can fast-track development and build it together as a pilot project.',
          bookCall: 'Book a free call',
          seeProducts: 'See other products'
        }
      }
    },
    it: {
      statusLabels: {
        'coming-soon': '🔨 Prossimamente',
        'beta': '🧪 Beta',
        'live': '✅ Disponibile'
      },
      breadcrumb: {
        home: 'Home',
        products: 'Lab'
      },
      sections: {
        techStack: 'Stack tecnologico',
        tryDemo: 'Prova la demo',
        contact: 'Contattaci',
        problem: '⚠️ Il problema',
        problemHeading: 'Cosa risolve',
        solution: '✨ La soluzione',
        solutionHeading: 'Come funziona',
        features: '⚡ Funzionalità',
        featuresHeading: 'Caratteristiche principali',
        benefits: '📈 Vantaggi',
        benefitsHeading: 'Vantaggi chiave',
        useCases: '💼 Casi d\'uso',
        useCasesHeading: 'Scenari reali',
        before: 'Prima',
        after: 'Dopo',
        caseStudy: '📊 Caso di studio',
        caseStudyHeading: 'Storia di successo',
        company: 'Azienda',
        industry: 'Settore',
        challenge: 'Sfida',
        implementation: 'Implementazione',
        results: 'Risultati',
        faq: '❓ FAQ',
        faqHeading: 'Domande frequenti'
      },
      cta: {
        live: {
          heading: 'Pronto per adattarlo al tuo caso?',
          description: 'Possiamo personalizzare questa webapp per le tue esigenze specifiche in 2-4 settimane. Partiamo con un prototipo funzionante e iteriamo in base ai feedback.',
          bookCall: 'Prenota una call gratuita',
          seeProducts: 'Vedi altri prodotti'
        },
        beta: {
          heading: 'Interessato a questo tipo di soluzione?',
          description: 'Questo prodotto è in sviluppo. Se hai un caso d\'uso simile, possiamo anticipare lo sviluppo e costruirlo insieme come progetto pilota.',
          bookCall: 'Prenota una call gratuita',
          seeProducts: 'Vedi altri prodotti'
        }
      }
    }
  }

  const t = labels[lang]
  const statusLabels = t.statusLabels

  const statusColors = {
    'coming-soon': 'bg-slate-100 text-slate-700 border-slate-300',
    'beta': 'bg-blue-100 text-blue-700 border-blue-300',
    'live': 'bg-green-100 text-green-700 border-green-300'
  }

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto mt-[100px] px-4 lg:px-6">
          <nav className="flex items-center space-x-3 text-primary-500 w-full md:w-fit bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl font-medium shadow-sm border border-slate-200/50 dark:bg-slate-900/60 dark:border-slate-800/50 dark:text-primary-400">
            <Link href="/" className="text-sm lg:text-base opacity-60 hover:opacity-100 transition-opacity">
              {t.breadcrumb.home}
            </Link>
            <span className="opacity-40">/</span>
            <Link href="/prodotti" className="text-sm lg:text-base opacity-60 hover:opacity-100 transition-opacity">
              {t.breadcrumb.products}
            </Link>
            <span className="opacity-40">/</span>
            <span className="text-sm lg:text-base font-semibold truncate">{product.title}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 lg:px-6 mt-8 md:mt-12 mb-16 md:mb-20">
          {/* Check if video is landscape - if so, use different layout */}
          {(product.coverImage || product.image)?.endsWith('.mp4') && product.videoOrientation === 'landscape' ? (
            // Landscape Video Layout: Content first, then video, then CTAs
            <div className="space-y-8 md:space-y-12">
              {/* Content Header */}
              <div className="space-y-4 md:space-y-6">
                <div className="space-y-3 md:space-y-4">
                  <div className={`inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold border-2 ${statusColors[product.status]}`}>
                    {statusLabels[product.status]}
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
                    {product.title}
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl text-slate-700 dark:text-slate-300 font-medium">
                    {product.subtitle}
                  </p>
                  <div className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed prose prose-slate dark:prose-invert max-w-none">
                    <MarkdownContent content={product.longDescription || ''} className="prose prose-slate dark:prose-invert max-w-none" />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-amber-100 text-amber-700 text-xs md:text-sm font-semibold dark:bg-amber-900/30 dark:text-amber-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Half Width Video - After description, before CTAs */}
              <div className="relative w-full flex items-center justify-center">
                <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border-2 md:border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-900 group">
                  <VideoPlayer
                    src={product.coverImage || product.image || '/placeholder.jpg'}
                    className="w-full h-auto object-contain"
                    showFullscreenHint={true}
                    isPortrait={false}
                  />
                </div>
                {/* Decorative elements */}
                <div className="hidden md:block absolute -z-10 -top-8 -right-8 w-48 h-48 lg:w-64 lg:h-64 bg-amber-200/30 dark:bg-amber-500/20 rounded-full blur-3xl" />
                <div className="hidden md:block absolute -z-10 -bottom-8 -left-8 w-48 h-48 lg:w-64 lg:h-64 bg-blue-200/30 dark:bg-blue-500/20 rounded-full blur-3xl" />
              </div>

              {/* CTAs and Tech Stack */}
              <div className="space-y-4 md:space-y-6">
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                  {product.status === 'live' && product.demoUrl && (
                    <Link
                      href={product.demoUrl}
                      className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-base md:text-lg transition-all shadow-lg hover:scale-105"
                    >
                      <span>{t.sections.tryDemo}</span>
                      <span>→</span>
                    </Link>
                  )}
                  <Link
                    href={product.ctaUrl || '/aziende#prenota-call'}
                    className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full bg-white border-2 border-slate-300 hover:border-amber-400 text-slate-700 font-bold text-base md:text-lg transition-all shadow-sm hover:shadow-md dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-amber-500"
                  >
                    <span>{product.ctaText || t.sections.contact}</span>
                  </Link>
                </div>

                {/* Tech Stack */}
                {product.techStack && (
                  <div className="pt-4 md:pt-6 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 md:mb-3">
                      {t.sections.techStack}
                    </p>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {product.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 md:px-3 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium dark:bg-slate-800 dark:text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Portrait Video or Image Layout: Two columns
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Left: Content */}
              <div className="space-y-4 md:space-y-6 order-2 lg:order-1">
                <div className="space-y-3 md:space-y-4">
                  <div className={`inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold border-2 ${statusColors[product.status]}`}>
                    {statusLabels[product.status]}
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
                    {product.title}
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl text-slate-700 dark:text-slate-300 font-medium">
                    {product.subtitle}
                  </p>
                  <div className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed prose prose-slate dark:prose-invert max-w-none">
                    <MarkdownContent content={product.longDescription || ''} className="prose prose-slate dark:prose-invert max-w-none" />
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-amber-100 text-amber-700 text-xs md:text-sm font-semibold dark:bg-amber-900/30 dark:text-amber-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 pt-2 md:pt-4">
                  {product.status === 'live' && product.demoUrl && (
                    <Link
                      href={product.demoUrl}
                      className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-base md:text-lg transition-all shadow-lg hover:scale-105"
                    >
                      <span>{t.sections.tryDemo}</span>
                      <span>→</span>
                    </Link>
                  )}
                  <Link
                    href={product.ctaUrl || '/aziende#prenota-call'}
                    className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full bg-white border-2 border-slate-300 hover:border-amber-400 text-slate-700 font-bold text-base md:text-lg transition-all shadow-sm hover:shadow-md dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-amber-500"
                  >
                    <span>{product.ctaText || t.sections.contact}</span>
                  </Link>
                </div>

                {/* Tech Stack */}
                {product.techStack && (
                  <div className="pt-4 md:pt-6 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 md:mb-3">
                      {t.sections.techStack}
                    </p>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {product.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 md:px-3 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium dark:bg-slate-800 dark:text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Media Container */}
              <div className="relative w-full order-1 lg:order-2 flex items-center justify-center">
                {(product.coverImage || product.image)?.endsWith('.mp4') ? (
                  // Video Container - adapts to orientation
                  <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border-2 md:border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-900 group">
                    <VideoPlayer
                      src={product.coverImage || product.image || '/placeholder.jpg'}
                      className="w-full h-auto object-contain"
                      showFullscreenHint={true}
                      isPortrait={product.videoOrientation === 'portrait'}
                    />
                  </div>
                ) : (
                  // Image Container
                  <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border-2 md:border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                    <div className="relative w-full aspect-[16/9] md:aspect-[4/3]">
                      <Image
                        src={product.coverImage || product.image || '/placeholder.jpg'}
                        alt={product.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                )}
                {/* Decorative elements - hidden on mobile */}
                <div className="hidden md:block absolute -z-10 -top-8 -right-8 w-48 h-48 lg:w-64 lg:h-64 bg-amber-200/30 dark:bg-amber-500/20 rounded-full blur-3xl" />
                <div className="hidden md:block absolute -z-10 -bottom-8 -left-8 w-48 h-48 lg:w-64 lg:h-64 bg-blue-200/30 dark:bg-blue-500/20 rounded-full blur-3xl" />
              </div>
            </div>
          )}
        </section>

        {/* Problem & Solution */}
        <section className="bg-slate-50 dark:bg-slate-900/30 py-20">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Problem */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-700 font-semibold text-sm">
                  {t.sections.problem}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                  {t.sections.problemHeading}
                </h2>
                <div className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed prose prose-lg prose-slate dark:prose-invert max-w-none">
                  <MarkdownContent content={product.problem || ''} className="prose prose-lg prose-slate dark:prose-invert max-w-none" />
                </div>
              </div>

              {/* Solution */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
                  {t.sections.solution}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                  {t.sections.solutionHeading}
                </h2>
                <div className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed prose prose-lg prose-slate dark:prose-invert max-w-none">
                  <MarkdownContent content={product.solution || ''} className="prose prose-lg prose-slate dark:prose-invert max-w-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
              {t.sections.features}
            </div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
              {t.sections.featuresHeading}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.features?.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-amber-300 hover:shadow-lg transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/50"
              >
                <div className="space-y-3">
                  {feature.icon && (
                    <div className="text-4xl">{feature.icon}</div>
                  )}
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Case Study */}
        {product.caseStudy && (
          <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 py-20">
            <div className="max-w-5xl mx-auto px-4 lg:px-6">
              <div className="text-center space-y-4 mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
                  {t.sections.caseStudy}
                </div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                  {t.sections.caseStudyHeading}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  {product.caseStudy.company} • {product.caseStudy.industry}
                </p>
              </div>

              <div className="space-y-8">
                {/* Problem & Solution */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-rose-200 dark:bg-slate-900/80 dark:border-rose-900/50">
                    <h3 className="text-lg font-bold text-rose-800 dark:text-rose-200 mb-3">
                      {t.sections.challenge}
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {product.caseStudy.problem}
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-emerald-200 dark:bg-slate-900/80 dark:border-emerald-900/50">
                    <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-3">
                      {t.sections.implementation}
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {product.caseStudy.solution}
                    </p>
                  </div>
                </div>

                {/* Results */}
                <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-amber-200 dark:bg-slate-900/80 dark:border-amber-900/50">
                  <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-6">
                    {t.sections.results}
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-4">
                    {product.caseStudy.results.map((result, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="text-amber-500 text-xl flex-shrink-0">✓</span>
                        <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {result}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Testimonial */}
                {product.caseStudy.testimonial && (
                  <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
                    <div className="space-y-4">
                      <div className="text-5xl text-amber-400">"</div>
                      <p className="text-xl leading-relaxed italic">
                        {product.caseStudy.testimonial.quote}
                      </p>
                      <div className="flex items-center gap-4 pt-4 border-t border-white/20">
                        <div>
                          <p className="font-bold text-lg">
                            {product.caseStudy.testimonial.author}
                          </p>
                          <p className="text-slate-300">
                            {product.caseStudy.testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="max-w-5xl mx-auto px-4 lg:px-6 py-20">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 text-white shadow-2xl border-2 border-slate-700 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
            </div>

            <div className="relative space-y-6 text-center">
              <h2 className="text-4xl font-bold">
                {product.status === 'live'
                  ? t.cta.live.heading
                  : t.cta.beta.heading}
              </h2>
              <p className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
                {product.status === 'live'
                  ? t.cta.live.description
                  : t.cta.beta.description}
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link
                  href="/aziende#prenota-call"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-lg transition-all shadow-lg hover:scale-105"
                >
                  <span>{product.status === 'live' ? t.cta.live.bookCall : t.cta.beta.bookCall}</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/prodotti"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-bold text-lg transition-all"
                >
                  <span>{product.status === 'live' ? t.cta.live.seeProducts : t.cta.beta.seeProducts}</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom spacing */}
        <div className="pb-20" />
      </div>
    </PageTransition>
  )
}
