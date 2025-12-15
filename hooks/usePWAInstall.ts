'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { trackPWAEvent } from './usePWAAnalytics'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAInstallState {
    /** Whether the browser supports PWA installation */
    canInstall: boolean
    /** Whether the install prompt is ready to be shown */
    isPromptReady: boolean
    /** Whether the user has already installed the app */
    isInstalled: boolean
    /** Trigger the native install prompt */
    promptInstall: (source?: string) => Promise<boolean>
    /** Whether the user previously dismissed the prompt */
    wasDismissed: boolean
}

const DISMISSED_KEY = 'pwa-install-dismissed'
const DISMISSED_EXPIRY_DAYS = 7

/**
 * Hook to manage PWA installation prompt
 * 
 * Captures the beforeinstallprompt event and provides a way to trigger it.
 * Also tracks if user previously dismissed the prompt.
 * 
 * Analytics events tracked:
 * - pwa_install_prompt_shown: When the install prompt becomes available
 * - pwa_install_accepted: User accepted the install
 * - pwa_install_dismissed: User dismissed the install
 * - pwa_app_installed: App was successfully installed
 */
export function usePWAInstall(): PWAInstallState {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [isInstalled, setIsInstalled] = useState(false)
    const [wasDismissed, setWasDismissed] = useState(false)
    const [canInstall, setCanInstall] = useState(false)

    // Track if we've already sent the prompt_shown event
    const hasTrackedPrompt = useRef(false)

    useEffect(() => {
        // Check if browser supports PWA installation (client-side only)
        setCanInstall('BeforeInstallPromptEvent' in window)

        // Check if previously dismissed (with expiry)
        try {
            const dismissedData = localStorage.getItem(DISMISSED_KEY)
            if (dismissedData) {
                const { timestamp } = JSON.parse(dismissedData)
                const daysSinceDismissed = (Date.now() - timestamp) / (1000 * 60 * 60 * 24)
                if (daysSinceDismissed < DISMISSED_EXPIRY_DAYS) {
                    setWasDismissed(true)
                } else {
                    localStorage.removeItem(DISMISSED_KEY)
                }
            }
        } catch {
            // Ignore localStorage errors
        }

        // Capture the beforeinstallprompt event
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            setCanInstall(true)

            // Track that install prompt is available (once per session)
            if (!hasTrackedPrompt.current) {
                hasTrackedPrompt.current = true
                trackPWAEvent('pwa_install_prompt_shown', {
                    page: window.location.pathname,
                })
            }
        }

        // Detect when app is installed
        const handleAppInstalled = () => {
            setIsInstalled(true)
            setDeferredPrompt(null)
            try {
                localStorage.removeItem(DISMISSED_KEY)
            } catch {
                // Ignore localStorage errors
            }

            // Track successful installation
            trackPWAEvent('pwa_app_installed', {
                page: window.location.pathname,
            })
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstall)
        window.addEventListener('appinstalled', handleAppInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
            window.removeEventListener('appinstalled', handleAppInstalled)
        }
    }, [])

    const promptInstall = useCallback(async (source?: string): Promise<boolean> => {
        if (!deferredPrompt) return false

        try {
            await deferredPrompt.prompt()
            const { outcome } = await deferredPrompt.userChoice

            if (outcome === 'accepted') {
                setIsInstalled(true)
                setDeferredPrompt(null)

                // Track accepted install
                trackPWAEvent('pwa_install_accepted', {
                    source: source || 'prompt',
                    page: window.location.pathname,
                })

                return true
            } else {
                // User dismissed - save with timestamp
                try {
                    localStorage.setItem(DISMISSED_KEY, JSON.stringify({ timestamp: Date.now() }))
                } catch {
                    // Ignore localStorage errors
                }
                setWasDismissed(true)

                // Track dismissed install
                trackPWAEvent('pwa_install_dismissed', {
                    source: source || 'prompt',
                    page: window.location.pathname,
                })

                return false
            }
        } catch (error) {
            console.error('[PWA Install] Prompt failed:', error)
            return false
        }
    }, [deferredPrompt])

    return {
        canInstall: canInstall || deferredPrompt !== null,
        isPromptReady: deferredPrompt !== null,
        isInstalled,
        promptInstall,
        wasDismissed,
    }
}

/**
 * Mark the PWA install prompt as dismissed
 * Used when user clicks "Maybe later" on custom UI
 */
export function dismissPWAInstall(): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(DISMISSED_KEY, JSON.stringify({ timestamp: Date.now() }))
    } catch {
        // Ignore localStorage errors
    }
}

/**
 * Check if this is the user's first visit to learn section
 */
export function isFirstLearnVisit(): boolean {
    if (typeof window === 'undefined') return false
    try {
        const key = 'learn-first-visit'
        const visited = localStorage.getItem(key)
        if (!visited) {
            localStorage.setItem(key, 'true')
            return true
        }
        return false
    } catch {
        return false
    }
}

export default usePWAInstall

