import { NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'
import { db } from '@/lib/firebase/admin'
import { applyRetentionMetadata } from '@/lib/privacy/retention'
import { getRetentionPolicy } from '@/lib/privacy/retention-policies'

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
        const now = new Date()
        const nowIso = now.toISOString()
        const retentionPolicy = getRetentionPolicy('fcm_tokens')
        const existing = await tokenRef.get()
        const existingData = existing.exists ? existing.data() as { createdAt?: unknown } : undefined

        await tokenRef.set(
            applyRetentionMetadata(
                {
                    token,
                    platform: 'web',
                    active: false,
                    subscriptionStatus: 'unsubscribed',
                    topics: FieldValue.arrayRemove(topic),
                    lastSeenAt: nowIso,
                    status: 'active',
                    createdAt:
                        typeof existingData?.createdAt === 'string'
                            ? existingData.createdAt
                            : nowIso,
                },
                retentionPolicy,
                now,
            ),
            { merge: true },
        )

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
