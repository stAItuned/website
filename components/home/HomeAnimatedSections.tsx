'use client'

import { ScrollReveal, FadeIn } from '@/components/ui/Animations'
import { HomeDualTracks } from './HomeDualTracks'
import { HomeArticleShortlist } from './HomeArticleShortlist'
import { HomeNextStep } from './HomeNextStep'
import { ArticleTicker } from '@/components/ui/ArticleTicker'
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
  tickerArticles?: {
    title: string
    slug: string
    cover?: string
    author?: string
    date?: string
    readingTime?: number
    target?: string
    language?: string
  }[]
}

export function HomeAnimatedSections({ shortlistColumns, posts, tickerArticles }: HomeAnimatedSectionsProps) {
  return (
    <>
      {/* Fixed Article Ticker - Premium Bottom Overlay */}
      {tickerArticles && tickerArticles.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 hidden sm:block animate-slide-up">
          {/* Top accent gradient line */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-primary-500 to-transparent" />

          {/* Glass container */}
          <div className="relative bg-gradient-to-r from-white/95 via-white/90 to-white/95 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-900/95 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/30 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-500/[0.03] to-transparent pointer-events-none" />

            <div className="relative flex items-center gap-4 py-3 px-2">
              {/* Latest badge - enhanced */}
              <div className="flex-shrink-0 pl-3 flex items-center gap-3">
                <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-primary-500/15 to-primary-600/10 dark:from-primary-400/20 dark:to-primary-500/15 border border-primary-500/20 dark:border-primary-400/20">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gradient-to-br from-primary-400 to-primary-600 shadow-sm"></span>
                  </span>
                  <span className="text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                    Latest<br />Articles
                  </span>
                </div>
                {/* Separator */}
                <div className="h-6 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent dark:via-slate-600" />
              </div>

              {/* Ticker */}
              <div className="flex-1 overflow-hidden">
                <ArticleTicker
                  articles={tickerArticles}
                  speed="fast"
                  pauseOnHover={true}
                  showCover={true}
                  showDate={true}
                  showStats={true}
                />
              </div>

              {/* Fade hint on right */}
              <div className="flex-shrink-0 pr-4 hidden lg:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <span className="opacity-60">hover to pause</span>
                <svg className="w-4 h-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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

