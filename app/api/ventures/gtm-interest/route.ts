import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/admin'
import { sendTelegramFeedback } from '@/lib/telegram'
import { applyRetentionMetadata } from '@/lib/privacy/retention'
import { getRetentionPolicy } from '@/lib/privacy/retention-policies'
import { inferEnvironmentFromHost, sendAdminOpsNotification } from '@/lib/notifications/adminOpsPush'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ ok: true })
    }

    const {
      name,
      email,
      profileUrl,
      experience,
      acceptedPrivacy,
      source,
      page,
      userAgent,
      locale,
    } = body || {}

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    if (!experience || typeof experience !== 'string' || !experience.trim()) {
      return NextResponse.json({ error: 'Experience is required' }, { status: 400 })
    }

    if (!acceptedPrivacy) {
      return NextResponse.json({ error: 'Privacy acceptance is required' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const nowIso = new Date().toISOString()
    const retentionPolicy = getRetentionPolicy('contact_requests')
    let submissionId: string | null = null

    try {
      const created = await db().collection('contact_requests').add(
        applyRetentionMetadata(
          {
            requestType: 'ventures_founding_gtm',
            name: name.trim(),
            email: normalizedEmail,
            profileUrl: typeof profileUrl === 'string' && profileUrl.trim() ? profileUrl.trim() : null,
            experience: experience.trim(),
            consent: true,
            marketingConsent: false,
            source: source || 'ventures_founding_gtm',
            page: page || '/ventures',
            locale: typeof locale === 'string' ? locale : null,
            userAgent: userAgent || req.headers.get('user-agent') || null,
          },
          retentionPolicy,
          new Date(nowIso),
        ),
      )

      submissionId = typeof created?.id === 'string' ? created.id : null
    } catch (dbError) {
      console.error('VENTURES GTM FIREBASE SAVE ERROR:', dbError)
      return NextResponse.json({ error: 'Unable to save request' }, { status: 500 })
    }

    try {
      await sendAdminOpsNotification({
        eventType: 'ventures_gtm_submitted',
        entityId: submissionId || 'not_persisted',
        source: '/api/ventures/gtm-interest',
        createdAt: nowIso,
        locale: typeof locale === 'string' ? locale : undefined,
        environment: inferEnvironmentFromHost(req.headers.get('host')),
      })
    } catch (pushError) {
      console.error('ADMIN PUSH ERROR (ventures/gtm-interest):', pushError)
    }

    await sendTelegramFeedback({
      category: 'ventures_gtm_interest',
      message: [
        '🆕 New Ventures GTM interest (metadata-only)',
        '',
        `🆔 Submission: ${submissionId || 'not_persisted'}`,
        `🕒 CreatedAt: ${nowIso}`,
        '🔐 Open Admin / Firestore for full details.',
      ].join('\n'),
      page: page || '/ventures',
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('Ventures GTM interest error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
