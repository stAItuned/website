'use client'

import { useEffect, useState } from 'react'

interface ContinueReadingPromptProps {
    show: boolean
    scrollPercent: number
    onContinue: () => void
    onDismiss: () => void
}

/**
 * ContinueReadingPrompt - Toast prompt to continue reading from saved position
 */
export function ContinueReadingPrompt({
    show,
    scrollPercent,
    onContinue,
    onDismiss
}: ContinueReadingPromptProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isLeaving, setIsLeaving] = useState(false)

    useEffect(() => {
        if (show) {
            // Delay appearance for smoother UX
            const timer = setTimeout(() => setIsVisible(true), 500)
            return () => clearTimeout(timer)
        }
    }, [show])

    const handleDismiss = () => {
        setIsLeaving(true)
        setTimeout(() => {
            setIsVisible(false)
            setIsLeaving(false)
            onDismiss()
        }, 300)
    }

    const handleContinue = () => {
        setIsLeaving(true)
        setTimeout(() => {
            setIsVisible(false)
            setIsLeaving(false)
            onContinue()
        }, 300)
    }

    if (!show || !isVisible) return null

    return (
        <div
            className={`fixed bottom-24 left-4 right-4 z-40 max-w-md mx-auto transition-all duration-300 ${isLeaving ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
        >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-4 backdrop-blur-xl">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-primary-600 dark:text-primary-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                            Continue Reading?
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                            You were {Math.round(scrollPercent)}% through this article
                        </p>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Dismiss"
                    >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                    <button
                        onClick={handleDismiss}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        Start Over
                    </button>
                    <button
                        onClick={handleContinue}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    )
}
