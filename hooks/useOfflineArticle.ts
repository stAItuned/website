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

// Cache name prefix must match sw-learn.js CACHE_NAMES.ARTICLES pattern
// The SW uses: `${CACHE_PREFIX}-articles-${SW_VERSION}` = 'staituned-learn-articles-v2.1.0'
const ARTICLES_CACHE_PREFIX = 'staituned-learn-articles-'

/**
 * Hook to manage offline article caching
 * 
 * Uses the service worker to cache articles for offline reading.
 * Fully client-side - no Firebase dependencies.
 */
export function useOfflineArticle(articleSlug: string): OfflineArticleState {
    const [isCached, setIsCached] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    /**
     * Find the active articles cache (matches any version)
     */
    const findArticlesCache = useCallback(async (): Promise<Cache | null> => {
        if (typeof window === 'undefined' || !('caches' in window)) return null

        try {
            const cacheNames = await caches.keys()
            const articlesCache = cacheNames.find(name => name.startsWith(ARTICLES_CACHE_PREFIX))

            if (articlesCache) {
                return await caches.open(articlesCache)
            }
            return null
        } catch (error) {
            console.error('[useOfflineArticle] Error finding cache:', error)
            return null
        }
    }, [])

    const checkCacheStatus = useCallback(async () => {
        if (typeof window === 'undefined') return

        try {
            const cache = await findArticlesCache()
            if (!cache) {
                setIsCached(false)
                return
            }

            const keys = await cache.keys()
            // Check if any cached URL contains this slug
            const cached = keys.some(req => req.url.includes(articleSlug))
            setIsCached(cached)
        } catch (error) {
            console.error('[useOfflineArticle] Error checking cache:', error)
            setIsCached(false)
        }
    }, [articleSlug, findArticlesCache])

    // Check if article is already cached on mount
    useEffect(() => {
        checkCacheStatus()
    }, [checkCacheStatus])

    const saveForOffline = useCallback(async (): Promise<boolean> => {
        if (typeof window === 'undefined') return false
        if (!('serviceWorker' in navigator)) {
            console.warn('[useOfflineArticle] Service workers not supported')
            return false
        }

        setIsLoading(true)

        try {
            // Try to get the /learn scope service worker
            const registration = await navigator.serviceWorker.getRegistration('/learn')

            if (!registration?.active) {
                console.warn('[useOfflineArticle] No active service worker for /learn scope')

                // Fallback: Try to cache directly using Cache API
                try {
                    const currentUrl = window.location.href
                    const response = await fetch(currentUrl)

                    if (response.ok) {
                        // Open or create a cache with current version pattern
                        const cacheNames = await caches.keys()
                        const existingCache = cacheNames.find(name => name.startsWith(ARTICLES_CACHE_PREFIX))
                        const cacheName = existingCache || `${ARTICLES_CACHE_PREFIX}v2.1.0`

                        const cache = await caches.open(cacheName)
                        await cache.put(currentUrl, response)

                        setIsCached(true)
                        setIsLoading(false)
                        console.log('[useOfflineArticle] Cached directly via Cache API:', currentUrl)
                        return true
                    }
                } catch (fallbackError) {
                    console.error('[useOfflineArticle] Fallback caching failed:', fallbackError)
                }

                setIsLoading(false)
                return false
            }

            // Send message to service worker to cache the article
            const currentUrl = window.location.pathname

            registration.active.postMessage({
                type: 'CACHE_ARTICLE',
                url: currentUrl
            })

            // Wait for caching to complete, then verify
            await new Promise(resolve => setTimeout(resolve, 2000))
            await checkCacheStatus()

            setIsLoading(false)
            return isCached || true // Optimistically return true since SW doesn't confirm
        } catch (error) {
            console.error('[useOfflineArticle] Error saving for offline:', error)
            setIsLoading(false)
            return false
        }
    }, [checkCacheStatus, isCached])

    const removeFromCache = useCallback(async (): Promise<boolean> => {
        if (typeof window === 'undefined') return false

        setIsLoading(true)

        try {
            const cache = await findArticlesCache()
            if (!cache) {
                setIsLoading(false)
                setIsCached(false)
                return true
            }

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
    }, [articleSlug, findArticlesCache])

    return {
        isCached,
        isLoading,
        saveForOffline,
        removeFromCache
    }
}

export default useOfflineArticle

