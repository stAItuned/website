'use client'


import Image from 'next/image'
import { useFastAnalytics, formatAnalyticsNumber } from '@/lib/hooks/useFastAnalytics'

interface ArticleCardProps {
  article: {
    title: string
    slug: string
    cover?: string
    author?: string
    date?: string
    meta?: string
    readingTime?: number
    target?: string
    language?: string
    topics?: string[]
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  // Fetch analytics for this article (fast endpoint)
  const { data: analyticsData, loading: analyticsLoading } = useFastAnalytics({ slug: article.slug })
  const getValidImageSrc = (cover?: string) => {
    if (!cover) return null
    if (cover.startsWith('http://') || cover.startsWith('https://')) {
      return cover
    }
    if (cover.startsWith('/')) {
      return cover
    }
    // Handle cases where cover has nested paths like "./cover.jpeg"
    const cleanCover = cover.replace(/^\.\//, '')
    return `/content/articles/${article.slug}/${cleanCover}`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const getAuthorImageSrc = (author?: string) => {
    if (!author) return null
    const authorSlug = author.replaceAll(' ', '-')
    return `/content/team/${authorSlug}/propic.jpg`
  }

  const isArticleNew = (dateString?: string) => {
    if (!dateString) return false
    const publishedDate = new Date(dateString)
    if (Number.isNaN(publishedDate.getTime())) return false

    const today = new Date()
    return (
      publishedDate.getFullYear() === today.getFullYear() &&
      publishedDate.getMonth() === today.getMonth() &&
      publishedDate.getDate() === today.getDate()
    )
  }

  const getTargetStyle = (target?: string) => {
    const targetStyles = {
      'Newbie': 'bg-green-500/90 text-white',
      'Midway': 'bg-yellow-500/90 text-white',
      'Expert': 'bg-red-500/90 text-white',
      'General': 'bg-gray-500/90 text-white'
    }
    return targetStyles[target as keyof typeof targetStyles] || targetStyles.General
  }

  const imageSrc = getValidImageSrc(article.cover)
  const authorImageSrc = getAuthorImageSrc(article.author)
  const isNewArticle = isArticleNew(article.date)

  const target = article.target?.toLowerCase() || article.topics?.[0]?.toLowerCase() || 'general'

  return (
    <div
      onClick={() => (window.location.href = `/learn/${target}/${article.slug}`)}
      className="text-primary-600 hover:cursor-pointer h-full group"
    >
      <div
        className="relative flex flex-col h-full rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900 overflow-hidden transition-all duration-500 ease-out hover:shadow-xl hover:-translate-y-1 hover:border-primary-300 dark:hover:border-primary-700"
      >
        <div className="relative w-full h-40 overflow-hidden shrink-0">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={article.title}
              width={600}
              height={338}
              className="article-card-image object-cover w-full h-full transform scale-105 transition-transform duration-700 ease-out group-hover:scale-100"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
              loading="lazy"
              quality={60}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          )}
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top Left Stack: New + Views */}
          <div className="absolute top-3 left-3 z-20 flex flex-col items-start gap-2">
            {isNewArticle ? (
              <span className="inline-flex items-center rounded-lg bg-emerald-500/90 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide shadow-lg backdrop-blur-md border border-white/10">
                New
              </span>
            ) : (
              <div className="flex items-center bg-white/90 dark:bg-black/60 text-slate-700 dark:text-slate-200 rounded-lg px-2 py-1 shadow-lg text-[10px] font-semibold gap-1.5 backdrop-blur-md border border-white/20 dark:border-white/10 transition-all duration-300">
                <svg className="w-3 h-3 text-slate-400 dark:text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {analyticsLoading ? '...' : formatAnalyticsNumber(analyticsData?.pageViews || 0)}
              </div>
            )}
          </div>

          {/* Top Right: Target Badge (Glassmorphism) */}
          {article.target && (
            <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold z-20 shadow-lg backdrop-blur-md border border-white/10 transition-transform duration-300 group-hover:scale-105 ${getTargetStyle(article.target)} opacity-90`}>
              {article.target}
            </div>
          )}
        </div>

        {/* Post Info */}
        <div className="flex flex-col flex-1 p-5 bg-white dark:bg-gray-900 transition-colors duration-300">

          {/* Metadata: Date & Time */}
          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mb-3 font-medium">
            <span>{formatDate(article.date)}</span>
            {article.readingTime && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                <span>{article.readingTime} min read</span>
              </>
            )}
          </div>

          <h3 className="font-bold text-lg leading-snug mb-2 text-slate-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300 line-clamp-2">
            {article.title}
          </h3>

          {/* Description shown if available */}
          {article.meta && (
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
              {article.meta}
            </p>
          )}

          {/* Footer: Author & Action */}
          <div className="mt-auto flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 group/author">
              {authorImageSrc && (
                <Image
                  src={authorImageSrc}
                  alt="avatar"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-sm"
                  loading="lazy"
                />
              )}
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 group-hover/author:text-slate-800 dark:group-hover/author:text-slate-200 transition-colors">
                {article.author}
              </span>
            </div>

            <span className="text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Read
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
