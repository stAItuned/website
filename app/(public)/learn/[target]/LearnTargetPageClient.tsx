'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { PageTransition } from '@/components/ui/PageTransition'
import { ArticleCard } from '@/components/ArticleCard'
import { useLearnLocale } from '@/lib/i18n'

export type LearnTarget = 'newbie' | 'midway' | 'expert'

export interface LearnTargetArticle {
  title: string
  slug: string
  cover?: string
  author?: string
  date?: string
  meta?: string
  readingTime?: number
  target: 'Newbie' | 'Midway' | 'Expert'
  language?: string
  topics?: string[]
  primaryTopic?: string
}

interface LearnTargetPageClientProps {
  target: LearnTarget
  articles: LearnTargetArticle[]
  totalPublishedArticles: number
}

const PAGE_SIZE = 12

const TARGET_META: Record<LearnTarget, { emoji: string; label: string }> = {
  newbie: { emoji: '🌱', label: 'Newbie' },
  midway: { emoji: '⚡', label: 'Midway' },
  expert: { emoji: '🔬', label: 'Expert' },
}

export default function LearnTargetPageClient({
  target,
  articles,
  totalPublishedArticles,
}: LearnTargetPageClientProps) {
  const { locale } = useLearnLocale()
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  const paginatedArticles = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return articles.slice(start, start + PAGE_SIZE)
  }, [articles, safePage])

  const targetMeta = TARGET_META[target]
  const headerTitle =
    locale === 'it'
      ? `Percorso ${targetMeta.label}: articoli selezionati`
      : `${targetMeta.label} Track: curated articles`
  const headerSubtitle =
    locale === 'it'
      ? 'Pagina tematica server-rendered per consultare i contenuti del livello e passare ai filtri avanzati quando serve.'
      : 'Server-rendered topic page with level-focused content and a shortcut to advanced filtering when needed.'
  const advancedFiltersLabel = locale === 'it' ? 'Apri filtri avanzati' : 'Open advanced filters'
  const emptyTitle = locale === 'it' ? 'Nessun articolo disponibile' : 'No articles available'
  const emptyDescription =
    locale === 'it'
      ? 'Non ci sono ancora contenuti pubblicati per questo livello. Controlla di nuovo presto.'
      : 'There are no published articles for this level yet. Check back soon.'

  return (
    <PageTransition>
      <main className="max-w-7xl mx-auto mt-16 md:mt-20 mb-20 px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/learn/articles" className="hover:text-primary-600 transition-colors">Learn</Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100 font-semibold">{targetMeta.label}</span>
        </nav>

        <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 mb-8">
          <div className="absolute inset-0 opacity-30 bg-[url('/grid.svg')]" />
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold">
              <span>{targetMeta.emoji}</span>
              <span>{targetMeta.label}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{headerTitle}</h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-3xl">{headerSubtitle}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 pt-1">
              <span>{articles.length} {locale === 'it' ? 'articoli nel livello' : 'articles in this level'}</span>
              <span className="opacity-40">•</span>
              <span>{totalPublishedArticles} {locale === 'it' ? 'articoli pubblicati totali' : 'total published articles'}</span>
            </div>
            <div className="pt-2">
              <Link
                href={`/learn/articles?level=${target}`}
                className="inline-flex items-center gap-2 rounded-xl bg-white text-slate-900 font-semibold px-4 py-2.5 hover:bg-slate-100 transition-colors"
              >
                {advancedFiltersLabel}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        {articles.length === 0 ? (
          <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{emptyTitle}</h2>
            <p className="text-slate-600 dark:text-slate-400">{emptyDescription}</p>
          </section>
        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </section>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage === 1}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {locale === 'it' ? 'Precedente' : 'Previous'}
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {safePage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={safePage === totalPages}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {locale === 'it' ? 'Successiva' : 'Next'}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </PageTransition>
  )
}
