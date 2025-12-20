'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const STORAGE_KEY = 'staituned_urgency_bar_dismissed'

/**
 * HomeUrgencyBar - Micro-urgency top bar
 * Shows scarcity message with limited pilot slots.
 * Can be dismissed (persisted in localStorage).
 */
export function HomeUrgencyBar() {
    const [isDismissed, setIsDismissed] = useState(true) // Start hidden to prevent flash

    useEffect(() => {
        // Check localStorage on mount
        const dismissed = localStorage.getItem(STORAGE_KEY)
        if (dismissed !== 'true') {
            setIsDismissed(false)
        }
    }, [])

    // Add/remove class on html element to allow header to offset itself
    useEffect(() => {
        if (!isDismissed) {
            document.documentElement.classList.add('urgency-bar-visible')
        } else {
            document.documentElement.classList.remove('urgency-bar-visible')
        }
        return () => {
            document.documentElement.classList.remove('urgency-bar-visible')
        }
    }, [isDismissed])

    const handleDismiss = () => {
        setIsDismissed(true)
        localStorage.setItem(STORAGE_KEY, 'true')
    }

    if (isDismissed) return null

    // Dynamic next month
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    const nextMonthFull = nextMonth.toLocaleString('it-IT', { month: 'long', year: 'numeric' })
    const capitalizedMonth = nextMonthFull.charAt(0).toUpperCase() + nextMonthFull.slice(1)
    const nextMonthShort = nextMonth.toLocaleString('it-IT', { month: 'short', year: 'numeric' })
    const capitalizedMonthShort = nextMonthShort.charAt(0).toUpperCase() + nextMonthShort.slice(1)

    return (
        <>
            {/* Fixed urgency bar at the very top, above header */}
            <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50">
                <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-2">
                    <div className="flex items-center justify-center gap-3 sm:gap-4 text-center pr-8">
                        {/* Urgency indicator */}
                        <span className="hidden sm:inline-flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                                Limited
                            </span>
                        </span>

                        {/* Message */}
                        <p className="text-xs sm:text-sm text-slate-200 leading-snug">
                            <span className="hidden sm:inline">
                                <strong className="text-white">2 Pilot/mese</strong>.{' '}
                                <span className="text-amber-300">Assessment parte subito. Se c&apos;è fit, blocchi il prossimo slot.</span>
                            </span>
                            <span className="sm:hidden">
                                <strong className="text-white">2 Pilot/mese</strong> · Assessment subito
                            </span>
                        </p>

                        {/* CTA */}
                        <Link
                            href="/aziende#mini-call"
                            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 text-slate-900 text-[11px] sm:text-xs font-semibold shadow-sm hover:bg-amber-300 transition-colors"
                        >
                            <span>Prenota 15 min</span>
                            <span className="hidden sm:inline">↗</span>
                        </Link>

                        {/* Dismiss button */}
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white transition-colors"
                            aria-label="Chiudi"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            {/* Spacer to push header and content down */}
            <div className="h-10 sm:h-9" />
        </>
    )
}
