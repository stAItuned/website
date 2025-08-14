'use client'

import { useAnalytics, formatAnalyticsNumber, formatDuration, formatBounceRate } from '@/lib/hooks/useAnalytics'

interface ArticleAnalyticsProps {
  slug: string
  target: 'newbie' | 'midway' | 'expert'
  className?: string
}

export function ArticleAnalytics({ slug, target, className = '' }: ArticleAnalyticsProps) {
  const { data: analytics, loading, error } = useAnalytics({
    slug,
    target,
    startDate: '30daysAgo',
    endDate: 'today'
  })

  if (loading) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 animate-pulse ${className}`}>
        <div className="flex justify-between items-center mb-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-6 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center">
          <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm text-yellow-800">
            Analytics data temporarily unavailable
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Article Analytics</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          Last 30 days
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Page Views */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-sm font-medium text-gray-600">Views</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {formatAnalyticsNumber(analytics.pageViews)}
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-600">Unique Visitors</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {formatAnalyticsNumber(analytics.users)}
          </div>
        </div>

        {/* Average Time */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-gray-600">Avg. Time</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {formatDuration(analytics.avgTimeOnPage)}
          </div>
        </div>
      </div>

      {/* Additional metrics in a secondary row */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Sessions:</span>
            <span className="font-medium">{formatAnalyticsNumber(analytics.sessions)}</span>
          </div>
          <div className="flex justify-between">
            <span>Bounce Rate:</span>
            <span className="font-medium">{formatBounceRate(analytics.bounceRate)}</span>
          </div>
        </div>
      </div>

      {/* Data source note */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Data from Google Analytics • Updated in real-time
        </p>
      </div>
    </div>
  )
}
