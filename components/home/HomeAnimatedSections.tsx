'use client'

import { useState, useMemo } from 'react'
import { ScrollReveal, FadeIn } from '@/components/ui/Animations'
import { HomeDualTracks } from './HomeDualTracks'
import { HomeArticleShortlist } from './HomeArticleShortlist'
import { HomeNextStep } from './HomeNextStep'
import { ArticleTicker, type TickerArticle } from '@/components/ui/ArticleTicker'
import type { Post } from 'contentlayer/generated'

interface ColumnShortlist {
  heading: string
  description: string
  linkLabel: string
  linkHref: string
  secondaryLinkLabel?: string
  secondaryLinkHref?: string
  microCopy?: string
  layout?: 'wide'
  items: any[]
}

interface HomeAnimatedSectionsProps {
  shortlistColumns: ColumnShortlist[]
  posts: Post[]
  tickerArticles?: TickerArticle[]
  trendingArticles?: TickerArticle[]
}

export function HomeAnimatedSections({
  shortlistColumns,
  posts,
  tickerArticles,
  trendingArticles
}: HomeAnimatedSectionsProps) {
  const [isPaused, setIsPaused] = useState(false)
  const [activeTab, setActiveTab] = useState<'latest' | 'trending'>('latest')

  // Create pseudo-trending by shuffling articles (in production, use real trendingArticles prop)
  const pseudoTrending = useMemo(() => {
    if (trendingArticles && trendingArticles.length > 0) {
      return trendingArticles
    }
    // Shuffle the latest articles as a demo
    if (tickerArticles) {
      return [...tickerArticles].sort(() => Math.random() - 0.5)
    }
    return []
  }, [tickerArticles, trendingArticles])

  // Get active articles based on tab selection
  const displayArticles = activeTab === 'trending' ? pseudoTrending : (tickerArticles || [])

  // Toggle between Latest and Trending
  const toggleTab = () => {
    setActiveTab(prev => prev === 'latest' ? 'trending' : 'latest')
  }

  // Handle navigation using the exposed window functions
  const scrollNext = () => {
    if ((window as any).__tickerScrollNext) {
      (window as any).__tickerScrollNext()
    }
  }

  const scrollPrev = () => {
    if ((window as any).__tickerScrollPrev) {
      (window as any).__tickerScrollPrev()
    }
  }

  return (
    <>
      {/* Fixed Article Ticker - Premium Bottom Overlay */}
      {tickerArticles && tickerArticles.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 hidden sm:block animate-slide-up">
          {/* Top accent gradient line */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-primary-500 to-transparent" />

          {/* Solid container */}
          <div className="relative bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-[0_-12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_-12px_40px_rgba(0,0,0,0.4)]">

            <div className="relative flex items-stretch gap-0">
              {/* Left side: Toggle and Controls - Vertical layout */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center gap-3 px-4 py-3 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">

                {/* Single Toggle Switch for Latest/Trending - FIXED WIDTH */}
                <button
                  onClick={toggleTab}
                  className="relative flex items-center justify-center gap-2 w-[100px] px-3 py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md transition-all"
                  aria-label={`Currently showing ${activeTab}. Click to switch.`}
                  title={`Switch to ${activeTab === 'latest' ? 'Trending' : 'Latest'}`}
                >
                  {activeTab === 'latest' ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse flex-shrink-0" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                        Latest
                      </span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Trend
                      </span>
                    </>
                  )}
                  {/* Switch indicator */}
                  <svg className="w-3 h-3 text-slate-400 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>

                {/* Play/Pause and Prev/Next buttons - below toggle */}
                <div className="flex items-center gap-1.5">
                  {/* Play/Pause */}
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all shadow-sm ${isPaused
                        ? 'bg-primary-500 border-primary-500 text-white hover:bg-primary-600'
                        : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600'
                      }`}
                    aria-label={isPaused ? 'Play' : 'Pause'}
                    title={isPaused ? 'Play' : 'Pause'}
                  >
                    {isPaused ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>

                  {/* Prev */}
                  <button
                    onClick={scrollPrev}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all shadow-sm active:scale-95"
                    aria-label="Previous"
                    title="Previous"
                  >
                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Next */}
                  <button
                    onClick={scrollNext}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-all shadow-sm active:scale-95"
                    aria-label="Next"
                    title="Next"
                  >
                    <svg className="w-4 h-4 text-slate-600 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Ticker container */}
              <div className="flex-1 py-3 bg-white dark:bg-slate-900">
                <ArticleTicker
                  key={activeTab} // Force remount when tab changes
                  articles={displayArticles}
                  speed="normal"
                  pauseOnHover={true}
                  showCover={true}
                  showDate={true}
                  showStats={true}
                  externalPaused={isPaused}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dual tracks overview with animation */}
      <ScrollReveal threshold={0.2} triggerOnce={false}>
        <FadeIn duration={600}>
          <HomeDualTracks />
        </FadeIn>
      </ScrollReveal>

      {/* Shortlist per binari with animation */}
      <ScrollReveal threshold={0.2} triggerOnce={false}>
        <FadeIn duration={600} delay={100}>
          <HomeArticleShortlist columns={shortlistColumns} posts={posts} />
        </FadeIn>
      </ScrollReveal>

      {/* Next step micro-block with animation */}
      <ScrollReveal threshold={0.25} triggerOnce={false}>
        <FadeIn duration={600} delay={150}>
          <HomeNextStep />
        </FadeIn>
      </ScrollReveal>
    </>
  )
}
