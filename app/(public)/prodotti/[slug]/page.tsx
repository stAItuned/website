import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PageTransition } from '@/components/ui/PageTransition'
import { getProductBySlug, getAllProductSlugs } from '@/lib/products'
import type { Product } from '@/types/product'

export const dynamic = 'force-static'
export const revalidate = 21600 // 6 hours

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

  return {
    title: `${product.title} - stAItuned`,
    description: product.metaDescription || product.description,
    keywords: product.keywords,
    openGraph: {
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

  const statusColors = {
    'coming-soon': 'bg-slate-100 text-slate-700 border-slate-300',
    'beta': 'bg-blue-100 text-blue-700 border-blue-300',
    'live': 'bg-green-100 text-green-700 border-green-300'
  }

  const statusLabels = {
    'coming-soon': '🔨 Prossimamente',
    'beta': '🧪 Beta',
    'live': '✅ Disponibile'
  }

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto mt-[100px] px-4 lg:px-6">
          <nav className="flex items-center space-x-3 text-primary-500 w-full md:w-fit bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl font-medium shadow-sm border border-slate-200/50 dark:bg-slate-900/60 dark:border-slate-800/50 dark:text-primary-400">
            <Link href="/" className="text-sm lg:text-base opacity-60 hover:opacity-100 transition-opacity">
              Home
            </Link>
            <span className="opacity-40">/</span>
            <Link href="/prodotti" className="text-sm lg:text-base opacity-60 hover:opacity-100 transition-opacity">
              Prodotti
            </Link>
            <span className="opacity-40">/</span>
            <span className="text-sm lg:text-base font-semibold truncate">{product.title}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 lg:px-6 mt-12 mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${statusColors[product.status]}`}>
                  {statusLabels[product.status]}
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
                  {product.title}
                </h1>
                <p className="text-2xl text-slate-700 dark:text-slate-300 font-medium">
                  {product.subtitle}
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                  {product.longDescription}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold dark:bg-amber-900/30 dark:text-amber-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                {product.status === 'live' && product.demoUrl && (
                  <Link
                    href={product.demoUrl}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-lg transition-all shadow-lg hover:scale-105"
                  >
                    <span>Prova la demo</span>
                    <span>→</span>
                  </Link>
                )}
                <Link
                  href={product.ctaUrl || '/aziende#prenota-call'}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white border-2 border-slate-300 hover:border-amber-400 text-slate-700 font-bold text-lg transition-all shadow-sm hover:shadow-md dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-amber-500"
                >
                  <span>{product.ctaText || 'Contattaci'}</span>
                </Link>
              </div>

              {/* Tech Stack */}
              {product.techStack && (
                <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
                    Stack tecnologico
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium dark:bg-slate-800 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Image */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <Image
                  src={product.coverImage || product.image || '/placeholder.jpg'}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -z-10 -top-8 -right-8 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl" />
              <div className="absolute -z-10 -bottom-8 -left-8 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl" />
            </div>
          </div>
        </section>

        {/* Problem & Solution */}
        <section className="bg-slate-50 dark:bg-slate-900/30 py-20">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Problem */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 text-rose-700 font-semibold text-sm">
                  ⚠️ Il problema
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                  Cosa risolve
                </h2>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  {product.problem}
                </p>
              </div>

              {/* Solution */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-sm">
                  ✨ La soluzione
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                  Come funziona
                </h2>
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  {product.solution}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
              ⚡ Funzionalità
            </div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
              Caratteristiche principali
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
                  📊 Caso studio
                </div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                  Un caso reale
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
                      Situazione iniziale
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {product.caseStudy.problem}
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-emerald-200 dark:bg-slate-900/80 dark:border-emerald-900/50">
                    <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-200 mb-3">
                      Implementazione
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {product.caseStudy.solution}
                    </p>
                  </div>
                </div>

                {/* Results */}
                <div className="p-8 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-amber-200 dark:bg-slate-900/80 dark:border-amber-900/50">
                  <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-6">
                    Risultati misurati
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
                  ? 'Pronto per adattarlo al tuo caso?' 
                  : 'Interessato a questo tipo di soluzione?'}
              </h2>
              <p className="text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
                {product.status === 'live'
                  ? 'Possiamo personalizzare questa webapp per le tue esigenze specifiche in 2-4 settimane. Partiamo con un prototipo funzionante e iteriamo in base ai feedback.'
                  : 'Questo prodotto è in sviluppo. Se hai un caso d\'uso simile, possiamo anticipare lo sviluppo e costruirlo insieme come progetto pilota.'}
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Link
                  href="/aziende#prenota-call"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-lg transition-all shadow-lg hover:scale-105"
                >
                  <span>Prenota una call gratuita</span>
                  <span>→</span>
                </Link>
                <Link
                  href="/prodotti"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white font-bold text-lg transition-all"
                >
                  <span>Vedi altri prodotti</span>
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
