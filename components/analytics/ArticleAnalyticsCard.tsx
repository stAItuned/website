'use client'

import { useAnalytics, formatAnalyticsNumber } from '@/lib/hooks/useAnalytics'

interface ArticleAnalyticsCardProps {
  slug: string
  target: string
  className?: string
  showLabel?: boolean
}

export default function ArticleAnalyticsCard({ 
  slug, 
  target, 
  className = '',
  showLabel = true 
}: ArticleAnalyticsCardProps) {
  const { data: analytics, loading, error } = useAnalytics({
    slug,
    target: target as 'newbie' | 'midway' | 'expert',
    startDate: '30daysAgo',
    endDate: 'today'
  })

  if (loading) {
    return (
      <div className={`flex items-center space-x-1 text-xs text-gray-500 ${className}`}>
        <svg className="w-3 h-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>Loading...</span>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className={`flex items-center space-x-1 text-xs text-gray-400 ${className}`}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span>--</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-1 text-xs text-gray-600 ${className}`}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <span>
        {formatAnalyticsNumber(analytics.pageViews)}
        {showLabel && ' views'}
      </span>
    </div>
  )
}
