import { NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'
import { db } from '@/lib/firebase/admin'

/**
 * POST /api/notifications/subscribe
 * 
 * Subscribe a token to a topic (e.g., 'new-articles').
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

        // Validate topic name
        const validTopics = ['new-articles']
        if (!validTopics.includes(topic)) {
            return NextResponse.json(
                { error: 'Invalid topic' },
                { status: 400 }
            )
        }

        // Subscribe to FCM topic
        const messaging = getMessaging()
        await messaging.subscribeToTopic([token], topic)

        // Update Firestore
        const firestore = db()
        const tokenRef = firestore.collection('fcm_tokens').doc(token)
        await tokenRef.update({
            topics: FieldValue.arrayUnion(topic),
            updatedAt: new Date().toISOString()
        })

        console.log(`[FCM] Token subscribed to topic: ${topic}`)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[FCM] Error subscribing to topic:', error)
        return NextResponse.json(
            { error: 'Failed to subscribe to topic' },
            { status: 500 }
        )
    }
}
