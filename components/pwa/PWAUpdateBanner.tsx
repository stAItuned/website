'use client'

import { useState, useEffect, useCallback } from 'react'
import { LEARN_SW_EVENTS, skipWaitingAndReload } from '@/components/LearnServiceWorkerRegister'

/**
 * PWAUpdateBanner - Shows when a new version of the PWA is available
 * 
 * Appears at the bottom of the screen with option to update now or dismiss.
 * Uses the service worker's skip waiting mechanism to activate the new version.
 */
export function PWAUpdateBanner() {
    const [showBanner, setShowBanner] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        const handleUpdate = () => {
            setShowBanner(true)
        }

        window.addEventListener(LEARN_SW_EVENTS.UPDATE_AVAILABLE, handleUpdate)

        return () => {
            window.removeEventListener(LEARN_SW_EVENTS.UPDATE_AVAILABLE, handleUpdate)
        }
    }, [])

    const handleUpdateNow = useCallback(() => {
        setIsUpdating(true)
        skipWaitingAndReload()
    }, [])

    const handleDismiss = useCallback(() => {
        setShowBanner(false)
    }, [])

    if (!showBanner) return null

    return (
        <div
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
            role="alert"
            aria-live="polite"
        >
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                {/* Progress bar when updating */}
                {isUpdating && (
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-primary-500 animate-pulse" />
                )}

                <div className="p-4">
                    <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-primary-600 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                Update Available
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                A new version is ready with improvements and fixes.
                            </p>
                        </div>

                        {/* Dismiss button */}
                        <button
                            onClick={handleDismiss}
                            className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            aria-label="Dismiss update notification"
                            disabled={isUpdating}
                        >
                            <svg
                                className="w-4 h-4 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={handleUpdateNow}
                            disabled={isUpdating}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-primary-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isUpdating ? (
                                <>
                                    <svg
                                        className="w-4 h-4 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Updating...
                                </>
                            ) : (
                                'Update Now'
                            )}
                        </button>
                        <button
                            onClick={handleDismiss}
                            disabled={isUpdating}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PWAUpdateBanner
