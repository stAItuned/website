'use client'

import { useEffect, useRef } from 'react'
import { trackPWAEvent } from '@/hooks/usePWAAnalytics'

/**
 * Invisible component that tracks PWA-related analytics events
 * 
 * Tracks:
 * - Standalone mode sessions (when user opens the installed PWA)
 * 
 * Place this component in your root layout to track PWA usage.
 */
export function PWAAnalyticsTracker() {
    const hasTracked = useRef(false)

    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined') return

        // Only track once per session
        if (hasTracked.current) return

        // Check if running in standalone mode (installed PWA)
        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true || // iOS Safari
            document.referrer.includes('android-app://') // Android TWA

        if (isStandalone) {
            hasTracked.current = true
            trackPWAEvent('pwa_standalone_session', {
                page: window.location.pathname,
                context: 'app_launch',
            })
        }
    }, [])

    // This component doesn't render anything
    return null
}

export default PWAAnalyticsTracker
