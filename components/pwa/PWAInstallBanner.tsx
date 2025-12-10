'use client'

import { useState, useEffect } from 'react'
import { usePWADetection } from '@/hooks/usePWADetection'
import { usePWAInstall, dismissPWAInstall } from '@/hooks/usePWAInstall'

// Inline SVG Icons
const XIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
)

interface PWAInstallBannerProps {
    className?: string
}

/**
 * Smart banner for PWA installation (iOS App Store style)
 * 
 * Shows a slim, dismissible banner at the top of the page.
 * Only visible when:
 * - User is not in PWA mode
 * - Install prompt is available
 * - User hasn't dismissed recently
 */
export function PWAInstallBanner({ className = '' }: PWAInstallBannerProps) {
    const { isInBrowser } = usePWADetection()
    const { isPromptReady, promptInstall, wasDismissed, isInstalled } = usePWAInstall()
    const [isDismissed, setIsDismissed] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Show banner only if conditions are met
        if (isInBrowser && isPromptReady && !wasDismissed && !isInstalled && !isDismissed) {
            // Small delay for smooth appearance
            const timer = setTimeout(() => setIsVisible(true), 500)
            return () => clearTimeout(timer)
        }
    }, [isInBrowser, isPromptReady, wasDismissed, isInstalled, isDismissed])

    const handleDismiss = () => {
        setIsVisible(false)
        setIsDismissed(true)
        dismissPWAInstall()
    }

    const handleInstall = async () => {
        const success = await promptInstall()
        if (success) {
            setIsVisible(false)
        }
    }

    if (!isVisible) return null

    return (
        <div
            className={`
        fixed top-0 left-0 right-0 z-50
        bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800
        text-white shadow-lg
        transform transition-transform duration-300 ease-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        ${className}
      `}
        >
            <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xl" role="img" aria-label="smartphone">📱</span>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
                        <span className="font-semibold text-sm whitespace-nowrap">Installa l'App</span>
                        <span className="text-xs sm:text-sm opacity-90 truncate hidden sm:inline">
                            Leggi offline • Più veloce • Esperienza nativa
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={handleInstall}
                        className="
              px-3 py-1.5 text-xs font-semibold
              bg-white text-blue-700 rounded-full
              hover:bg-blue-50 transition-colors
              whitespace-nowrap
            "
                    >
                        Installa
                    </button>

                    <button
                        onClick={handleDismiss}
                        className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Chiudi"
                    >
                        <XIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PWAInstallBanner
