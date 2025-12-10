'use client'

import { useEffect } from 'react'

const SERVICE_WORKER_PATH = '/sw-learn.js'
export const LEARN_SW_UPDATE_EVENT = 'staituned-learn-sw-update'

/**
 * Dispatch event when service worker updates
 */
function dispatchUpdateEvent(message: string) {
    if (typeof window === 'undefined') return
    window.dispatchEvent(
        new CustomEvent(LEARN_SW_UPDATE_EVENT, {
            detail: { message },
        }),
    )
}

/**
 * Service Worker Registration specifically for /learn PWA scope.
 * 
 * This component should only be rendered on /learn/* pages.
 * It registers sw-learn.js with scope limited to /learn.
 */
export function LearnServiceWorkerRegister() {
    useEffect(() => {
        if (!('serviceWorker' in navigator)) return

        let registration: ServiceWorkerRegistration | undefined
        let updateHandler: (() => void) | undefined

        const messageHandler = (event: MessageEvent) => {
            if (event.data?.type === 'SW_VERSION' && event.data?.scope === 'learn') {
                console.debug('[Learn PWA] service worker version', event.data.version)
            }
        }

        const watchForUpdates = (reg: ServiceWorkerRegistration) => {
            const installing = reg.installing
            if (!installing) return

            const onStateChange = () => {
                if (installing.state === 'installed' && navigator.serviceWorker?.controller) {
                    dispatchUpdateEvent('New content available for Learn section')
                }
            }

            installing.addEventListener('statechange', onStateChange)
        }

        navigator.serviceWorker.addEventListener('message', messageHandler)

        // Register with explicit /learn scope
        navigator.serviceWorker
            .register(SERVICE_WORKER_PATH, { scope: '/learn' })
            .then((reg) => {
                registration = reg
                console.log('[Learn PWA] Service Worker registered with scope:', reg.scope)

                if (reg.waiting) {
                    dispatchUpdateEvent('New content available for Learn section')
                }

                watchForUpdates(reg)

                updateHandler = () => watchForUpdates(reg)
                reg.addEventListener('updatefound', updateHandler)
            })
            .catch((error) => {
                console.error('[Learn PWA] Service Worker registration failed:', error)
            })

        return () => {
            navigator.serviceWorker.removeEventListener('message', messageHandler)
            if (registration && updateHandler) {
                registration.removeEventListener('updatefound', updateHandler)
            }
        }
    }, [])

    return null
}

/**
 * Utility to cache an article for offline reading
 */
export function cacheArticleForOffline(articlePath: string): void {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
        console.warn('[Learn PWA] Cannot cache article - no active service worker')
        return
    }

    navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_ARTICLE',
        url: articlePath,
    })
}

/**
 * Utility to clear the articles cache
 */
export function clearArticlesCache(): void {
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
        return
    }

    navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_ARTICLES_CACHE',
    })
}
