'use client'

import { useCallback, useRef } from 'react'
import { event as gtagEvent } from '@/lib/gtag'

/**
 * PWA Event types for analytics tracking
 */
export type PWAEventType =
    | 'pwa_install_prompt_shown'   // beforeinstallprompt event fired
    | 'pwa_install_accepted'       // User accepted the install prompt
    | 'pwa_install_dismissed'      // User dismissed the install prompt
    | 'pwa_app_installed'          // appinstalled event fired
    | 'pwa_standalone_session'     // User opened app in standalone mode

interface PWAEventParams {
    /** The page where the event occurred */
    page?: string
    /** Source of the install (banner, inline, etc.) */
    source?: string
    /** Additional context */
    context?: string
}

/**
 * Track a PWA-related analytics event
 * 
 * @param eventName - The PWA event type to track
 * @param params - Optional parameters for the event
 */
export function trackPWAEvent(
    eventName: PWAEventType,
    params: PWAEventParams = {}
): void {
    if (typeof window === 'undefined') return

    // Use gtag if available
    if (window.gtag) {
        window.gtag('event', eventName, {
            event_category: 'PWA',
            event_label: params.source || 'default',
            page_location: params.page || window.location.href,
            custom_parameter_source: params.source,
            custom_parameter_context: params.context,
        })
    }

    // Also use the gtag event helper for consistency
    gtagEvent({
        action: eventName,
        category: 'PWA',
        label: params.source || 'default',
    })

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log(`📊 [PWA Analytics] ${eventName}`, params)
    }
}

/**
 * Hook to manage PWA analytics tracking
 * 
 * Provides functions to track various PWA events and ensures
 * events are only tracked once per session where appropriate.
 */
export function usePWAAnalytics() {
    // Track which events have been sent this session
    const trackedEvents = useRef<Set<string>>(new Set())

    /**
     * Track an event, optionally ensuring it's only tracked once per session
     */
    const track = useCallback((
        eventName: PWAEventType,
        params: PWAEventParams = {},
        oncePerSession = false
    ) => {
        if (oncePerSession) {
            const eventKey = `${eventName}_${params.source || 'default'}`
            if (trackedEvents.current.has(eventKey)) {
                return
            }
            trackedEvents.current.add(eventKey)
        }

        trackPWAEvent(eventName, params)
    }, [])

    /**
     * Track when the install prompt becomes available
     */
    const trackPromptShown = useCallback((source?: string) => {
        track('pwa_install_prompt_shown', { source }, true)
    }, [track])

    /**
     * Track when user accepts the install prompt
     */
    const trackInstallAccepted = useCallback((source?: string) => {
        track('pwa_install_accepted', { source })
    }, [track])

    /**
     * Track when user dismisses the install prompt
     */
    const trackInstallDismissed = useCallback((source?: string) => {
        track('pwa_install_dismissed', { source })
    }, [track])

    /**
     * Track when the app is installed (appinstalled event)
     */
    const trackAppInstalled = useCallback(() => {
        track('pwa_app_installed', {}, true)
    }, [track])

    /**
     * Track a standalone mode session
     */
    const trackStandaloneSession = useCallback(() => {
        track('pwa_standalone_session', {}, true)
    }, [track])

    return {
        track,
        trackPromptShown,
        trackInstallAccepted,
        trackInstallDismissed,
        trackAppInstalled,
        trackStandaloneSession,
    }
}

export default usePWAAnalytics
