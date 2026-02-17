'use client'

import { useState, useEffect, useCallback } from 'react'
import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging'
import { app } from '@/lib/firebase/client'

// VAPID key from Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY

// Local storage keys
const TOKEN_KEY = 'fcm-token'
const PERMISSION_ASKED_KEY = 'fcm-permission-asked'
const SUBSCRIBED_TOPICS_KEY = 'fcm-subscribed-topics'

export interface PushNotificationState {
    /** Whether notifications are supported */
    isSupported: boolean
    /** Current permission status */
    permission: NotificationPermission | 'unsupported'
    /** Whether we have a valid FCM token */
    hasToken: boolean
    /** Whether we've asked for permission before */
    wasAsked: boolean
    /** Loading state */
    isLoading: boolean
    /** Error message if any */
    error: string | null
    /** Request notification permission */
    requestPermission: () => Promise<boolean>
    /** Subscribe to a topic (e.g., 'new-articles') */
    subscribeToTopic: (topic: string) => Promise<boolean>
    /** Unsubscribe from a topic */
    unsubscribeFromTopic: (topic: string) => Promise<boolean>
    /** Get subscribed topics */
    subscribedTopics: string[]
}

/**
 * Hook to manage FCM push notifications
 * 
 * Usage:
 * ```tsx
 * const { permission, requestPermission, subscribeToTopic } = usePushNotifications()
 * 
 * // Request permission
 * const granted = await requestPermission()
 * if (granted) {
 *   await subscribeToTopic('new-articles')
 * }
 * ```
 */
export function usePushNotifications(): PushNotificationState {
    const [isSupported, setIsSupported] = useState(false)
    const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('unsupported')
    const [hasToken, setHasToken] = useState(false)
    const [wasAsked, setWasAsked] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [subscribedTopics, setSubscribedTopics] = useState<string[]>([])
    const [messaging, setMessaging] = useState<Messaging | null>(null)

    // Initialize FCM messaging
    const initializeMessaging = useCallback(async () => {
        if (!isSupported || typeof window === 'undefined') return null

        try {
            // Register the FCM service worker
            const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
            console.log('[FCM] Service worker registered:', registration.scope)

            const msg = getMessaging(app)
            setMessaging(msg)

            // Set up foreground message handler
            onMessage(msg, (payload) => {
                console.log('[FCM] Foreground message:', payload)

                // Show notification manually for foreground messages
                if (Notification.permission === 'granted' && payload.notification) {
                    new Notification(payload.notification.title || 'stAItuned Learn', {
                        body: payload.notification.body,
                        icon: '/icon-192.png',
                        tag: 'staituned-foreground',
                        data: payload.data
                    })
                }
            })

            return msg
        } catch (err) {
            console.error('[FCM] Failed to initialize messaging:', err)
            return null
        }
    }, [isSupported])

    // Check support and current permission on mount
    useEffect(() => {
        if (typeof window === 'undefined') return

        // Check if notifications are supported
        const supported = 'Notification' in window && 'serviceWorker' in navigator
        setIsSupported(supported)

        if (!supported) {
            setPermission('unsupported')
            return
        }

        // Get current permission
        setPermission(Notification.permission)

        // Check if we've asked before
        const asked = localStorage.getItem(PERMISSION_ASKED_KEY) === 'true'
        setWasAsked(asked)

        // Check for existing token
        const existingToken = localStorage.getItem(TOKEN_KEY)
        setHasToken(!!existingToken)

        // Load subscribed topics
        try {
            const topics = JSON.parse(localStorage.getItem(SUBSCRIBED_TOPICS_KEY) || '[]')
            setSubscribedTopics(topics)
        } catch {
            setSubscribedTopics([])
        }

        // Initialize messaging if permission granted
        if (Notification.permission === 'granted') {
            void initializeMessaging()
        }
    }, [initializeMessaging])

    // Request permission and get token
    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (!isSupported) {
            setError('Notifications not supported on this device')
            return false
        }

        setIsLoading(true)
        setError(null)

        try {
            // Mark that we've asked
            localStorage.setItem(PERMISSION_ASKED_KEY, 'true')
            setWasAsked(true)

            // Request permission
            const result = await Notification.requestPermission()
            setPermission(result)

            if (result !== 'granted') {
                setError('Permission denied')
                setIsLoading(false)
                return false
            }

            // Initialize messaging
            let msg = messaging
            if (!msg) {
                msg = await initializeMessaging()
            }

            if (!msg) {
                setError('Failed to initialize messaging')
                setIsLoading(false)
                return false
            }

            // Get FCM token
            if (!VAPID_KEY) {
                console.error('[FCM] VAPID key not configured')
                setError('Push notifications not configured')
                setIsLoading(false)
                return false
            }

            const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')
            const token = await getToken(msg, {
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: registration
            })

            if (token) {
                console.log('[FCM] Token obtained:', token.substring(0, 20) + '...')
                localStorage.setItem(TOKEN_KEY, token)
                setHasToken(true)

                // Save token to backend
                await saveTokenToBackend(token)

                setIsLoading(false)
                return true
            } else {
                setError('Failed to get notification token')
                setIsLoading(false)
                return false
            }
        } catch (err) {
            console.error('[FCM] Error requesting permission:', err)
            setError('Failed to enable notifications')
            setIsLoading(false)
            return false
        }
    }, [isSupported, messaging, initializeMessaging])

    // Subscribe to a topic
    const subscribeToTopic = useCallback(async (topic: string): Promise<boolean> => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (!token) {
            setError('No notification token')
            return false
        }

        try {
            const response = await fetch('/api/notifications/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, topic })
            })

            if (!response.ok) {
                throw new Error('Failed to subscribe')
            }

            // Update local state
            const newTopics = [...subscribedTopics, topic]
            setSubscribedTopics(newTopics)
            localStorage.setItem(SUBSCRIBED_TOPICS_KEY, JSON.stringify(newTopics))

            return true
        } catch (err) {
            console.error('[FCM] Subscribe error:', err)
            setError('Failed to subscribe to topic')
            return false
        }
    }, [subscribedTopics])

    // Unsubscribe from a topic
    const unsubscribeFromTopic = useCallback(async (topic: string): Promise<boolean> => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (!token) return false

        try {
            const response = await fetch('/api/notifications/unsubscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, topic })
            })

            if (!response.ok) {
                throw new Error('Failed to unsubscribe')
            }

            // Update local state
            const newTopics = subscribedTopics.filter(t => t !== topic)
            setSubscribedTopics(newTopics)
            localStorage.setItem(SUBSCRIBED_TOPICS_KEY, JSON.stringify(newTopics))

            return true
        } catch (err) {
            console.error('[FCM] Unsubscribe error:', err)
            return false
        }
    }, [subscribedTopics])

    return {
        isSupported,
        permission,
        hasToken,
        wasAsked,
        isLoading,
        error,
        requestPermission,
        subscribeToTopic,
        unsubscribeFromTopic,
        subscribedTopics
    }
}

// Save token to backend
async function saveTokenToBackend(token: string): Promise<void> {
    try {
        await fetch('/api/notifications/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
        })
    } catch (err) {
        console.error('[FCM] Failed to save token:', err)
    }
}

export default usePushNotifications
