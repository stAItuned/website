'use client'

import { useMemo } from 'react'

interface TimeRemainingIndicatorProps {
    readingTime: number // Total reading time in minutes
    scrollPercent: number // Current scroll percentage (0-100)
    className?: string
}

/**
 * TimeRemainingIndicator - Shows estimated time left to read the article
 * Dynamically updates based on scroll position
 */
export function TimeRemainingIndicator({
    readingTime,
    scrollPercent,
    className = ''
}: TimeRemainingIndicatorProps) {
    const timeRemaining = useMemo(() => {
        const percentLeft = Math.max(0, 100 - scrollPercent)
        const minutesLeft = (readingTime * percentLeft) / 100
        return Math.ceil(minutesLeft)
    }, [readingTime, scrollPercent])

    // Don't show when article is almost complete
    if (scrollPercent >= 95) {
        return (
            <div className={`flex items-center gap-1.5 text-green-600 dark:text-green-400 ${className}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Complete!</span>
            </div>
        )
    }

    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
            <span>
                ~{timeRemaining} min left
            </span>
        </div>
    )
}
