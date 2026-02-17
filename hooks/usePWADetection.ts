'use client'

import { useState, useEffect } from 'react'

type DisplayMode = 'browser' | 'standalone' | 'fullscreen'

interface NavigatorWithStandalone extends Navigator {
    standalone?: boolean
}

function getDetectionState(): { isPWA: boolean; displayMode: DisplayMode } {
    if (typeof window === 'undefined') {
        return { isPWA: false, displayMode: 'browser' }
    }

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches
    const isIOSStandalone = (window.navigator as NavigatorWithStandalone).standalone === true

    const detected = isStandalone || isFullscreen || isIOSStandalone
    const mode: DisplayMode = isFullscreen
        ? 'fullscreen'
        : (isStandalone || isIOSStandalone)
            ? 'standalone'
            : 'browser'

    return { isPWA: detected, displayMode: mode }
}

/**
 * Detects if the app is running as an installed PWA (standalone mode)
 * 
 * @returns Object with PWA detection state and display mode
 */
export function usePWADetection() {
    const initialState = getDetectionState()
    const [isPWA, setIsPWA] = useState(initialState.isPWA)
    const [displayMode, setDisplayMode] = useState<DisplayMode>(initialState.displayMode)

    useEffect(() => {
        // Listen for display mode changes (e.g., user installs while browsing)
        const standaloneQuery = window.matchMedia('(display-mode: standalone)')
        const fullscreenQuery = window.matchMedia('(display-mode: fullscreen)')
        const handleChange = () => {
            const state = getDetectionState()
            setIsPWA(state.isPWA)
            setDisplayMode(state.displayMode)
        }

        standaloneQuery.addEventListener('change', handleChange)
        fullscreenQuery.addEventListener('change', handleChange)
        return () => {
            standaloneQuery.removeEventListener('change', handleChange)
            fullscreenQuery.removeEventListener('change', handleChange)
        }
    }, [])

    return { isPWA, displayMode, isInBrowser: !isPWA }
}

export default usePWADetection
