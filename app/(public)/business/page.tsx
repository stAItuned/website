import Link from 'next/link'
import type { Metadata } from 'next'
import { allPosts } from '@/lib/contentlayer'
import { PageTransition } from '@/components/ui/PageTransition'

export const dynamic = 'force-static'
export const revalidate = 21600

export const metadata: Metadata = {
  title: 'Articoli Business - stAItuned',
  description: 'Articoli per decisori PMI su come applicare l’AI a costi, tempi e qualità. Selezione curata per CEO, COO e manager.'
}

const formatDate = (dateString?: string | Date) => {
  if (!dateString) return null
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export default function BusinessArticlesPage() {
  const businessPosts = allPosts
    .filter((post) => ((post as any).business === true || post.target?.toLowerCase() === 'business') && post.published !== false)
    .sort((a, b) => new Date(b.date as any).getTime() - new Date(a.date as any).getTime())

  const getHref = (slug: string, target?: string | undefined) => {
    const resolvedTarget = target?.toLowerCase() || 'business'
    return `/learn/${resolvedTarget}/${slug}`
  }

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto mt-[110px] mb-24 px-4 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300 shadow-sm">
            Articoli per decisori PMI
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
            Articoli per la tua azienda
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Una selezione curata di letture per imprenditori, CEO e manager: come scegliere il primo pilota di AI, valutare strumenti e trasformare idee in risultati misurabili.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {businessPosts.map((post, index) => {
            const readingTime = post.readingTime ? `${post.readingTime} min` : null
            const formattedDate = formatDate(post.date)
            const href = getHref(post.slug, post.target)
            return (
              <Link
                key={post.slug}
                href={href}
                className="group relative flex flex-col rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60"
              >
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                  Business / Decisioni
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-50 leading-tight">{post.title}</h2>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">{post.meta ?? post.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {formattedDate && <span>{formattedDate}</span>}
                  {formattedDate && readingTime && <span aria-hidden>•</span>}
                  {readingTime && <span>{readingTime}</span>}
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-700 group-hover:text-amber-600">
                  Leggi l’articolo
                  <span aria-hidden className="text-base">→</span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="text-center space-y-3">
          <p className="text-base text-slate-700 dark:text-slate-300">
            Vuoi portare uno di questi spunti nella tua azienda?
          </p>
          <Link
            href="/azienda#prenota-call"
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-md transition hover:bg-amber-400"
          >
            Scopri come funzionano i nostri progetti pilota di AI
            <span aria-hidden className="text-base">→</span>
          </Link>
        </div>
      </div>
    </PageTransition>
  )
}
