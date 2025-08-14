"use client"

import { useAnalytics, formatAnalyticsNumber, formatDuration, formatBounceRate } from '@/lib/hooks/useAnalytics'

interface ArticleAnalyticsStatsProps {
  slug: string
}

export default function ArticleAnalyticsStats({ slug }: ArticleAnalyticsStatsProps) {
  const { data: analytics, loading: analyticsLoading, error: analyticsError } = useAnalytics({ slug })

  // Log analytics data and props to the browser console
//   if (typeof window !== 'undefined') {
//     console.log('ArticleAnalyticsStats rendered', { slug, analytics, analyticsLoading, analyticsError })
//   }

  return (
    <div className="max-w-4xl mx-auto px-4 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Views</span>
          <span className="font-bold text-lg">
            {analyticsLoading ? '...' : analytics?.pageViews !== undefined ? formatAnalyticsNumber(analytics.pageViews) : '-'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Unique Visitors</span>
          <span className="font-bold text-lg">
            {analyticsLoading ? '...' : analytics?.uniquePageViews !== undefined ? formatAnalyticsNumber(analytics.uniquePageViews) : '-'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Avg. Time</span>
          <span className="font-bold text-lg">
            {analyticsLoading ? '...' : analytics?.avgTimeOnPage !== undefined ? formatDuration(analytics.avgTimeOnPage) : '-'}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500">Bounce Rate</span>
          <span className="font-bold text-lg">
            {analyticsLoading ? '...' : analytics?.bounceRate !== undefined ? formatBounceRate(analytics.bounceRate) : '-'}
          </span>
        </div>
      </div>
      {analyticsError && (
        <div className="text-red-500 text-sm mt-2">{analyticsError}</div>
      )}
    </div>
  )
}
