'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { usePWADetection } from '@/hooks/usePWADetection'

/**
 * Inline SVG Icons
 */
const BookOpenIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
)

const XIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
)

const DISMISS_KEY = 'pwa-learn-nav-dismissed'
const DISMISS_DURATION = 24 * 60 * 60 * 1000 // 24 hours

interface PWALearnNavigatorProps {
    className?: string
}

/**
 * Floating navigation button for PWA users on non-learn pages
 * 
 * Shows a subtle floating button that allows users to quickly
 * return to the /learn section when they navigate to other pages
 * (home, aziende, etc.) within the installed PWA.
 * 
 * Only visible when:
 * - User is in PWA mode (standalone)
 * - Current path is NOT /learn or /learn/*
 * - User hasn't dismissed it recently
 */
export function PWALearnNavigator({ className = '' }: PWALearnNavigatorProps) {
    const { isPWA } = usePWADetection()
    const pathname = usePathname()
    const [isDismissed, setIsDismissed] = useState(() => {
        if (typeof window === 'undefined') return true
        const dismissedAt = localStorage.getItem(DISMISS_KEY)
        if (!dismissedAt) return false
        const dismissedTime = parseInt(dismissedAt, 10)
        return Date.now() - dismissedTime < DISMISS_DURATION
    })

    // Check if we're on a learn page
    const isLearnPage = pathname === '/learn' || pathname === '/learn/articles' || pathname.startsWith('/learn/')

    const isVisible = isPWA && !isLearnPage && !isDismissed

    const handleDismiss = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDismissed(true)
        localStorage.setItem(DISMISS_KEY, Date.now().toString())
    }

    // Don't render if not in PWA or on learn page
    if (!isPWA || isLearnPage) return null

    return (
        <div
            className={`
                fixed bottom-20 right-4 z-50
                transform transition-all duration-300 ease-out
                ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}
                ${className}
            `}
        >
            {/* Floating pill button */}
            <Link
                href="/learn/articles"
                className="
                    group flex items-center gap-2
                    pl-4 pr-3 py-2.5
                    bg-gradient-to-r from-blue-600 to-blue-700 
                    dark:from-blue-600 dark:to-blue-800
                    text-white text-sm font-medium
                    rounded-full shadow-lg
                    hover:shadow-xl hover:scale-105
                    active:scale-95
                    transition-all duration-200
                    border border-white/10
                "
                style={{
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.35)'
                }}
            >
                <BookOpenIcon />
                <span className="whitespace-nowrap">Torna a Learn</span>

                {/* Dismiss button */}
                <button
                    onClick={handleDismiss}
                    className="
                        ml-1 p-1 
                        hover:bg-white/20 rounded-full 
                        transition-colors
                        opacity-60 hover:opacity-100
                    "
                    aria-label="Nascondi"
                >
                    <XIcon />
                </button>
            </Link>

            {/* Subtle pulse animation */}
            <div
                className="
                    absolute inset-0 rounded-full 
                    bg-blue-500/30 -z-10
                    animate-ping
                "
                style={{ animationDuration: '2s', animationIterationCount: '3' }}
            />
        </div>
    )
}

export default PWALearnNavigator
