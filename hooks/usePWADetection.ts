'use client'

import { useState, useEffect } from 'react'

/**
 * Detects if the app is running as an installed PWA (standalone mode)
 * 
 * @returns Object with PWA detection state and display mode
 */
export function usePWADetection() {
    const [isPWA, setIsPWA] = useState(false)
    const [displayMode, setDisplayMode] = useState<'browser' | 'standalone' | 'fullscreen'>('browser')

    useEffect(() => {
        // Check various display modes
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches
        // iOS Safari specific check
        const isIOSStandalone = (window.navigator as any).standalone === true

        const detected = isStandalone || isFullscreen || isIOSStandalone

        setIsPWA(detected)
        setDisplayMode(
            isFullscreen ? 'fullscreen' :
                (isStandalone || isIOSStandalone) ? 'standalone' :
                    'browser'
        )

        // Listen for display mode changes (e.g., user installs while browsing)
        const standaloneQuery = window.matchMedia('(display-mode: standalone)')
        const handleChange = (e: MediaQueryListEvent) => {
            setIsPWA(e.matches)
            if (e.matches) setDisplayMode('standalone')
        }

        standaloneQuery.addEventListener('change', handleChange)
        return () => standaloneQuery.removeEventListener('change', handleChange)
    }, [])

    return { isPWA, displayMode, isInBrowser: !isPWA }
}

export default usePWADetection
