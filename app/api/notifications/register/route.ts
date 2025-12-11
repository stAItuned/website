import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import { db } from '@/lib/firebase/admin'

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

        // Store token with metadata
        await tokenRef.set({
            token,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            platform: 'web',
            topics: ['new-articles'], // Default subscription
            active: true
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

        // Mark as inactive instead of deleting (for analytics)
        await tokenRef.update({
            active: false,
            unregisteredAt: new Date().toISOString()
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('[FCM] Error unregistering token:', error)
        return NextResponse.json(
            { error: 'Failed to unregister token' },
            { status: 500 }
        )
    }
}
