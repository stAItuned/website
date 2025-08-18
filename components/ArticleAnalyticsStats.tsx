"use client"

import { useState, useEffect } from 'react'
import { formatAnalyticsNumber, formatDuration, formatBounceRate } from '@/lib/hooks/useAnalytics'

interface ArticleAnalyticsStatsProps {
  slug: string
}

export default function ArticleAnalyticsStats({ slug }: ArticleAnalyticsStatsProps) {
  const [analytics, setAnalytics] = useState<any>(null)
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
            setAnalytics(result.data)
          } else {
            setAnalytics(null)
          }
        } else {
          setError('Failed to load analytics')
        }
      } catch (err) {
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
    <div className="max-w-4xl mx-auto px-4 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Views</span>
          <span className="font-bold text-lg">
            {loading ? '...' : analytics?.pageViews !== undefined ? formatAnalyticsNumber(analytics.pageViews) : '-'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Unique Visitors</span>
          <span className="font-bold text-lg">
            {loading ? '...' : analytics?.users !== undefined ? formatAnalyticsNumber(analytics.users) : '-'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Avg. Time</span>
          <span className="font-bold text-lg">
            {loading ? '...' : analytics?.avgTimeOnPage !== undefined ? formatDuration(analytics.avgTimeOnPage) : '-'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Bounce Rate</span>
          <span className="font-bold text-lg">
            {loading ? '...' : analytics?.bounceRate !== undefined ? formatBounceRate(analytics.bounceRate) : '-'}
          </span>
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
    </div>
  )
}
