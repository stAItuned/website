import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageTransition } from '@/components/ui/PageTransition'
import { getAllProducts } from '@/lib/products'
import { ProductCardVideo } from '@/components/ProductCardVideo'

export const dynamic = 'force-static'
export const revalidate = 21600 // every 6 hours

export const metadata: Metadata = {
  title: 'Lab Projects - stAItuned',
  description: 'Esperimenti di AI che diventano prodotti. Webapp nate da progetti pilota con PMI, riadattabili ai tuoi processi in poche settimane.',
  alternates: {
    canonical: 'https://staituned.com/prodotti',
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    url: 'https://staituned.com/prodotti',
    title: 'Lab Projects - stAItuned',
    description: 'Prodotti e webapp di AI nati da casi d\'uso reali. Progetti pilota che diventano soluzioni concrete.',
    type: 'website',
  },
}

export default function DemoPage() {
  const products = getAllProducts()

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto mb-32 mt-[120px] px-4 lg:px-6 space-y-24">

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-3 text-primary-500 w-full md:w-fit bg-white/60 backdrop-blur-sm px-6 py-3 rounded-2xl font-medium shadow-sm border border-slate-200/50 dark:bg-slate-900/60 dark:border-slate-800/50 dark:text-primary-400 transition-all hover:shadow-md">
          <Link href="/" className="text-sm lg:text-base opacity-60 hover:opacity-100 transition-opacity hover:underline underline-offset-4">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-sm lg:text-base font-semibold truncate">Prodotti & Webapp</span>
        </nav>

        {/* Hero */}
        <section className="space-y-8 text-slate-900 dark:text-slate-100">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 bg-clip-text text-transparent leading-[1.1]">
                stAI tuned Lab
              </h1>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200">
                Esperimenti di AI che diventano prodotti
              </h2>
              <div className="flex flex-wrap gap-2.5">
                <span className="rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg">
                  Progetti pilota
                </span>
                <span className="rounded-full bg-white/80 backdrop-blur-sm border-2 border-slate-200 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-700 dark:bg-slate-900/80 dark:border-slate-700 dark:text-slate-300">
                  Open Source
                </span>
                <span className="rounded-full bg-white/80 backdrop-blur-sm border-2 border-slate-200 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-700 dark:bg-slate-900/80 dark:border-slate-700 dark:text-slate-300">
                  Demo interattive
                </span>
              </div>
            </div>
            <p className="text-xl lg:text-2xl font-medium text-slate-700 max-w-4xl leading-relaxed dark:text-slate-200">
              Mini-app e demo di AI che nascono dai nostri progetti pilota. Alcune diventano prodotti interni per aziende, altre restano qui come esperimenti aperti.
            </p>
          </div>
          <div className="space-y-4 max-w-4xl pt-4 border-t-2 border-slate-200/50 dark:border-slate-800/50">
            <p className="text-lg text-slate-600 leading-relaxed dark:text-slate-300">
              Ogni webapp qui sotto è nata da un caso d\'uso reale: un problema di una PMI, un'idea di automazione, o un esperimento che volevamo validare velocemente.
            </p>
            <p className="text-lg font-semibold text-slate-800 leading-relaxed dark:text-slate-100 bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
              Questi prodotti sono il risultato dei nostri progetti pilota con le PMI. Se uno di questi casi ti assomiglia, possiamo adattarlo e portarlo nei tuoi processi in 2–4 settimane.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed dark:text-slate-300">
              Puoi usarle liberamente, studiarle (molte hanno codice aperto), o <Link href="/aziende#prenota-call" className="font-semibold text-amber-600 dark:text-amber-400 hover:underline">contattarci per adattarle al tuo caso specifico</Link>.
            </p>
          </div>
        </section>

        {/* Demo Grid */}
        <section className="space-y-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
              🚀 Esplora
            </div>
            <h3 className="text-4xl font-bold text-slate-900 dark:text-slate-50">
              Prodotti creati su misura dai nostri progetti pilota
            </h3>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-16 space-y-6">
              <div className="text-6xl">🔨</div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                Stiamo costruendo le prime demo
              </h4>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Le prime webapp nasceranno dai progetti pilota in corso. Torna presto o iscriviti alla newsletter per essere aggiornato.
              </p>
              <Link
                href="/newsletter"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-semibold transition-all shadow-md hover:scale-105"
              >
                <span>Iscriviti alla newsletter</span>
                <span>→</span>
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => {
                const statusColors = {
                  'coming-soon': 'bg-slate-100 text-slate-600',
                  'beta': 'bg-blue-100 text-blue-700',
                  'live': 'bg-green-100 text-green-700'
                }
                const statusLabels = {
                  'coming-soon': 'Prossimamente',
                  'beta': 'Beta',
                  'live': 'Disponibile'
                }
                return (
                  <Link
                    key={product.slug}
                    href={`/prodotti/${product.slug}`}
                    className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm transition-all duration-300 hover:border-amber-300 hover:shadow-lg hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900/50"
                  >
                    <div className="space-y-5">
                      <div className="relative h-56 sm:h-64 w-full overflow-hidden rounded-t-xl bg-slate-100 dark:bg-slate-800/70 flex items-center justify-center group/video">
                        {product.image && (
                          <>
                            {product.image.endsWith('.mp4') ? (
                              <ProductCardVideo
                                src={product.image}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                priority={index < 2}
                              />
                            )}
                          </>
                        )}
                        <span className={`absolute left-3 top-3 md:left-4 md:top-4 px-2.5 py-1 md:px-3 md:py-1 rounded-full text-xs font-bold shadow-sm ${statusColors[product.status]}`}>
                          {statusLabels[product.status]}
                        </span>
                      </div>
                      <div className="px-6 pb-6 space-y-3">
                        <div className="space-y-2">
                          <h4 className="text-xl font-bold text-slate-900 dark:text-slate-50 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {product.title}
                          </h4>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {product.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium dark:bg-slate-800 dark:text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-2 text-amber-600 group-hover:text-amber-700 font-semibold transition-colors text-sm">
                            <span>Scopri di più</span>
                            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        {/* CTA per progetti custom */}
        <section className="space-y-8 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-10 shadow-lg">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm">
              💡 Per la tua azienda
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">
              Serve una webapp custom per la tua PMI?
            </h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              Possiamo costruire un progetto pilota simile per il tuo caso specifico. Parti da una demo funzionante in 2-4 settimane e decidi poi come scalare.
            </p>
            <Link
              href="/aziende"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-lg transition-all shadow-md hover:scale-105"
            >
              <span>Scopri il percorso aziende</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* Info finale */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Le demo vengono aggiunte man mano che completiamo i progetti pilota con le PMI. Ogni webapp qui rappresenta un caso d\'uso reale validato.
          </p>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Per domande o suggerimenti: <a href="mailto:demo@staituned.com" className="text-amber-600 hover:text-amber-700 underline underline-offset-2">demo@staituned.com</a>
          </p>
        </section>

      </div>
    </PageTransition>
  )
}
