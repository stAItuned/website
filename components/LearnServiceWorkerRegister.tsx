'use client'

import { useEffect } from 'react'

const SERVICE_WORKER_PATH = '/sw-learn.js'

// Custom events for SW communication
export const LEARN_SW_EVENTS = {
    UPDATE_AVAILABLE: 'staituned-learn-sw-update',
    ACTIVATED: 'staituned-learn-sw-activated',
    CONTENT_UPDATED: 'staituned-learn-content-updated',
}

/**
 * Dispatch custom event for service worker updates
 */
function dispatchEvent(eventName: string, detail: Record<string, unknown> = {}) {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent(eventName, { detail }))
}

/**
 * Service Worker Registration for /learn PWA scope
 * 
 * Features:
 * - Registers learn-specific service worker with /learn scope
 * - Handles updates gracefully with user notification
 * - Coordinates app shell to full app transition
 */
export function LearnServiceWorkerRegister() {
    useEffect(() => {
        if (!('serviceWorker' in navigator)) {
            console.log('[Learn PWA] Service workers not supported')
            return
        }

        let registration: ServiceWorkerRegistration | undefined

        const registerServiceWorker = async () => {
            try {
                // Register with explicit /learn scope
                registration = await navigator.serviceWorker.register(
                    SERVICE_WORKER_PATH,
                    { scope: '/learn' }
                )

                console.log('[Learn PWA] Service Worker registered:', registration.scope)

                // Handle immediate update check on page load
                if (registration.waiting) {
                    dispatchEvent(LEARN_SW_EVENTS.UPDATE_AVAILABLE, {
                        message: 'New version available'
                    })
                }

                // Watch for new installations
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration?.installing
                    if (!newWorker) return

                    newWorker.addEventListener('statechange', () => {
                        if (
                            newWorker.state === 'installed' &&
                            navigator.serviceWorker.controller
                        ) {
                            // New version installed, waiting to activate
                            dispatchEvent(LEARN_SW_EVENTS.UPDATE_AVAILABLE, {
                                message: 'New content available'
                            })
                        }
                    })
                })

            } catch (error) {
                console.error('[Learn PWA] Registration failed:', error)
            }
        }

        // Handle messages from service worker
        const handleMessage = (event: MessageEvent) => {
            const { type, ...data } = event.data || {}

            switch (type) {
                case 'SW_ACTIVATED':
                    console.log('[Learn PWA] Service worker activated:', data.version)
                    dispatchEvent(LEARN_SW_EVENTS.ACTIVATED, data)
                    break

                case 'CONTENT_UPDATED':
                    dispatchEvent(LEARN_SW_EVENTS.CONTENT_UPDATED, { url: data.url })
                    break
            }
        }

        navigator.serviceWorker.addEventListener('message', handleMessage)
        registerServiceWorker()

        // Check for updates periodically (every 5 minutes)
        const updateInterval = setInterval(() => {
            registration?.update()
        }, 5 * 60 * 1000)

        return () => {
            navigator.serviceWorker.removeEventListener('message', handleMessage)
            clearInterval(updateInterval)
        }
    }, [])

    return null
}

// ===============================
// UTILITY FUNCTIONS
// ===============================

/**
 * Request service worker to skip waiting and activate new version
 */
export function skipWaitingAndReload(): void {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.getRegistration('/learn').then((registration) => {
        if (registration?.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' })
            // Reload after activation
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload()
            }, { once: true })
        }
    })
}

/**
 * Get current service worker status
 */
export async function getServiceWorkerStatus(): Promise<{
    isActive: boolean
    version?: string
    scope?: string
    hasUpdate: boolean
}> {
    if (!('serviceWorker' in navigator)) {
        return { isActive: false, hasUpdate: false }
    }

    try {
        const registration = await navigator.serviceWorker.getRegistration('/learn')

        return {
            isActive: !!registration?.active,
            scope: registration?.scope,
            hasUpdate: !!registration?.waiting,
            // Version would need to be fetched via message
        }
    } catch {
        return { isActive: false, hasUpdate: false }
    }
}

/**
 * Hook for components that need SW update awareness
 */
export function useServiceWorkerUpdates(onUpdate?: () => void) {
    useEffect(() => {
        const handleUpdate = () => onUpdate?.()

        window.addEventListener(LEARN_SW_EVENTS.UPDATE_AVAILABLE, handleUpdate)
        return () => {
            window.removeEventListener(LEARN_SW_EVENTS.UPDATE_AVAILABLE, handleUpdate)
        }
    }, [onUpdate])
}

// For backwards compatibility
export const LEARN_SW_UPDATE_EVENT = LEARN_SW_EVENTS.UPDATE_AVAILABLE
