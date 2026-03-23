import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase/admin'
import { applyRetentionMetadata } from '@/lib/privacy/retention'
import { getRetentionPolicy } from '@/lib/privacy/retention-policies'

/**
 * POST /api/notifications/register
 * 
 * Register an FCM token for push notifications.
 * Stores the token in Firestore for later use.
 */
export async function POST(request: Request) {
    try {
        const { token } = await request.json()

        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            )
        }

        const firestore = db()
        const tokenRef = firestore.collection('fcm_tokens').doc(token)
        const now = new Date()
        const nowIso = now.toISOString()
        const retentionPolicy = getRetentionPolicy('fcm_tokens')
        const existing = await tokenRef.get()
        const existingData = existing.exists ? existing.data() as { createdAt?: unknown } : undefined

        // Store token with retention metadata
        await tokenRef.set({
            ...applyRetentionMetadata(
                {
                    token,
                    platform: 'web',
                    topics: ['new-articles'],
                    active: true,
                    subscriptionStatus: 'subscribed',
                    registeredAt: nowIso,
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
        }, { merge: true })

        console.log('[FCM] Token registered:', token.substring(0, 20) + '...')

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[FCM] Error registering token:', error)
        return NextResponse.json(
            { error: 'Failed to register token' },
            { status: 500 }
        )
    }
}

/**
 * DELETE /api/notifications/register
 * 
 * Unregister an FCM token (when user revokes permission).
 */
export async function DELETE(request: Request) {
    try {
        const { token } = await request.json()

        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            )
        }

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
                    subscriptionStatus: 'unregistered',
                    topics: [],
                    status: 'active',
                    unregisteredAt: nowIso,
                    lastSeenAt: nowIso,
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

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[FCM] Error unregistering token:', error)
        return NextResponse.json(
            { error: 'Failed to unregister token' },
            { status: 500 }
        )
    }
}
