import { NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'
import { db } from '@/lib/firebase/admin'

/**
 * POST /api/notifications/unsubscribe
 * 
 * Unsubscribe a token from a topic.
 */
export async function POST(request: Request) {
    try {
        const { token, topic } = await request.json()

        if (!token || !topic) {
            return NextResponse.json(
                { error: 'Token and topic are required' },
                { status: 400 }
            )
        }

        // Unsubscribe from FCM topic
        const messaging = getMessaging()
        await messaging.unsubscribeFromTopic([token], topic)

        // Update Firestore
        const firestore = db()
        const tokenRef = firestore.collection('fcm_tokens').doc(token)
        await tokenRef.update({
            topics: FieldValue.arrayRemove(topic),
            updatedAt: new Date().toISOString()
        })

        console.log(`[FCM] Token unsubscribed from topic: ${topic}`)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[FCM] Error unsubscribing from topic:', error)
        return NextResponse.json(
            { error: 'Failed to unsubscribe from topic' },
            { status: 500 }
        )
    }
}
