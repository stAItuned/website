'use client'

import { useAnalytics, formatAnalyticsNumber, formatDuration } from '@/lib/hooks/useAnalytics'

interface ArticleAnalyticsProps {
  slug: string
  target: string
  className?: string
}

export default function ArticleAnalytics({ slug, target, className = '' }: ArticleAnalyticsProps) {
  const { data: analytics, loading, error } = useAnalytics({
    slug,
    target: target as 'newbie' | 'midway' | 'expert',
    startDate: '30daysAgo',
    endDate: 'today'
  })

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-100 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center space-x-4">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
    )
  }

  if (error || !analytics) {
    return null // Hide analytics if there's an error or no data
  }

  return (
    <div className={`bg-gray-50 rounded-lg p-4 border border-gray-200 ${className}`}>
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span className="font-medium">Last 30 days</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {/* Page Views */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-xs">Views</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatAnalyticsNumber(analytics.pageViews)}
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <span className="text-xs">Visitors</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatAnalyticsNumber(analytics.users)}
          </div>
        </div>

        {/* Average Time */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 text-gray-500 mb-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs">Avg. Time</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">
            {formatDuration(analytics.avgTimeOnPage)}
          </div>
        </div>
      </div>
    </div>
  )
}
