/* eslint-disable react/no-array-index-key */
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ScrollReveal, FadeIn, StaggerContainer } from '@/components/ui/Animations'
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
  const [activeTab, setActiveTab] = useState(0)
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

  const getCoverSrc = (post: Post) => {
    const cover = post.cover?.trim()
    if (!cover) return null
    if (cover.startsWith('http://') || cover.startsWith('https://')) {
      // Validate absolute URL covers
      try {
        new URL(cover)
        return cover
      } catch {
        return null
      }
    }
    if (cover.startsWith('/')) {
      return cover
    }
    if (post.imagePath) {
      return `${post.imagePath}/${cover.replace(/^\//, '')}`
    }
    try {
      const url = new URL(cover)
      if (url.protocol === 'http:' || url.protocol === 'https:') return cover
    } catch {
    }
    return null
  }

  const tabbedColumns = useMemo(() => columns.slice(0, 3), [columns])
  const activeColumn = tabbedColumns[activeTab] ?? tabbedColumns[0]

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

      <div className="mt-14">
        <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white via-slate-50 to-white shadow-md dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/70 dark:to-slate-950">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 via-amber-50/30 to-amber-100/20 opacity-70 dark:from-amber-400/5 dark:via-amber-400/10 dark:to-amber-300/5" />
          <div className="relative flex flex-wrap items-center gap-2 border-b border-slate-100 bg-white/70 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/60">
            {tabbedColumns.map((column, index) => {
              const isActive = index === activeTab
              return (
                <button
                  key={column.heading}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                  aria-pressed={isActive}
                >
                  {column.heading}
                </button>
              )
            })}
          </div>

          {activeColumn && (
            <div className="relative px-6 py-7">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 leading-snug">
                    {activeColumn.heading}
                  </h3>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed">
                    {activeColumn.description}
                  </p>
                  {activeColumn.microCopy && (
                    <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                      {activeColumn.microCopy}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <Link
                    href={activeColumn.linkHref}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-4 py-2 text-[13px] font-semibold text-white shadow-md transition hover:-translate-y-[1px] hover:shadow-lg dark:from-white dark:via-slate-100 dark:to-white dark:text-slate-900"
                  >
                    <span>{activeColumn.linkLabel}</span>
                    <span aria-hidden className="text-base">→</span>
                  </Link>
                  {activeColumn.secondaryLinkHref && activeColumn.secondaryLinkLabel && (
                    <Link
                      href={activeColumn.secondaryLinkHref}
                      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-amber-200 bg-white/85 px-4 py-2 text-[13px] font-semibold text-amber-700 transition hover:-translate-y-[1px] hover:border-amber-300 hover:shadow-md dark:border-amber-300/40 dark:bg-slate-800/70 dark:text-amber-200"
                    >
                      <span>{activeColumn.secondaryLinkLabel}</span>
                      <span aria-hidden className="text-base">↗</span>
                    </Link>
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-2.5 md:grid-cols-3">
                {activeColumn.items.slice(0, 4).map((item, index) => {
                  const post = postMap.get(item.slug)
                  const formattedDate = post ? formatDate(post.date) : null
                  const readingTime = post?.readingTime ? `${post.readingTime} min` : null
                  const badgeText = item.badge ?? post?.target ?? 'General'
                  const href = item.href ?? (post ? getArticleHref(post, item.slug) : '#')
                  const coverSrc = post ? getCoverSrc(post) : null
                  return (
                    <Link key={`${item.slug}-${index}`} href={href} className="group/item block">
                      <article className="relative overflow-hidden rounded-xl border border-slate-100 bg-white/90 backdrop-blur-sm shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/60">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 via-amber-50/40 to-amber-100/40 opacity-0 transition group-hover/item:opacity-100 dark:from-amber-400/5 dark:via-amber-400/10 dark:to-amber-300/10" />
                        {coverSrc && (
                          <div className="relative aspect-[5/4] w-full overflow-hidden border-b border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-900/40">
                            <Image
                              src={coverSrc}
                              alt={post?.title ?? item.title}
                              fill
                              sizes="(min-width: 1280px) 320px, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                              className="object-cover transition duration-500 group-hover/item:scale-105"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/25 via-slate-900/10 to-transparent" />
                          </div>
                        )}
                        <div className="p-3.5">
                          <div className="flex items-center justify-between gap-2.5">
                            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                              {badgeText}
                            </span>
                            {readingTime && (
                              <span className="text-[10px] font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full shadow-sm">
                                {readingTime}
                              </span>
                            )}
                          </div>
                          <h4 className="mt-1.5 text-sm font-bold text-slate-900 dark:text-slate-50 leading-snug line-clamp-2">
                            {item.title}
                          </h4>
                          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                            {formattedDate && <span>{formattedDate}</span>}
                            {formattedDate && readingTime && <span aria-hidden>•</span>}
                            {readingTime && <span>{readingTime}</span>}
                          </div>
                        </div>
                      </article>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Latest Articles */}
      <ScrollReveal threshold={0.2} triggerOnce={false}>
        <div className="mt-14 space-y-5">
          <FadeIn>
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Ultimi articoli dal blog</h3>
              <Link href="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-600">
                Vai al blog
                <span aria-hidden className="text-base">→</span>
              </Link>
            </div>
          </FadeIn>
          <StaggerContainer staggerDelay={100}>
            <div className="grid gap-2.5 md:grid-cols-3">
          {posts
            .filter((post) => post.published !== false)
            .sort((a, b) => new Date(b.date as any).getTime() - new Date(a.date as any).getTime())
            .slice(0, 3)
            .map((post) => {
              const href = getArticleHref(post, post.slug)
              const formattedDate = formatDate(post.date)
              const readingTime = post.readingTime ? `${post.readingTime} min` : null
              const badgeText = post.target ?? 'General'
              const coverSrc = getCoverSrc(post)
              return (
                <FadeIn key={post.slug}>
                <Link
                  href={href}
                  className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <div className="relative aspect-[5/4] w-full overflow-hidden border-b border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60">
                    {coverSrc ? (
                      <Image
                        src={coverSrc}
                        alt={post.title}
                        fill
                        sizes="(min-width: 1280px) 320px, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                        priority={false}
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-amber-50 via-white to-slate-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/25 via-slate-900/5 to-transparent" />
                  </div>
                  <div className="p-3.5">
                    <div className="flex items-center justify-between gap-2.5">
                      <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                        {badgeText}
                      </span>
                      {readingTime && (
                        <span className="text-[10px] font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded-full shadow-sm">
                          {readingTime}
                        </span>
                      )}
                    </div>
                    <h4 className="mt-1.5 text-sm font-bold text-slate-900 dark:text-slate-50 leading-snug line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">{post.meta}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      {formattedDate && <span>{formattedDate}</span>}
                      {formattedDate && readingTime && <span aria-hidden>•</span>}
                      {readingTime && <span>{readingTime}</span>}
                    </div>
                  </div>
                </Link>
                </FadeIn>
              )
            })}
            </div>
          </StaggerContainer>
        </div>
      </ScrollReveal>
    </section>
  )
}
