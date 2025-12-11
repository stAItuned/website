'use client'

import { useState, useEffect, useCallback } from 'react'

interface OfflineArticleState {
    /** Whether the article is currently cached for offline */
    isCached: boolean
    /** Whether a cache operation is in progress */
    isLoading: boolean
    /** Save the current article for offline reading */
    saveForOffline: () => Promise<boolean>
    /** Remove article from offline cache */
    removeFromCache: () => Promise<boolean>
}

const ARTICLES_CACHE_NAME = 'staituned-learn-v1-articles'

/**
 * Hook to manage offline article caching
 * 
 * Uses the service worker to cache articles for offline reading.
 * Fully client-side - no Firebase dependencies.
 */
export function useOfflineArticle(articleSlug: string): OfflineArticleState {
    const [isCached, setIsCached] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const checkCacheStatus = useCallback(async () => {
        if (typeof window === 'undefined') return
        if (!('caches' in window)) return

        try {
            const cache = await caches.open(ARTICLES_CACHE_NAME)
            const keys = await cache.keys()

            // Check if any cached URL contains this slug
            const cached = keys.some(req => req.url.includes(articleSlug))
            setIsCached(cached)
        } catch (error) {
            console.error('[useOfflineArticle] Error checking cache:', error)
        }
    }, [articleSlug])

    // Check if article is already cached on mount
    useEffect(() => {
        checkCacheStatus()
    }, [checkCacheStatus])

    const saveForOffline = useCallback(async (): Promise<boolean> => {
        if (typeof window === 'undefined') return false
        if (!('serviceWorker' in navigator)) return false

        setIsLoading(true)

        try {
            // Get the service worker registration for /learn
            const registration = await navigator.serviceWorker.getRegistration('/learn')

            if (!registration?.active) {
                console.warn('[useOfflineArticle] No active service worker')
                setIsLoading(false)
                return false
            }

            // Send message to service worker to cache the article
            const currentUrl = window.location.pathname

            registration.active.postMessage({
                type: 'CACHE_ARTICLE',
                url: currentUrl
            })

            // Wait a bit for caching to complete, then verify
            await new Promise(resolve => setTimeout(resolve, 1500))
            await checkCacheStatus()

            setIsLoading(false)
            return true
        } catch (error) {
            console.error('[useOfflineArticle] Error saving for offline:', error)
            setIsLoading(false)
            return false
        }
    }, [checkCacheStatus])

    const removeFromCache = useCallback(async (): Promise<boolean> => {
        if (typeof window === 'undefined') return false
        if (!('caches' in window)) return false

        setIsLoading(true)

        try {
            const cache = await caches.open(ARTICLES_CACHE_NAME)
            const keys = await cache.keys()

            // Remove any cached entries for this article
            for (const request of keys) {
                if (request.url.includes(articleSlug)) {
                    await cache.delete(request)
                }
            }

            setIsCached(false)
            setIsLoading(false)
            return true
        } catch (error) {
            console.error('[useOfflineArticle] Error removing from cache:', error)
            setIsLoading(false)
            return false
        }
    }, [articleSlug])

    return {
        isCached,
        isLoading,
        saveForOffline,
        removeFromCache
    }
}

export default useOfflineArticle
