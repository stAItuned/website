'use client'

import { useState, useCallback } from 'react'

const DISMISS_STORAGE_PREFIX = 'staituned-cta-dismiss-'

interface UseCTADismissReturn {
    shouldShow: boolean
    dismiss: () => void
    reset: () => void
}

function getInitialShouldShow(storageKey: string, daysToHide: number): boolean {
    if (typeof window === 'undefined') return true

    try {
        const dismissedAt = localStorage.getItem(storageKey)
        if (!dismissedAt) return true

        const dismissDate = new Date(parseInt(dismissedAt, 10))
        const now = new Date()
        const daysSinceDismiss = Math.floor(
            (now.getTime() - dismissDate.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (daysSinceDismiss < daysToHide) {
            return false
        }

        localStorage.removeItem(storageKey)
        return true
    } catch {
        return true
    }
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
    const storageKey = `${DISMISS_STORAGE_PREFIX}${key}`
    const [shouldShow, setShouldShow] = useState(() => getInitialShouldShow(storageKey, daysToHide))

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

    return {
        shouldShow,
        dismiss,
        reset
    }
}
