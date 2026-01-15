'use client'

import { useEffect, useCallback } from 'react'
import { usePWADetection } from '@/hooks/usePWADetection'

/**
 * PWA Badge Manager
 * 
 * Manages the badge count displayed on the PWA app icon.
 * Used to show unread articles or notifications.
 * 
 * Requirements:
 * - Badging API support (Chrome 81+, Edge 81+)
 * - PWA must be installed
 * 
 * Usage:
 * - Call setAppBadge(count) to show a number
 * - Call clearAppBadge() to remove the badge
 * - Badge persists until manually cleared
 */

// Check if Badging API is supported
const isBadgeSupported = () => {
    if (typeof window === 'undefined') return false
    return 'setAppBadge' in navigator
}

/**
 * Set the app badge count
 * @param count - Number to display (0 clears the badge)
 * @returns Promise that resolves when badge is set
 */
export async function setAppBadge(count: number): Promise<boolean> {
    if (!isBadgeSupported()) {
        console.debug('[PWA Badge] Badging API not supported')
        return false
    }

    try {
        if (count === 0) {
            await navigator.clearAppBadge?.()
        } else {
            await navigator.setAppBadge?.(count)
        }
        console.debug('[PWA Badge] Set to:', count)
        return true
    } catch (error) {
        console.error('[PWA Badge] Failed to set badge:', error)
        return false
    }
}

/**
 * Clear the app badge
 * @returns Promise that resolves when badge is cleared
 */
export async function clearAppBadge(): Promise<boolean> {
    return setAppBadge(0)
}

/**
 * PWA Badge Tracker Component
 * 
 * Automatically manages badge based on unread content.
 * Currently tracks:
 * - New articles since last visit (placeholder - needs backend)
 */
export function PWABadgeTracker() {
    const { isPWA } = usePWADetection()

    const checkForNewContent = useCallback(async () => {
        if (!isPWA || !isBadgeSupported()) return

        try {
            // Get last visit timestamp from localStorage
            const lastVisit = localStorage.getItem('pwa-last-visit')
            const now = Date.now()

            // Update last visit
            localStorage.setItem('pwa-last-visit', now.toString())

            if (!lastVisit) {
                // First visit - no badge
                await clearAppBadge()
                return
            }

            // Check for new articles since last visit
            // TODO: This could be enhanced with an API call to check for new articles
            // For now, we simulate by checking if it's been more than 24h
            const hoursSinceLastVisit = (now - parseInt(lastVisit)) / (1000 * 60 * 60)

            if (hoursSinceLastVisit > 24) {
                // More than 24h since last visit - show "new content" badge
                // In production, this should check actual new article count
                await setAppBadge(1)
                console.debug('[PWA Badge] New content available')
            } else {
                await clearAppBadge()
            }
        } catch (error) {
            console.error('[PWA Badge] Failed to check for new content:', error)
        }
    }, [isPWA])

    useEffect(() => {
        // Check on mount
        checkForNewContent()

        // Clear badge when user is actively using the app
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                // User returned to app - clear badge after a delay
                setTimeout(() => clearAppBadge(), 3000)
            }
        }
        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [checkForNewContent])

    return null
}

/**
 * Hook for components that need badge control
 */
export function useAppBadge() {
    const { isPWA } = usePWADetection()

    const setBadge = useCallback(async (count: number) => {
        if (!isPWA) return false
        return setAppBadge(count)
    }, [isPWA])

    const clearBadge = useCallback(async () => {
        if (!isPWA) return false
        return clearAppBadge()
    }, [isPWA])

    return {
        isSupported: isPWA && isBadgeSupported(),
        setBadge,
        clearBadge
    }
}

// Extend Navigator type for badge API
declare global {
    interface Navigator {
        setAppBadge?: (count: number) => Promise<void>
        clearAppBadge?: () => Promise<void>
    }
}

export default PWABadgeTracker
