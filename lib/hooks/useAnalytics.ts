'use client'

import { useState, useEffect, useCallback } from 'react'

interface AnalyticsData {
  articleUrl: string
  pageViews: number
  uniquePageViews: number
  avgTimeOnPage: number
  bounceRate: number
  users: number
  sessions: number
  dateRange: {
    startDate: string
    endDate: string
  }
}

interface UseAnalyticsResult {
  data: AnalyticsData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

interface UseAnalyticsOptions {
  slug?: string
  target?: 'newbie' | 'midway' | 'expert'
  startDate?: string
  endDate?: string
  enabled?: boolean
}

export function useAnalytics(options: UseAnalyticsOptions = {}): UseAnalyticsResult {
  const {
    slug,
    target = 'midway',
    startDate = '30daysAgo',
    endDate = 'today',
    enabled = true
  } = options

  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        target,
        ...(slug && { slug })
      })

      const response = await fetch(`/api/analytics?${params}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        // Even on API error, use the mock data provided
        if (result.data) {
          setData(result.data)
        }
        setError(result.error || 'Failed to fetch analytics data')
      }
    } catch (err) {
      setError('Network error while fetching analytics')
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [slug, target, startDate, endDate, enabled])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const refetch = () => {
    fetchAnalytics()
  }

  return {
    data,
    loading,
    error,
    refetch
  }
}

// Hook for multiple articles analytics
interface UseMultipleAnalyticsResult {
  data: Array<{
    articleUrl: string
    pageTitle?: string
    pageViews: number
    uniquePageViews: number
    avgTimeOnPage: number
    bounceRate: number
    users: number
    sessions: number
    // CMS fields
    title?: string
    author?: string
    target?: string
    topics?: string[]
    readingTime?: number
    published?: boolean
  }> | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useMultipleAnalytics(options: Omit<UseAnalyticsOptions, 'slug'> = {}): UseMultipleAnalyticsResult {
  const {
    target = 'midway',
    startDate = '30daysAgo',
    endDate = 'today',
    enabled = true
  } = options

  const [data, setData] = useState<UseMultipleAnalyticsResult['data']>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        target
      })

      const response = await fetch(`/api/analytics?${params}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || 'Failed to fetch analytics data')
      }
    } catch (err) {
      setError('Network error while fetching analytics')
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [target, startDate, endDate, enabled])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const refetch = () => {
    fetchAnalytics()
  }

  return {
    data,
    loading,
    error,
    refetch
  }
}

// Track custom events
export function trackArticleEvent(
  event: string,
  articleSlug: string,
  target: string,
  userId?: string
) {
  // Client-side tracking with gtag
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      article_slug: articleSlug,
      article_target: target,
      user_id: userId,
      event_category: 'Article Interaction',
      event_label: `${target}/${articleSlug}`,
    })
  }

  // Also send to our API for additional processing
  fetch('/api/analytics', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event,
      articleSlug,
      target,
      userId
    })
  }).catch(err => {
    console.error('Failed to track event:', err)
  })
}

// Format analytics numbers for display
export function formatAnalyticsNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Format time duration (seconds to readable format)
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  }
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

// Format bounce rate as percentage
export function formatBounceRate(rate: number): string {
  return `${Math.round(rate * 100)}%`
}
