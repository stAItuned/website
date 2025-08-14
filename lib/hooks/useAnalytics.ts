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
    // Remove target from default options
    startDate = '90daysAgo',
    endDate = 'today',
    enabled = true
  } = options

  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create cache key based on query parameters
  const cacheKey = `analytics_${slug || 'global'}_${startDate}_${endDate}`
  
  const fetchAnalytics = useCallback(async () => {
    if (!enabled) return

    // Check cache first
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try {
          const { data: cachedData, timestamp } = JSON.parse(cached)
          // Cache for 15 minutes
          if (Date.now() - timestamp < 15 * 60 * 1000) {
            setData(cachedData)
            return
          }
        } catch (e) {
          // Invalid cache, continue to fetch
        }
      }
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        ...(slug && { slug })
      })

      const response = await fetch(`/api/analytics?${params}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
        // Cache the result
        if (typeof window !== 'undefined') {
          localStorage.setItem(cacheKey, JSON.stringify({
            data: result.data,
            timestamp: Date.now()
          }))
        }
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
  }, [slug, startDate, endDate, enabled, cacheKey])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const refetch = () => {
    // Clear cache when manually refetching
    if (typeof window !== 'undefined') {
      localStorage.removeItem(cacheKey)
    }
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
    // Additional possible Google Analytics fields
    entrances?: number
    exits?: number
    exitRate?: number
    newUsers?: number
    pageValue?: number
    sessionDuration?: number
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
    // Remove target from default options
    startDate = '90daysAgo',
    endDate = 'today',
    enabled = true
  } = options

  const [data, setData] = useState<UseMultipleAnalyticsResult['data']>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create cache key for multiple analytics
  const cacheKey = `analytics_multiple_${startDate}_${endDate}`

  const fetchAnalytics = useCallback(async () => {
    if (!enabled) return

    // Check cache first
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try {
          const { data: cachedData, timestamp } = JSON.parse(cached)
          // Cache for 15 minutes
          if (Date.now() - timestamp < 15 * 60 * 1000) {
            setData(cachedData)
            return
          }
        } catch (e) {
          // Invalid cache, continue to fetch
        }
      }
    }

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        startDate,
        endDate
      })

      const response = await fetch(`/api/analytics?${params}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
        // Cache the result
        if (typeof window !== 'undefined') {
          localStorage.setItem(cacheKey, JSON.stringify({
            data: result.data,
            timestamp: Date.now()
          }))
        }
      } else {
        setError(result.error || 'Failed to fetch analytics data')
      }
    } catch (err) {
      setError('Network error while fetching analytics')
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate, enabled, cacheKey])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  const refetch = () => {
    // Clear cache when manually refetching
    if (typeof window !== 'undefined') {
      localStorage.removeItem(cacheKey)
    }
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

// Extract site-wide active users and sessions from analytics data
export function extractSiteMetrics(data: AnalyticsData | UseMultipleAnalyticsResult['data']): {
  activeUsers: number
  activeSessions: number
} {
  if (!data) {
    return { activeUsers: 0, activeSessions: 0 }
  }

  // If it's a single analytics data object
  if (!Array.isArray(data)) {
    return {
      activeUsers: data.users || 0,
      activeSessions: data.sessions || 0
    }
  }

  // If it's an array of analytics data, sum up all users and sessions
  const totals = data.reduce(
    (acc, item) => ({
      activeUsers: acc.activeUsers + (item.users || 0),
      activeSessions: acc.activeSessions + (item.sessions || 0)
    }),
    { activeUsers: 0, activeSessions: 0 }
  )

  return totals
}

// Cache management utilities
export function clearAnalyticsCache() {
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('analytics_'))
    keys.forEach(key => localStorage.removeItem(key))
  }
}

export function clearExpiredCache() {
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('analytics_'))
    keys.forEach(key => {
      try {
        const cached = localStorage.getItem(key)
        if (cached) {
          const { timestamp } = JSON.parse(cached)
          // Remove if older than 15 minutes
          if (Date.now() - timestamp >= 15 * 60 * 1000) {
            localStorage.removeItem(key)
          }
        }
      } catch (e) {
        // Invalid cache entry, remove it
        localStorage.removeItem(key)
      }
    })
  }
}
