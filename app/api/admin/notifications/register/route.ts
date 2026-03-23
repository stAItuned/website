import { NextRequest, NextResponse } from 'next/server'
import { getMessaging } from 'firebase-admin/messaging'
import { applyRetentionMetadata } from '@/lib/privacy/retention'
import { getRetentionPolicy } from '@/lib/privacy/retention-policies'
import { dbDefault } from '@/lib/firebase/admin'
import { verifyAdmin } from '@/lib/firebase/server-auth'
import { ADMIN_OPS_TOPIC, inferEnvironmentFromHost } from '@/lib/notifications/adminOpsPush'

const ALLOWED_TOPICS = new Set([ADMIN_OPS_TOPIC])

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
  }
  if (!auth.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const token = typeof body?.token === 'string' ? body.token.trim() : ''
    const topic = typeof body?.topic === 'string' ? body.topic.trim() : ADMIN_OPS_TOPIC

    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 })
    }
    if (!ALLOWED_TOPICS.has(topic)) {
      return NextResponse.json({ success: false, error: 'Invalid topic' }, { status: 400 })
    }

    await getMessaging().subscribeToTopic([token], topic)

    const now = new Date()
    const nowIso = now.toISOString()
    const retentionPolicy = getRetentionPolicy('fcm_admin_tokens')
    const host = request.headers.get('host')
    const environment = inferEnvironmentFromHost(host)
    const email = typeof auth.user.email === 'string' ? auth.user.email.toLowerCase() : null

    const basePayload = {
      token,
      active: true,
      platform: 'web',
      environment,
      lastSeenAt: nowIso,
      registeredByEmail: email,
      registeredByUid: auth.user.uid,
      topics: [topic],
      status: 'active',
    }

    await dbDefault()
      .collection('fcm_admin_tokens')
      .doc(token)
      .set(
        applyRetentionMetadata(basePayload, retentionPolicy, now),
        { merge: true },
      )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[API] admin/notifications/register error:', error)
    return NextResponse.json({ success: false, error: 'Failed to register admin notification token' }, { status: 500 })
  }
}
