import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyAuth, getAdminDb } from '@/lib/firebase/server-auth'
import { isAdmin } from '@/lib/firebase/admin-emails'
import { BADGE_DEFINITIONS } from '@/lib/config/badge-config'
import { getAuthorData } from '@/lib/authors'
import { sendBadgeAwardEmail } from '@/lib/email/badgeAwardEmail'
import { badgeEmailSendSchema } from '@/lib/validation/badgeEmail'
import type { AuthorBadge } from '@/lib/types/badge'

export const dynamic = 'force-dynamic'

const pendingQueryLimit = 200

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    if (!isAdmin(user.email)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const db = getAdminDb()
    const snapshot = await db
      .collectionGroup('earned')
      .where('emailStatus', '==', 'pending')
      .limit(pendingQueryLimit)
      .get()

    const items = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const badge = doc.data() as AuthorBadge
        const authorSlug = badge.authorId || doc.ref.parent.parent?.id || 'unknown'
        const badgeDef = BADGE_DEFINITIONS.find((def) => def.id === badge.badgeId)
        const authorData = await getAuthorData(authorSlug)

        return {
          authorSlug,
          authorName: authorData?.name || authorSlug.replaceAll('-', ' '),
          authorEmail: authorData?.email || '',
          badgeId: badge.badgeId,
          badgeName: badgeDef?.name.en || badge.badgeId,
          badgeTier: badgeDef?.tier || 'contributor',
          credentialId: badge.credentialId,
          earnedAt: badge.earnedAt,
          emailStatus: badge.emailStatus || 'pending',
          emailSentAt: badge.emailSentAt || null,
          emailLastError: badge.emailLastError || null,
        }
      })
    )

    return NextResponse.json({ success: true, items })
  } catch (error) {
    console.error('[API] admin/badge-emails GET error:', error)
    const details = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch badge emails', details },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    if (!isAdmin(user.email)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = badgeEmailSendSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { authorSlug, badgeId } = parsed.data
    const db = getAdminDb()
    const badgeRef = db.collection('badges').doc(authorSlug).collection('earned').doc(badgeId)
    const badgeSnap = await badgeRef.get()

    if (!badgeSnap.exists) {
      return NextResponse.json({ success: false, error: 'Badge not found' }, { status: 404 })
    }

    const badge = badgeSnap.data() as AuthorBadge

    if (badge.emailStatus === 'sent') {
      return NextResponse.json({ success: false, error: 'Email already sent' }, { status: 409 })
    }

    const badgeDef = BADGE_DEFINITIONS.find((def) => def.id === badge.badgeId)
    if (!badgeDef) {
      await badgeRef.update({
        emailStatus: 'pending',
        emailLastError: 'Badge definition not found',
      })
      return NextResponse.json({ success: false, error: 'Badge definition missing' }, { status: 400 })
    }

    const authorData = await getAuthorData(authorSlug)
    if (!authorData?.email) {
      await badgeRef.update({
        emailStatus: 'pending',
        emailLastError: 'Missing author email',
      })
      return NextResponse.json({ success: false, error: 'Author email missing' }, { status: 400 })
    }

    const sent = await sendBadgeAwardEmail({
      email: authorData.email,
      name: authorData.name,
      badge: badgeDef,
      credentialId: badge.credentialId,
      earnedAt: badge.earnedAt,
      articleMetrics: badge.metrics.articleMetrics,
    })

    const now = new Date().toISOString()
    if (sent) {
      await badgeRef.update({
        emailStatus: 'sent',
        emailSentAt: now,
        emailApprovedAt: now,
        emailApprovedBy: user.email || 'admin',
        emailLastError: '',
      })

      return NextResponse.json({ success: true })
    }

    await badgeRef.update({
      emailStatus: 'pending',
      emailLastError: 'Resend error',
    })

    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 })
  } catch (error) {
    console.error('[API] admin/badge-emails POST error:', error)
    const message = error instanceof z.ZodError ? 'Invalid payload' : 'Failed to send badge email'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
