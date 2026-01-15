'use client'

import { useState, useEffect, useCallback } from 'react'

interface AnalyticsData {
  pageViews: number
  users: number
  sessions: number
  avgTimeOnPage: number
  bounceRate: number
  bookmarkCount?: number
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
            // Normalize cached data structure as well
            const normalizedCached = cachedData?.totalStats
              ? cachedData.totalStats
              : cachedData
            setData(normalizedCached)
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
      const url = `/api/analytics/fast${params ? `?${params}` : ''}`

      // Retry logic for transient server errors (5xx, including 503)
      const maxAttempts = 3
      let attempt = 0
      let lastError: unknown = null
      let response: Response | null = null

      while (attempt < maxAttempts) {
        try {
          response = await fetch(url)
          // If we got a response, break on success or non-retryable status
          if (response.ok) break

          // Retry only on server errors (5xx). For 4xx, don't retry.
          if (response.status >= 500 && response.status < 600) {
            attempt++
            const backoff = 200 * Math.pow(2, attempt - 1) // 200ms, 400ms, 800ms
            await new Promise(resolve => setTimeout(resolve, backoff))
            continue
          }

          // Non-retryable response (e.g., 400/401/403/404)
          break
        } catch (networkErr) {
          // Network error - retry
          lastError = networkErr
          attempt++
          const backoff = 200 * Math.pow(2, attempt - 1)
          await new Promise(resolve => setTimeout(resolve, backoff))
          continue
        }
      }

      if (!response) {
        // Network completely failed after retries
        throw lastError || new Error('Network error')
      }

      // Try to parse the body if present
      let result: any = null
      try {
        result = await response.json()
      } catch (e) {
        // ignore JSON parse errors
      }

      if (response.ok && result && result.success && result.data) {
        // Normalize data structure: if we get totalStats, extract it
        const normalizedData = result.data.totalStats
          ? result.data.totalStats
          : result.data

        setData(normalizedData)

        // Cache for 5 minutes
        if (typeof window !== 'undefined') {
          localStorage.setItem(cacheKey, JSON.stringify({
            data: normalizedData,
            timestamp: Date.now(),
            source: result.source
          }))
        }
      } else {
        // Don't throw here to avoid noisy stack traces for expected transient failures.
        const errMsg = result?.error || (response.ok ? 'Invalid analytics response' : `HTTP ${response.status}`)
        // Log only in development to avoid noisy production logs. Keep message concise.
        if (process.env.NODE_ENV === 'development') {
          console.warn('📊 Fast Analytics fetch failed:', errMsg, `status=${response.status}`, url)
        }
        setError(typeof errMsg === 'string' ? errMsg : String(errMsg))

        // Set fallback (same as before)
        setData({
          pageViews: 0,
          users: 0,
          sessions: 0,
          avgTimeOnPage: 0,
          bounceRate: 0,
        })
      }
    } catch (err) {
      // Any unexpected errors bubble here (e.g., network completely failed)
      if (process.env.NODE_ENV === 'development') {
        console.warn('📊 Fast Analytics Error:', err)
      }
      setError(err instanceof Error ? err.message : 'Unknown error')

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
