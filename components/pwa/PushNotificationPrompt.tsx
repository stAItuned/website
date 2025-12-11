'use client'

import { useState, useEffect } from 'react'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { usePWADetection } from '@/hooks/usePWADetection'

const DISMISSED_KEY = 'push-notification-prompt-dismissed'
const DISMISS_DURATION_DAYS = 7

/**
 * Push Notification Permission Prompt
 * 
 * Shows a user-friendly prompt to enable push notifications.
 * Only visible when:
 * - Running as installed PWA
 * - Notifications are supported
 * - Permission hasn't been granted or denied
 * - Prompt hasn't been recently dismissed
 */
export function PushNotificationPrompt() {
    const { isPWA } = usePWADetection()
    const {
        isSupported,
        permission,
        isLoading,
        requestPermission,
        subscribeToTopic
    } = usePushNotifications()

    const [isVisible, setIsVisible] = useState(false)
    const [isDismissed, setIsDismissed] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    // Check if we should show the prompt
    useEffect(() => {
        if (typeof window === 'undefined') return

        // Only show in PWA mode
        if (!isPWA) return

        // Check if notifications are supported
        if (!isSupported) return

        // Don't show if already granted or denied
        if (permission === 'granted' || permission === 'denied') return

        // Check if recently dismissed
        try {
            const dismissedData = localStorage.getItem(DISMISSED_KEY)
            if (dismissedData) {
                const { timestamp } = JSON.parse(dismissedData)
                const daysSinceDismiss = (Date.now() - timestamp) / (1000 * 60 * 60 * 24)
                if (daysSinceDismiss < DISMISS_DURATION_DAYS) {
                    return
                }
            }
        } catch {
            // Ignore localStorage errors
        }

        // Show prompt after a delay (let user engage with content first)
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 5000)

        return () => clearTimeout(timer)
    }, [isPWA, isSupported, permission])

    const handleEnable = async () => {
        const granted = await requestPermission()
        if (granted) {
            // Subscribe to new articles topic
            await subscribeToTopic('new-articles')
            setShowSuccess(true)
            setTimeout(() => {
                setIsVisible(false)
            }, 2000)
        }
    }

    const handleDismiss = () => {
        setIsDismissed(true)
        try {
            localStorage.setItem(DISMISSED_KEY, JSON.stringify({ timestamp: Date.now() }))
        } catch {
            // Ignore localStorage errors
        }
        setTimeout(() => {
            setIsVisible(false)
        }, 300)
    }

    if (!isVisible || isDismissed) return null

    return (
        <div
            className={`fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-40 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
        >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
                {/* Success state */}
                {showSuccess ? (
                    <div className="p-6 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Notifications enabled!
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            You&apos;ll be notified when new articles are published.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Stay Updated</h3>
                                    <p className="text-sm text-white/80">Get notified about new articles</p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Enable notifications to be the first to know when we publish new AI tutorials and articles.
                            </p>

                            {/* Benefits */}
                            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-4">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    New article alerts
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span>
                                    Unsubscribe anytime
                                </li>
                            </ul>

                            {/* Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleEnable}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Enabling...
                                        </>
                                    ) : (
                                        'Enable Notifications'
                                    )}
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    disabled={isLoading}
                                    className="px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 font-medium rounded-xl transition-colors"
                                >
                                    Later
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default PushNotificationPrompt
