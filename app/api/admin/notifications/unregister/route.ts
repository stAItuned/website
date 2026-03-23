import { NextRequest, NextResponse } from 'next/server'
import { dbDefault } from '@/lib/firebase/admin'
import { verifyAdmin } from '@/lib/firebase/server-auth'
import { ADMIN_OPS_TOPIC } from '@/lib/notifications/adminOpsPush'
import { getMessaging } from 'firebase-admin/messaging'

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json()
    const token = typeof body?.token === 'string' ? body.token.trim() : ''
    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 })
    }

    await getMessaging().unsubscribeFromTopic([token], ADMIN_OPS_TOPIC)

    const nowIso = new Date().toISOString()
    await dbDefault()
      .collection('fcm_admin_tokens')
      .doc(token)
      .set({
        active: false,
        subscriptionStatus: 'inactive',
        topics: [],
        unregisteredAt: nowIso,
        updatedAt: nowIso,
      }, { merge: true })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[API] admin/notifications/unregister error:', error)
    return NextResponse.json({ success: false, error: 'Failed to unregister admin notification token' }, { status: 500 })
  }
}
