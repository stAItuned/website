import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { getMessaging } from 'firebase-admin/messaging'
import { dbDefault } from '@/lib/firebase/admin'
import { verifyAdmin } from '@/lib/firebase/server-auth'
import { ADMIN_OPS_TOPIC } from '@/lib/notifications/adminOpsPush'

const ALLOWED_TOPICS = new Set([ADMIN_OPS_TOPIC])

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json()
    const token = typeof body?.token === 'string' ? body.token.trim() : ''
    const topic = typeof body?.topic === 'string' ? body.topic.trim() : ''

    if (!token || !topic) {
      return NextResponse.json({ success: false, error: 'Token and topic are required' }, { status: 400 })
    }
    if (!ALLOWED_TOPICS.has(topic)) {
      return NextResponse.json({ success: false, error: 'Invalid topic' }, { status: 400 })
    }

    await getMessaging().subscribeToTopic([token], topic)

    await dbDefault()
      .collection('fcm_admin_tokens')
      .doc(token)
      .set({
        active: true,
        subscriptionStatus: 'active',
        topics: FieldValue.arrayUnion(topic),
        updatedAt: new Date().toISOString(),
      }, { merge: true })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[API] admin/notifications/subscribe error:', error)
    return NextResponse.json({ success: false, error: 'Failed to subscribe admin notification token' }, { status: 500 })
  }
}
