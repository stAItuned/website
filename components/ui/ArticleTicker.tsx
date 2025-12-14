'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useFastAnalytics, formatAnalyticsNumber } from '@/lib/hooks/useFastAnalytics'

export interface TickerArticle {
  title: string
  slug: string
  cover?: string
  author?: string
  date?: string
  readingTime?: number
  target?: string
  language?: string
  isNew?: boolean
}

interface ArticleTickerProps {
  articles: TickerArticle[]
  speed?: 'slow' | 'normal' | 'fast' | 'turbo'
  pauseOnHover?: boolean
  showCover?: boolean
  showDate?: boolean
  showStats?: boolean
  className?: string
  externalPaused?: boolean
}

const SPEED_MAP = {
  slow: 30,
  normal: 50,
  fast: 80,
  turbo: 120,
} as const

const formatShortDate = (dateString?: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ========== Single Ticker Item ==========

function TickerItem({
  article,
  showCover,
  showDate,
  showStats,
}: {
  article: TickerArticle
  showCover: boolean
  showDate: boolean
  showStats: boolean
}) {
  const { data: analytics, loading: analyticsLoading } = useFastAnalytics({
    slug: article.slug,
    enabled: showStats
  })

  const getArticleLink = () => {
    const target = article.target?.toLowerCase() || 'general'
    return `/learn/${target}/${article.slug}`
  }

  const getCoverImage = () => {
    if (!article.cover) return null
    if (article.cover.startsWith('http') || article.cover.startsWith('/')) {
      return article.cover
    }
    const cleanCover = article.cover.replace(/^\.\//, '')
    return `/content/articles/${article.slug}/${cleanCover}`
  }

  const coverSrc = getCoverImage()
  const isFeatured = !analyticsLoading && (analytics?.pageViews || 0) >= 100
  const isNew = article.isNew === true

  return (
    <Link
      href={getArticleLink()}
      className={`
        flex-shrink-0 flex items-start gap-2 py-2 px-2.5
        rounded-lg transition-all duration-100 group
        min-w-[200px] max-w-[240px] relative
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${isFeatured
          ? 'bg-gradient-to-br from-amber-50 to-white dark:from-amber-900/20 dark:to-slate-800 border-2 border-amber-400/60 dark:border-amber-500/50 shadow-md'
          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
        }
        hover:bg-primary-50 dark:hover:bg-primary-900/40
        hover:border-primary-300 dark:hover:border-primary-600
        hover:shadow-lg hover:scale-[1.02]
      `}
      aria-label={`Read article: ${article.title}`}
    >
      {/* NEW Badge */}
      {isNew && (
        <span className="absolute top-1 right-1 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded shadow-sm z-10">
          NEW
        </span>
      )}

      {/* Featured star */}
      {isFeatured && (
        <span className="absolute top-1 left-1 w-4 h-4 flex items-center justify-center bg-amber-400 text-amber-900 rounded shadow-sm z-10">
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </span>
      )}

      {/* Cover image */}
      {showCover && coverSrc && (
        <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 mt-0.5">
          <Image
            src={coverSrc}
            alt=""
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-200"
            sizes="40px"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 line-clamp-2 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {article.title}
        </span>

        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-slate-500">
          {showDate && article.date && (
            <span className="whitespace-nowrap">{formatShortDate(article.date)}</span>
          )}
          {showStats && (
            <>
              {showDate && <span className="text-slate-300 dark:text-slate-600">•</span>}
              {analyticsLoading ? (
                <span className="opacity-50">...</span>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span title="Views" className="flex items-center gap-0.5">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {formatAnalyticsNumber(analytics?.pageViews || 0)}
                  </span>
                  <span title="Visitors" className="flex items-center gap-0.5">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {formatAnalyticsNumber(analytics?.users || 0)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Read CTA on hover */}
      <span className="hidden sm:flex items-center gap-0.5 text-[9px] font-medium text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1">
        Read
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  )
}

// ========== Main ArticleTicker Component ==========
// Uses CSS animation for smooth infinite scroll

export function ArticleTicker({
  articles,
  speed = 'normal',
  pauseOnHover = true,
  showCover = true,
  showDate = true,
  showStats = true,
  className = '',
  externalPaused = false,
}: ArticleTickerProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isTabVisible, setIsTabVisible] = useState(true)
  const [trackWidth, setTrackWidth] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Page Visibility API
  useEffect(() => {
    const handleVisibilityChange = () => setIsTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Measure track width for animation
  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth / 2)
      }
    }
    const timeout = setTimeout(measure, 100)
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', measure)
    }
  }, [articles])

  if (!articles || articles.length === 0) return null

  const pixelsPerSecond = SPEED_MAP[speed]
  const duration = trackWidth > 0 ? trackWidth / pixelsPerSecond : 30

  // Determine if animation should run
  const shouldAnimate = !prefersReducedMotion && !externalPaused && !(pauseOnHover && isHovered) && isTabVisible

  // Double the articles for seamless loop
  const displayArticles = [...articles, ...articles]

  return (
    <section
      className={`relative overflow-hidden ${className}`}
      role="region"
      aria-label="Article ticker"
    >
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

      <div
        ref={trackRef}
        className="flex gap-2 py-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          animation: trackWidth > 0 ? `ticker-marquee ${duration}s linear infinite` : 'none',
          animationPlayState: shouldAnimate ? 'running' : 'paused',
          ['--ticker-translate' as string]: `-${trackWidth}px`,
        }}
      >
        {displayArticles.map((article, index) => (
          <TickerItem
            key={`${article.slug}-${index}`}
            article={article}
            showCover={showCover}
            showDate={showDate}
            showStats={showStats}
          />
        ))}
      </div>
    </section>
  )
}

export default ArticleTicker
