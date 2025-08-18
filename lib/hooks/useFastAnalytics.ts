'use client'

import { useState, useEffect, useCallback } from 'react'

interface AnalyticsData {
  pageViews: number
  users: number
  sessions: number
  avgTimeOnPage: number
  bounceRate: number
  updatedAt?: string
}

interface UseAnalyticsResult {
  data: AnalyticsData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

interface UseAnalyticsOptions {
  slug?: string
  enabled?: boolean
}

export function useFastAnalytics(options: UseAnalyticsOptions = {}): UseAnalyticsResult {
  const { slug, enabled = true } = options

  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create cache key
  const cacheKey = `fast_analytics_${slug || 'global'}`
  
  const fetchAnalytics = useCallback(async () => {
    if (!enabled) return

    // Check local cache first (5 minutes for fast analytics)
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try {
          const { data: cachedData, timestamp } = JSON.parse(cached)
          // Cache for 5 minutes (data updates hourly anyway)
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            setData(cachedData)
            return
          }
        } catch (e) {
          localStorage.removeItem(cacheKey)
        }
      }
    }

    setLoading(true)
    setError(null)

    try {
      const params = slug ? new URLSearchParams({ slug }) : ''
      const response = await fetch(`/api/analytics/fast${params ? `?${params}` : ''}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const result = await response.json()

      if (result.success && result.data) {
        setData(result.data)
        
        // Cache for 5 minutes
        if (typeof window !== 'undefined') {
          localStorage.setItem(cacheKey, JSON.stringify({
            data: result.data,
            timestamp: Date.now(),
            source: result.source
          }))
        }
      } else {
        throw new Error(result.error || 'Failed to fetch analytics')
      }
    } catch (err) {
      console.error('📊 Fast Analytics Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      
      // Set fallback data on error
      setData({
        pageViews: 0,
        users: 0,
        sessions: 0,
        avgTimeOnPage: 0,
        bounceRate: 0,
      })
    } finally {
      setLoading(false)
    }
  }, [slug, enabled, cacheKey])

  const refetch = useCallback(() => {
    // Clear cache and refetch
    if (typeof window !== 'undefined') {
      localStorage.removeItem(cacheKey)
    }
    fetchAnalytics()
  }, [fetchAnalytics, cacheKey])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return { data, loading, error, refetch }
}

// Format numbers for display
export function formatAnalyticsNumber(value: number): string {
  if (value < 1000) return value.toString()
  if (value < 1000000) return `${(value / 1000).toFixed(1)}K`
  return `${(value / 1000000).toFixed(1)}M`
}

// Keep the original hook for backward compatibility
export { useAnalytics } from './useAnalytics'
