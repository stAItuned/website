'use client'

/**
 * useHaptics - Haptic feedback hook for mobile interactions
 * Provides tactile feedback on supported devices using the Vibration API
 */
export function useHaptics() {
    const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator

    const vibrate = (pattern: number | number[]) => {
        if (isSupported) {
            try {
                navigator.vibrate(pattern)
            } catch (e) {
                // Silently fail on unsupported devices
            }
        }
    }

    return {
        isSupported,
        /** Light tap feedback (10ms) */
        light: () => vibrate(10),
        /** Medium feedback (25ms) */
        medium: () => vibrate(25),
        /** Success feedback pattern */
        success: () => vibrate([10, 50, 10]),
        /** Error feedback pattern */
        error: () => vibrate([20, 30, 20, 30, 20]),
        /** Custom vibration pattern */
        custom: vibrate
    }
}
