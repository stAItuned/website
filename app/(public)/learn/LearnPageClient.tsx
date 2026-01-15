'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
<<<<<<< HEAD
import { ArticleTicker, type ArticleTickerRef, type TickerArticle } from '@/components/ui/ArticleTicker'
import { trackTargetLevelSelected } from '@/lib/analytics'

interface Target {
  name: string
  slug: string
  description: string
  image: string
}

interface Article {
  title: string
  slug: string
  cover?: string
  author?: string
  date: string
  meta?: string
  readingTime?: number
  target?: string
  language?: string
  published?: boolean
}
=======
import Link from 'next/link'
import { LearnLocaleProvider, useLearnLocale } from '@/lib/i18n'
import { LearnHero, LearnStats, LearnHowItWorks } from './components'
>>>>>>> 7a30c35 (feat: Add new Learn section with articles and components, enhance Aziende pages with new components and use case images, update Home section, and modify existing components.)

interface LearnPageClientProps {
  // Props kept for compatibility but not used in main view
  targets?: unknown[]
  articlesByTarget?: unknown
  latestArticles?: unknown[]
  tickerArticles?: unknown[]
  totalArticleCount?: number
}

/**
 * Learn Page - Router landing (Blog vs Lab)
 * 
 * Premium design with:
 * - Animated hero section with glassmorphism cards
 * - Stats section with animated counters
 * - Enhanced How It Works timeline
 * - Final CTA section
 */
export default function LearnPageClient({ totalArticleCount = 30 }: LearnPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const target = searchParams.get('target')

  // Redirect legacy ?target= URLs to /learn/articles
  useEffect(() => {
    if (target) {
      router.replace(`/learn/articles?level=${target}`)
    }
  }, [target, router])

  // If redirecting, show nothing
  if (target) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <LearnLocaleProvider>
      <div className="space-y-20">
        {/* 1. Hero + Router (Blog vs Lab decision) */}
        <LearnHero />

        {/* 2. Stats Section (animated counters) */}
        <LearnStats articleCount={totalArticleCount} />

        {/* 3. How It Works (contributor + lab paths) */}
        <LearnHowItWorks />

        {/* 4. Final CTA Section */}
        <FinalCTA />
      </div>
<<<<<<< HEAD

      {/* Article Ticker Section */}
      {tickerArticles && tickerArticles.length > 0 && (
        <div className="space-y-3">
          {/* Ticker Header with Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Trending Now
              </span>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1.5">
              {/* Play/Pause */}
              <button
                onClick={() => setIsTickerPaused(!isTickerPaused)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all shadow-sm ${isTickerPaused
                  ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-400'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600'
                  }`}
                aria-label={isTickerPaused ? 'Play ticker' : 'Pause ticker'}
              >
                {isTickerPaused ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                )}
              </button>

              {/* Navigation Arrows */}
              <button
                onClick={() => {
                  setIsTickerPaused(true)
                  tickerRef.current?.scrollPrev()
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg border bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600"
                aria-label="Previous article"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => {
                  setIsTickerPaused(true)
                  tickerRef.current?.scrollNext()
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg border bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600"
                aria-label="Next article"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Ticker Component */}
          <div className="-mx-4 lg:-mx-6">
            <ArticleTicker
              ref={tickerRef}
              articles={tickerArticles}
              speed="normal"
              pauseOnHover={true}
              showCover={true}
              showDate={true}
              showStats={true}
              externalPaused={isTickerPaused}
              className="py-2"
            />
          </div>
        </div>
      )}

      {/* Target Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {targets.map((target, index) => {
          const articleCount = articlesByTarget[target.slug as keyof typeof articlesByTarget]?.length || 0
          const gradients = {
            newbie: 'from-emerald-500 to-green-600',
            midway: 'from-amber-500 to-orange-600',
            expert: 'from-rose-500 to-red-600'
          }
          const hoverGradients = {
            newbie: 'from-emerald-600 to-green-700',
            midway: 'from-amber-600 to-orange-700',
            expert: 'from-rose-600 to-red-700'
          }
          const icons = {
            newbie: (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4.41 0-8-3.59-8-8V8.5l8-4.5 8 4.5V12c0 4.41-3.59 8-8 8z" />
              </svg>
            ),
            midway: (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ),
            expert: (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" />
              </svg>
            )
          }

          return (
            <Link
              key={target.slug}
              href={`/learn?target=${target.slug}`}
              onClick={() => trackTargetLevelSelected(target.slug as 'newbie' | 'midway' | 'expert')}
              className="group relative"
            >
              <div className="relative h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow transition-all duration-300 overflow-hidden hover:shadow-lg hover:scale-[1.01] hover:border-slate-300 dark:hover:border-slate-700">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br opacity-5 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-10"
                  style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr opacity-5 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-10"
                  style={{ backgroundImage: `linear-gradient(to top right, var(--tw-gradient-stops))` }}></div>

                {/* Image Section - Compact on mobile */}
                <div className="relative w-full aspect-[16/9] lg:aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 z-10"></div>
                  <Image
                    src={target.image}
                    alt={`${target.name} learning path`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={85}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />

                  {/* FREE Badge */}
                  <div className="absolute top-2 left-2 lg:top-3 lg:left-3 z-20 flex items-center gap-1 bg-emerald-500 text-white rounded-full px-2 py-0.5 lg:px-2.5 lg:py-1 shadow-lg">
                    <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-wide">Free</span>
                  </div>

                  {/* Article Count Badge */}
                  <div className="absolute top-2 right-2 lg:top-3 lg:right-3 z-20 flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-900 dark:text-slate-100 rounded-full px-2 py-1 lg:px-3 lg:py-1.5 shadow border border-slate-200/50 dark:border-slate-700/50">
                    <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-primary-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                    <span className="text-[10px] lg:text-xs font-bold">{articleCount}</span>
                  </div>
                </div>

                {/* Content Section - Compact on mobile */}
                <div className="relative flex-1 p-3 lg:p-6 space-y-2 lg:space-y-3">
                  {/* Icon and Title */}
                  <div className="space-y-3">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${gradients[target.slug as keyof typeof gradients]} group-hover:from-${hoverGradients[target.slug as keyof typeof hoverGradients].split(' ')[0]} text-white shadow transition-all duration-300`}>
                      {icons[target.slug as keyof typeof icons]}
                      <span className="text-xl font-bold">{target.name}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {target.description}
                  </p>

                  {/* CTA */}
                  <div className="pt-2">
                    <div className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-3 transition-all">
                      <span>Explore articles</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Lab Banner */}
      <div className="rounded-3xl border-2 border-primary-100 bg-gradient-to-r from-primary-50 via-white to-primary-50 p-6 sm:p-8 shadow-md dark:border-primary-300/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 dark:bg-primary-300/20 dark:text-primary-200">
              Step 4 · Pratica reale
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">🚀 Ready to build real AI projects?</h3>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              Join the stAItuned Lab: work on real company use-cases, receive mentorship, and get the chance to collaborate on paid projects.
            </p>
          </div>
          <Link
            href="/lab"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-500"
          >
            Discover the Lab
            <span aria-hidden className="text-base">→</span>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto pt-8">
        {[
          { label: 'Always Free', value: '100%', icon: '🆓', highlight: true },
          { label: 'Total Articles', value: totalArticleCount ?? Object.values(articlesByTarget).flat().length, icon: '📚' },
          { label: 'Learning Paths', value: targets.length.toString(), icon: '🎯' },
          { label: 'Expert Writers', value: '10+', icon: '✍️' }
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`text-center p-4 sm:p-6 rounded-2xl border shadow-sm ${(stat as any).highlight
              ? 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/20 border-emerald-200 dark:border-emerald-700/50 ring-2 ring-emerald-500/20'
              : 'bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700'
              }`}
          >
            <div className="text-3xl sm:text-4xl mb-2">{stat.icon}</div>
            <div className={`text-2xl sm:text-3xl font-bold ${(stat as any).highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>{stat.value}</div>
            <div className={`text-xs sm:text-sm font-medium ${(stat as any).highlight ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* PWA Install CTA - Strategic placement after stats, uses hero variant for impact */}
      <PWAInstallInline variant="hero" />

      {/* Dual CTA Section: Write for stAItuned + Join the Lab */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-4">
        {/* Write for stAItuned CTA - Using ContributorCTA component */}
        <ContributorCTA source="learn-page" className="h-full" />

        {/* Join the Lab CTA */}
        <div className="rounded-2xl border-2 border-primary-200 bg-gradient-to-br from-primary-50 via-indigo-50 to-purple-50 p-6 shadow-md dark:border-primary-700/40 dark:from-primary-900/20 dark:via-indigo-900/10 dark:to-purple-900/10 transition-all hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600/50">
          <div className="flex flex-col h-full">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700 dark:bg-primary-800/30 dark:text-primary-300">
                🚀 Practice
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                Join the stAItuned Lab
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Work on real AI projects with company use-cases, receive mentorship, and get the chance to collaborate on paid work.
              </p>
            </div>
            <Link
              href="/lab"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-500"
            >
              Discover the Lab
              <span aria-hidden className="text-base">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Latest Articles Section */}
      {latestArticles.length > 0 && (
        <div className="pt-12">
          <LatestArticles
            articles={latestArticles}
            maxArticles={6}
            title="Latest Articles"
            description="Discover our most recent content across all learning paths"
          />
        </div>
      )}
    </div>
=======
    </LearnLocaleProvider>
  )
}

/**
 * Final CTA Section - Strong push to action
 */
function FinalCTA() {
  const { t } = useLearnLocale()

  return (
    <section className="relative overflow-hidden rounded-3xl">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-indigo-600/20 to-purple-600/20" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-[60px]" />

      <div className="relative px-6 py-16 sm:px-12 sm:py-20">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Ready to start your journey?
          </h2>

          <p className="text-lg text-slate-300 max-w-xl mx-auto">
            Whether you want to learn from curated content or build real projects with feedback — your path starts here.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/learn/articles"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-900 font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span>📚</span>
              {t.router.read.ctaPrimary}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            <Link
              href="/lab"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-indigo-500 hover:scale-105 transition-all duration-300"
            >
              <span>🚀</span>
              {t.router.build.ctaPrimary}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              100% Free
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              No Paywall
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Editorial Review
            </span>
          </div>
        </div>
      </div>
    </section>
>>>>>>> 7a30c35 (feat: Add new Learn section with articles and components, enhance Aziende pages with new components and use case images, update Home section, and modify existing components.)
  )
}
