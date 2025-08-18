"use client"

import { useState, useEffect } from 'react'
import { formatAnalyticsNumber, formatDuration } from '@/lib/hooks/useAnalytics'

interface ArticleAnalyticsStatsProps {
  slug: string
}

export default function ArticleAnalyticsStats({ slug }: ArticleAnalyticsStatsProps) {
  const [analytics, setAnalytics] = useState<any>({
    pageViews: 0,
    users: 0,
    avgTimeOnPage: 0
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
              avgTimeOnPage: result.data.avgTimeOnPage ?? 0
            })
          } else {
            setAnalytics({
              pageViews: 0,
              users: 0,
              avgTimeOnPage: 0
            })
          }
        } else {
          setAnalytics({
            pageViews: 0,
            users: 0,
            avgTimeOnPage: 0
          })
          setError('No data available')
        }
      } catch (err) {
        setAnalytics({
          pageViews: 0,
          users: 0,
          avgTimeOnPage: 0
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
  <div className="flex flex-col md:flex-row gap-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-2 border border-gray-300 dark:border-slate-700 backdrop-blur-sm w-full max-w-none"
  style={{ backgroundColor: 'rgb(230,230,230)' }}>
        {/* Views */}
  <div className="flex-1 flex flex-col items-center justify-center gap-1 py-1">
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
  <div className="flex-1 flex flex-col items-center justify-center gap-1 py-1">
    <div className="bg-primary-200 dark:bg-primary-800 rounded-full p-1 mb-1">
      <svg className="w-6 h-6 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-5.13a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    </div>
    <span className="text-base font-semibold text-gray-800 dark:text-gray-200"
    style={{ color: 'rgb(0 9 26)' }}>Visitors</span>
    <span className="font-extrabold text-3xl md:text-2xl tracking-tight text-primary-800 dark:text-primary-200">
      {loading ? '...' : analytics?.users !== undefined ? formatAnalyticsNumber(analytics.users) : '-'}
    </span>
  </div>
        {/* Avg. Time */}
  <div className="flex-1 flex flex-col items-center justify-center gap-1 py-1">
    <div className="bg-primary-200 dark:bg-primary-800 rounded-full p-1 mb-1">
      <svg className="w-6 h-6 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
    </div>
    <span className="text-base font-semibold text-gray-800 dark:text-gray-200"
    style={{ color: 'rgb(0 9 26)' }}>Avg. Time</span>
    <span className="font-extrabold text-3xl md:text-2xl tracking-tight text-primary-800 dark:text-primary-200">
      {loading ? '...' : analytics?.avgTimeOnPage !== undefined ? formatDuration(analytics.avgTimeOnPage) : '-'}
    </span>
  </div>
      </div>
      {error && (
        <div className="text-xs text-gray-400 mt-2 text-center">{error}</div>
      )}
    </div>
  )
}
