'use client'

import { useState, useEffect, useCallback } from 'react'

export interface AnalyticsData {
    pageViews: number
    users: number
    sessions: number
    avgTimeOnPage: number
    bounceRate: number
    bookmarkCount?: number
    updatedAt?: string
    likes?: number
}

interface UseBatchAnalyticsResult {
    data: Record<string, AnalyticsData>
    loading: boolean
    error: string | null
    refetch: () => void
}

export function useBatchAnalytics(slugs: string[], enabled: boolean = true): UseBatchAnalyticsResult {
    const [data, setData] = useState<Record<string, AnalyticsData>>({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Create cache key based on slugs
    const sortedSlugs = [...slugs].sort().join(',')
    const cacheKey = `batch_analytics_${sortedSlugs}`

    const fetchAnalytics = useCallback(async () => {
        if (!enabled || slugs.length === 0) return

        // Check local cache first (5 minutes)
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem(cacheKey)
            if (cached) {
                try {
                    const { data: cachedData, timestamp } = JSON.parse(cached)
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
            const params = new URLSearchParams()
            params.set('slugs', slugs.join(','))
            const url = `/api/analytics/fast?${params.toString()}`

            const response = await fetch(url)

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
                // Fallback or error
                setError(result.error || 'Invalid response')
            }
        } catch (err) {
            console.warn('📊 Batch Analytics fetch failed:', err)
            setError(err instanceof Error ? err.message : 'Unknown error')
        } finally {
            setLoading(false)
        }
    }, [slugs, enabled, cacheKey])

    const refetch = useCallback(() => {
        localStorage.removeItem(cacheKey)
        fetchAnalytics()
    }, [fetchAnalytics, cacheKey])

    useEffect(() => {
        fetchAnalytics()
    }, [fetchAnalytics])

    return { data, loading, error, refetch }
}
