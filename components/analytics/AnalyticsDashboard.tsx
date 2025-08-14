'use client'

import { useState } from 'react'
import { useAnalytics, useMultipleAnalytics, formatAnalyticsNumber, formatDuration, formatBounceRate } from '@/lib/hooks/useAnalytics'
import AnalyticsCacheStatus from './AnalyticsCacheStatus'

interface AnalyticsDashboardProps {
  articleSlug?: string
  target?: 'newbie' | 'midway' | 'expert'
  className?: string
}

export default function AnalyticsDashboard({ 
  articleSlug, 
  target = 'midway',
  className = '' 
}: AnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState('30daysAgo')
  const [selectedTarget, setSelectedTarget] = useState<'newbie' | 'midway' | 'expert'>(target)

  // Fetch analytics for single article or multiple articles
  const singleArticleAnalytics = useAnalytics({
    slug: articleSlug,
    target: selectedTarget,
    startDate: dateRange,
    enabled: !!articleSlug
  })

  const multipleAnalytics = useMultipleAnalytics({
    target: selectedTarget,
    startDate: dateRange,
    enabled: !articleSlug
  })

  const analytics = articleSlug ? singleArticleAnalytics : multipleAnalytics
  const data = articleSlug ? singleArticleAnalytics.data : null
  const multipleData = !articleSlug ? multipleAnalytics.data : null

  const handleDateRangeChange = (range: string) => {
    setDateRange(range)
  }

  const handleTargetChange = (newTarget: 'newbie' | 'midway' | 'expert') => {
    setSelectedTarget(newTarget)
  }

  const getDateRangeLabel = (range: string) => {
    switch (range) {
      case '7daysAgo': return 'Last 7 days'
      case '30daysAgo': return 'Last 30 days'
      case '90daysAgo': return 'Last 90 days'
      default: return 'Last 30 days'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Cache Status */}
      <AnalyticsCacheStatus />

      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {articleSlug ? 'Article Analytics' : 'Content Analytics'}
          </h2>
          <p className="text-gray-600 mt-1">
            {analytics.loading ? 'Loading analytics data...' : 
             analytics.error ? 'Using sample data due to API limitations' :
             `Real-time analytics from Google Analytics`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Target Audience Filter */}
          <select
            value={selectedTarget}
            onChange={(e) => handleTargetChange(e.target.value as 'newbie' | 'midway' | 'expert')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            <option value="newbie">Newbie</option>
            <option value="midway">Midway</option>
            <option value="expert">Expert</option>
          </select>

          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            <option value="7daysAgo">Last 7 days</option>
            <option value="30daysAgo">Last 30 days</option>
            <option value="90daysAgo">Last 90 days</option>
          </select>

          <button
            onClick={analytics.refetch}
            disabled={analytics.loading}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center space-x-2"
          >
            {analytics.loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Single Article Analytics */}
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-semibold text-gray-900">{formatAnalyticsNumber(data.pageViews)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                <p className="text-2xl font-semibold text-gray-900">{formatAnalyticsNumber(data.users)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                <p className="text-2xl font-semibold text-gray-900">{formatDuration(data.avgTimeOnPage)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{formatBounceRate(data.bounceRate)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multiple Articles List */}
      {multipleData && multipleData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Top Articles ({getDateRangeLabel(dateRange)})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bounce Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {multipleData.map((article, index) => {
                  const extendedArticle = article as typeof article & {
                    title?: string
                    author?: string
                    target?: string
                    topics?: string[]
                  }
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {extendedArticle.title || extendedArticle.pageTitle || extendedArticle.articleUrl.split('/').pop()?.replace(/-/g, ' ')}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {extendedArticle.articleUrl}
                          </div>
                          {extendedArticle.topics && extendedArticle.topics.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {extendedArticle.topics.slice(0, 2).map((topic: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                >
                                  {topic}
                                </span>
                              ))}
                              {extendedArticle.topics.length > 2 && (
                                <span className="text-xs text-gray-400">+{extendedArticle.topics.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {extendedArticle.author || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          extendedArticle.target === 'newbie' ? 'bg-green-100 text-green-800' :
                          extendedArticle.target === 'expert' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {extendedArticle.target ? extendedArticle.target.charAt(0).toUpperCase() + extendedArticle.target.slice(1) : 'Midway'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatAnalyticsNumber(extendedArticle.pageViews)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatAnalyticsNumber(extendedArticle.users)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDuration(extendedArticle.avgTimeOnPage)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatBounceRate(extendedArticle.bounceRate)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data State */}
      {!analytics.loading && !data && (!multipleData || multipleData.length === 0) && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-600">
            {articleSlug 
              ? 'No analytics data found for this article yet.' 
              : 'No articles found for the selected criteria.'}
          </p>
        </div>
      )}

      {/* Data Source Info */}
      <div className="text-xs text-gray-500 border-t pt-4">
        <p>
          {analytics.error 
            ? '⚠️ Displaying sample data. Real analytics require Google Analytics API configuration.'
            : '✅ Data sourced from Google Analytics 4 via Data API v1'}
        </p>
        <p className="mt-1">
          Last updated: {new Date().toLocaleString()} • Target audience: {selectedTarget} • Period: {getDateRangeLabel(dateRange)}
        </p>
      </div>
    </div>
  )
}
