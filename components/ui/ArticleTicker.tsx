'use client'

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useFastAnalytics, formatAnalyticsNumber } from '@/lib/hooks/useFastAnalytics'
import { tickerConfig } from '@/config/ui/ticker'

export interface TickerArticle {
  title: string
  slug: string
  cover?: string
  author?: string
  date?: string
  readingTime?: number
  target?: string
  language?: string
  meta?: string
  isNew?: boolean
}

// Exposed methods via ref
export interface ArticleTickerRef {
  scrollNext: () => void
  scrollPrev: () => void
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

const SPEED_MAP = tickerConfig.speed

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
  const isFeatured = !analyticsLoading && (analytics?.pageViews || 0) >= tickerConfig.featuredThreshold
  const isNew = article.isNew === true

  // Build styling classes from config
  const itemStyles = isFeatured
    ? `${tickerConfig.styles.featured.background} ${tickerConfig.styles.featured.border} ${tickerConfig.styles.featured.shadow}`
    : `${tickerConfig.styles.default.background} ${tickerConfig.styles.default.border} ${tickerConfig.styles.default.shadow}`

  const hoverStyles = `${tickerConfig.styles.hover.background} ${tickerConfig.styles.hover.border} ${tickerConfig.styles.hover.shadow}`

  return (
    <Link
      href={getArticleLink()}
      className={`
        flex-shrink-0 flex items-start gap-2 py-2 px-2.5
        rounded-lg transition-all duration-100 group
        min-w-[200px] max-w-[240px] relative
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${itemStyles}
        ${hoverStyles}
      `}
      aria-label={`Read article: ${article.title}`}
    >
      {isNew && (
        <span
          className={tickerConfig.badges.new.className}
          aria-label="New article"
        />
      )}

      {isFeatured && (
        <span className={tickerConfig.badges.featured.className}>
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </span>
      )}

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

    </Link>
  )
}

// ========== Main ArticleTicker Component ==========

// Main ArticleTicker Component
export const ArticleTicker = forwardRef<ArticleTickerRef, ArticleTickerProps>(function ArticleTicker({
  articles,
  speed = 'normal',
  pauseOnHover = true,
  showCover = true,
  showDate = true,
  showStats = true,
  className = '',
  externalPaused = false,
}, ref) {
  const [isHovered, setIsHovered] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isTabVisible, setIsTabVisible] = useState(true)
  const [trackWidth, setTrackWidth] = useState(0)

  const scrollRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)

  // Expose scroll methods via ref - smooth native scroll
  useImperativeHandle(ref, () => ({
    scrollNext: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 260, behavior: 'smooth' })
      }
    },
    scrollPrev: () => {
      if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: -260, behavior: 'smooth' })
      }
    }
  }), [])

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

  // Measure track width (half of total doubled content)
  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth / 2)
      }
    }
    // Measure immediately and after a delay to ensure fonts/images load
    measure()
    const timeout = setTimeout(measure, 500)
    window.addEventListener('resize', measure)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', measure)
    }
  }, [articles])

  // JS Animation Loop
  useEffect(() => {
    const container = scrollRef.current
    if (!container || prefersReducedMotion) return

    const shouldAnimate = !externalPaused && !(pauseOnHover && isHovered) && isTabVisible

    if (!shouldAnimate) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      return
    }

    const pixelsPerSecond = SPEED_MAP[speed]

    const animate = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime
      }

      const deltaTime = currentTime - lastTimeRef.current
      lastTimeRef.current = currentTime

      // Only scroll if we have a valid delta
      if (container && deltaTime > 0 && deltaTime < 100) { // Limit huge jumps
        const scrollAmount = (pixelsPerSecond * deltaTime) / 1000
        container.scrollLeft += scrollAmount

        // Seamless loop: reset when reaching the second set of items
        if (trackWidth > 0 && container.scrollLeft >= trackWidth) {
          container.scrollLeft = container.scrollLeft - trackWidth
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    lastTimeRef.current = 0
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [externalPaused, pauseOnHover, isHovered, isTabVisible, prefersReducedMotion, speed, trackWidth])

  if (!articles || articles.length === 0) return null

  // Double the articles for seamless loop
  const displayArticles = [...articles, ...articles]

  return (
    <section
      className={`relative ${className}`}
      role="region"
      aria-label="Article ticker"
    >
      {/* Scrollable Container with Mask for Fade Effect */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-none flex items-center"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 40px, black calc(100% - 40px), transparent)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
      >
        {/* Content Track */}
        <div
          ref={trackRef}
          className="flex flex-nowrap w-max gap-2 py-1 px-4"
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
      </div>
    </section>
  )
})

export default ArticleTicker
