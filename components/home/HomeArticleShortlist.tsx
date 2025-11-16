import Link from 'next/link'
import type { Post } from 'contentlayer/generated'

interface ShortlistItemDef {
  slug: string
  title: string
  description: string
  badge?: string
}

interface ColumnShortlist {
  heading: string
  description: string
  linkLabel: string
  linkHref: string
  items: ShortlistItemDef[]
}

interface HomeArticleShortlistProps {
  columns: ColumnShortlist[]
  posts: Post[]
}

export function HomeArticleShortlist({ columns, posts }: HomeArticleShortlistProps) {
  const postMap = new Map(posts.map((post) => [post.slug, post]))

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return null
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString
    return date.toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <section className="max-w-7xl mx-auto mt-20 px-4">
      <div className="space-y-5 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white shadow-md dark:bg-slate-800">
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-400">Shortlist</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 leading-tight">
          Cosa puoi leggere su <span className="text-amber-500">stAItuned</span>
        </h2>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          Risorse pensate sia per aziende che valutano l’AI, sia per tecnici che vogliono approfondire e sperimentare con casi d’uso reali.
        </p>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-2">
        {columns.map((column, columnIndex) => (
          <div
            key={column.heading}
            className="flex flex-col rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/40"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 leading-snug">
                {column.heading}
              </h3>
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
                {columnIndex + 1}
              </div>
            </div>
            <p className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
              {column.description}
            </p>
            <div className="mt-8 space-y-5">
              {column.items.map((item) => {
                const post = postMap.get(item.slug)
                if (!post) return null
                const formattedDate = formatDate(post.date)
                const readingTime = post.readingTime ? `${post.readingTime} min` : null
                const badgeText = item.badge ?? post.target ?? 'General'
                return (
                  <article
                    key={item.slug}
                    className="group relative rounded-2xl border border-slate-100 bg-slate-50/70 backdrop-blur-sm p-5 dark:border-slate-800 dark:bg-slate-800/40 transition hover:border-amber-200 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                        {badgeText}
                      </span>
                      {readingTime && (
                        <span className="text-[10px] font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                          {readingTime}
                        </span>
                      )}
                    </div>
                    <h4 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {formattedDate && <span>{formattedDate}</span>}
                      {formattedDate && post.readingTime && <span aria-hidden>•</span>}
                      {post.readingTime && <span>{readingTime}</span>}
                    </div>
                  </article>
                )
              })}
            </div>
            <Link
              href={column.linkHref}
              className="mt-10 inline-flex items-center justify-center rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-semibold text-sm px-6 py-3 shadow-sm transition"
            >
              {column.linkLabel}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
