import Link from 'next/link'
import type { Post } from 'contentlayer/generated'

interface ShortlistItemDef {
  slug: string
  title: string
  description: string
  badge?: string
  href?: string
}

interface ColumnShortlist {
  heading: string
  description: string
  linkLabel: string
  linkHref: string
  secondaryLinkLabel?: string
  secondaryLinkHref?: string
  microCopy?: string
  layout?: 'wide'
  items: ShortlistItemDef[]
}

interface HomeArticleShortlistProps {
  columns: ColumnShortlist[]
  posts: Post[]
}

export function HomeArticleShortlist({ columns, posts }: HomeArticleShortlistProps) {
  const postMap = new Map(posts.map((post) => [post.slug, post]))

  const getArticleHref = (post: Post, fallbackSlug: string) => {
    if (!post) return `/learn/${fallbackSlug}`
    const target = (post.target || 'midway').toString().toLowerCase()
    return `/learn/${target}/${post.slug}`
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

  return (
    <section className="max-w-7xl mx-auto mt-24 px-4">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-8 shadow-xl dark:border-slate-800/70">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.12),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.08),transparent_30%)]" />
        <div className="relative space-y-3 text-center text-white">
          <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-amber-300 shadow-sm">
            Content hub
          </span>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Cosa trovi su <span className="text-amber-300">stAItuned</span>
          </h2>
          <p className="text-base md:text-lg text-slate-100/90 max-w-3xl mx-auto">
            Risorse vere e articoli cliccabili per chi deve decidere dove usare l’AI in azienda, per chi vuole imparare, e per scoprire i nostri prodotti.
          </p>
        </div>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {columns.map((column, columnIndex) => (
          <div
            key={column.heading}
            className="group relative flex flex-col rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white via-slate-50 to-white p-7 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:from-slate-900/60 dark:via-slate-900/40 dark:to-slate-900/60"
          >
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-50/0 via-amber-50/40 to-amber-100/30 opacity-0 transition duration-300 group-hover:opacity-100 dark:from-amber-400/5 dark:via-amber-400/8 dark:to-amber-300/10" />
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 leading-snug">
                {column.heading}
              </h3>
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm shadow-sm">
                {columnIndex + 1}
              </div>
            </div>
            <p className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
              {column.description}
            </p>
            {column.microCopy && (
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                {column.microCopy}
              </p>
            )}
            <div className="mt-6 space-y-4">
              {column.items.map((item) => {
                const post = postMap.get(item.slug)
                const formattedDate = post ? formatDate(post.date) : null
                const readingTime = post?.readingTime ? `${post.readingTime} min` : null
                const badgeText = item.badge ?? post?.target ?? 'General'
                const href = item.href ?? (post ? getArticleHref(post, item.slug) : '#')
                return (
                  <Link key={item.slug} href={href} className="group/item block">
                    <article className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-sm p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/50">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 via-amber-50/40 to-amber-100/40 opacity-0 transition group-hover/item:opacity-100 dark:from-amber-400/5 dark:via-amber-400/10 dark:to-amber-300/10" />
                      <div className="flex items-center justify-between gap-4">
                        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                          {badgeText}
                        </span>
                        {readingTime && (
                          <span className="text-[10px] font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full shadow-sm">
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
                        {formattedDate && readingTime && <span aria-hidden>•</span>}
                        {readingTime && <span>{readingTime}</span>}
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
            <div className="relative mt-10 flex flex-col gap-3 sm:flex-row">
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-50/0 via-amber-50/50 to-amber-100/0 opacity-0 transition group-hover:opacity-100 dark:from-amber-400/5 dark:via-amber-400/10 dark:to-amber-300/5" />
              <Link
                href={column.linkHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-2 text-[13px] font-semibold text-white shadow-md transition hover:-translate-y-[1px] hover:shadow-lg dark:from-white dark:via-slate-100 dark:to-white dark:text-slate-900"
              >
                <span>{column.linkLabel}</span>
                <span aria-hidden className="text-base">→</span>
              </Link>
              {column.secondaryLinkHref && column.secondaryLinkLabel && (
                <Link
                  href={column.secondaryLinkHref}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-amber-200 bg-white/85 px-4 py-2 text-[13px] font-semibold text-amber-700 transition hover:-translate-y-[1px] hover:border-amber-300 hover:shadow-md dark:border-amber-300/40 dark:bg-slate-800/70 dark:text-amber-200"
                >
                  <span>{column.secondaryLinkLabel}</span>
                  <span aria-hidden className="text-base">↗</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Latest Articles */}
      <div className="mt-14 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Ultimi articoli dal blog</h3>
          <Link href="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-600">
            Vai al blog
            <span aria-hidden className="text-base">→</span>
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {posts
            .filter((post) => post.published !== false)
            .sort((a, b) => new Date(b.date as any).getTime() - new Date(a.date as any).getTime())
            .slice(0, 3)
            .map((post) => {
              const href = getArticleHref(post, post.slug)
              const formattedDate = formatDate(post.date)
              const readingTime = post.readingTime ? `${post.readingTime} min` : null
              const badgeText = post.target ?? 'General'
              return (
                <Link key={post.slug} href={href} className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                      {badgeText}
                    </span>
                    {readingTime && (
                      <span className="text-[10px] font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full shadow-sm">
                        {readingTime}
                      </span>
                    )}
                  </div>
                  <h4 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-50 leading-snug">{post.title}</h4>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">{post.meta}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {formattedDate && <span>{formattedDate}</span>}
                    {formattedDate && readingTime && <span aria-hidden>•</span>}
                    {readingTime && <span>{readingTime}</span>}
                  </div>
                </Link>
              )
            })}
        </div>
      </div>
    </section>
  )
}
