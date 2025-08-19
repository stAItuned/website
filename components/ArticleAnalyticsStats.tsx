"use client"

import { useState, useEffect } from 'react'
import { formatAnalyticsNumber } from '@/lib/hooks/useAnalytics'

interface ArticleAnalyticsStatsProps {
  slug: string
}

export default function ArticleAnalyticsStats({ slug }: ArticleAnalyticsStatsProps) {
  const [analytics, setAnalytics] = useState<any>({
    pageViews: 0,
    users: 0,
    likes: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/analytics/fast?slug=${encodeURIComponent(slug)}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            setAnalytics({
              pageViews: result.data.pageViews ?? 0,
              users: result.data.users ?? 0,
              likes: result.data.likes ?? 0
            })
          } else {
            setAnalytics({
              pageViews: 0,
              users: 0,
              likes: 0
            })
          }
        } else {
          setAnalytics({
            pageViews: 0,
            users: 0,
            likes: 0
          })
          setError('No data available')
        }
      } catch (err) {
        setAnalytics({
          pageViews: 0,
          users: 0,
          likes: 0
        })
        setError('Analytics unavailable')
        console.error('Analytics fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [slug])

  // Log analytics data and props to the browser console
//   if (typeof window !== 'undefined') {
//     console.log('ArticleAnalyticsStats rendered', { slug, analytics, loading, error })
//   }

  return (
  <div className="w-full px-0 mb-8">
  <div
    className="flex flex-col sm:flex-row gap-4 sm:gap-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-3 sm:p-2 border border-gray-300 dark:border-slate-700 backdrop-blur-sm w-full max-w-none"
    style={{ backgroundColor: 'rgb(230,230,230)' }}
  >
        {/* Views */}
  <div className="flex-1 flex flex-col items-center justify-center gap-1 py-2 sm:py-1">
    <div className="bg-primary-200 dark:bg-primary-800 rounded-full p-1 mb-1">
      <svg className="w-6 h-6 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" /></svg>
    </div>
    <span className="text-base font-semibold text-gray-800 dark:text-gray-200"
    style={{ color: 'rgb(0 9 26)' }}>Views</span>

    <span className="font-extrabold text-3xl md:text-2xl tracking-tight text-primary-800 dark:text-primary-200">
      {loading ? '...' : analytics?.pageViews !== undefined ? formatAnalyticsNumber(analytics.pageViews) : '-'}
    </span>
  </div>
        {/* Unique Visitors */}
  <div className="flex-1 flex flex-col items-center justify-center gap-1 py-2 sm:py-1">
    <div className="bg-primary-200 dark:bg-primary-800 rounded-full p-1 mb-1">
      <svg className="w-6 h-6 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5.13a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    </div>
    <span className="text-base font-semibold text-gray-800 dark:text-gray-200"
    style={{ color: 'rgb(0 9 26)' }}>Visitors</span>
    <span className="font-extrabold text-3xl md:text-2xl tracking-tight text-primary-800 dark:text-primary-200">
      {loading ? '...' : analytics?.users !== undefined ? formatAnalyticsNumber(analytics.users) : '-'}
    </span>
  </div>
        {/* Likes */}
  <div className="flex-1 flex flex-col items-center justify-center gap-1 py-2 sm:py-1">
    <div className="bg-primary-200 dark:bg-primary-800 rounded-full p-1 mb-1">
      <svg className="w-6 h-6 text-primary-600 dark:text-primary-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
    </div>
    <span className="text-base font-semibold text-gray-800 dark:text-gray-200"
    style={{ color: 'rgb(0 9 26)' }}>Likes</span>
    <span className="font-extrabold text-3xl md:text-2xl tracking-tight text-primary-800 dark:text-primary-200">
      {loading ? '...' : analytics?.likes !== undefined ? analytics.likes : '-'}
    </span>
  </div>
      </div>
      {(error || true) && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-2 w-full gap-1 sm:gap-0">
          {error ? (
            <div className="text-xs text-gray-400 text-left w-full sm:w-auto">{error}</div>
          ) : <span className="w-full sm:w-auto" />}
          <div className="text-[11px] text-gray-500 dark:text-gray-400 text-right select-none ml-2 w-full sm:w-auto">
            * data referred to the last 90 days
          </div>
        </div>
      )}
    </div>
  )
}
