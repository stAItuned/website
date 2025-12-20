'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LearnLocaleProvider, useLearnLocale } from '@/lib/i18n'
import { LearnHero, LearnStats, LearnHowItWorks } from './components'

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
  )
}
