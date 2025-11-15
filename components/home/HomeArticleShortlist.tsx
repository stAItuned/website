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
    <section className="max-w-7xl mx-auto mt-14 px-4 sm:mt-16">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Shortlist</p>
        <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Cosa puoi leggere su stAItuned</h2>
        <p className="text-slate-600">
          Sia che tu sia un’azienda che vuole capire l’AI, sia che tu sia un tecnico che vuole approfondire.
        </p>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {columns.map((column) => (
          <div
            key={column.heading}
            className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-md"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-slate-900">{column.heading}</h3>
              <p className="text-slate-600">{column.description}</p>
            </div>
            <div className="mt-6 space-y-4">
              {column.items.map((item) => {
                const post = postMap.get(item.slug)
                if (!post) return null

                const formattedDate = formatDate(post.date)
                const readingTime = post.readingTime ? `${post.readingTime} min` : null
                const badgeText = item.badge ?? post.target ?? 'General'

                return (
                  <article
                    key={item.slug}
                    className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-5"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                      {badgeText}
                    </span>
                    <h4 className="text-lg font-semibold text-slate-900">{item.title}</h4>
                    <p className="text-sm text-slate-600">{item.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                      {readingTime && <span>{readingTime}</span>}
                      {readingTime && formattedDate && <span aria-hidden="true">•</span>}
                      {formattedDate && <span>{formattedDate}</span>}
                    </div>
                  </article>
                )
              })}
            </div>
            <Link
              href={column.linkHref}
              className="mt-6 inline-flex items-center justify-center rounded-full border border-slate-900/20 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {column.linkLabel}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
