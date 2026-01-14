'use client'

import { useState, useEffect, useCallback } from 'react'

const DISMISS_STORAGE_PREFIX = 'staituned-cta-dismiss-'

interface UseCTADismissReturn {
    shouldShow: boolean
    dismiss: () => void
    reset: () => void
}

/**
 * Hook to manage CTA dismiss logic with localStorage persistence
 * 
 * @param key - Unique identifier for the CTA (e.g., 'intermezzo', 'lead-magnet')
 * @param daysToHide - Number of days to hide the CTA after dismissal (default: 30)
 * @returns Object with shouldShow state and dismiss/reset functions
 * 
 * @example
 * const { shouldShow, dismiss } = useCTADismiss('intermezzo', 30)
 * 
 * if (!shouldShow) return null
 * 
 * return (
 *   <div>
 *     <button onClick={dismiss}>Not now</button>
 *   </div>
 * )
 */
export function useCTADismiss(key: string, daysToHide: number = 30): UseCTADismissReturn {
    const [shouldShow, setShouldShow] = useState(true)
    const [mounted, setMounted] = useState(false)

    const storageKey = `${DISMISS_STORAGE_PREFIX}${key}`

    // Check localStorage on mount
    useEffect(() => {
        setMounted(true)

        if (typeof window === 'undefined') return

        try {
            const dismissedAt = localStorage.getItem(storageKey)

            if (dismissedAt) {
                const dismissDate = new Date(parseInt(dismissedAt, 10))
                const now = new Date()
                const daysSinceDismiss = Math.floor(
                    (now.getTime() - dismissDate.getTime()) / (1000 * 60 * 60 * 24)
                )

                // Still hidden if within the hide period
                if (daysSinceDismiss < daysToHide) {
                    setShouldShow(false)
                } else {
                    // Clear old dismissal
                    localStorage.removeItem(storageKey)
                    setShouldShow(true)
                }
            }
        } catch {
            // localStorage not available
            setShouldShow(true)
        }
    }, [storageKey, daysToHide])

    const dismiss = useCallback(() => {
        setShouldShow(false)

        if (typeof window === 'undefined') return

        try {
            localStorage.setItem(storageKey, Date.now().toString())
        } catch {
            // localStorage not available
        }
    }, [storageKey])

    const reset = useCallback(() => {
        setShouldShow(true)

        if (typeof window === 'undefined') return

        try {
            localStorage.removeItem(storageKey)
        } catch {
            // localStorage not available
        }
    }, [storageKey])

    // Show by default during SSR to prevent hydration mismatch
    return {
        shouldShow: mounted ? shouldShow : true,
        dismiss,
        reset
    }
}
