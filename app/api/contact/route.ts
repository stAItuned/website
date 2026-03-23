import { sendTelegramFeedback } from '@/lib/telegram'
import { db } from '@/lib/firebase/admin'
import { applyRetentionMetadata } from '@/lib/privacy/retention'
import { getRetentionPolicy } from '@/lib/privacy/retention-policies'
import { inferEnvironmentFromHost, sendAdminOpsNotification } from '@/lib/notifications/adminOpsPush'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Basic validation + honeypot
    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      // bot detected (honeypot filled) – pretend ok
      return NextResponse.json({ ok: true })
    }

    const { name, email, company, message, page, userAgent, consent, marketingConsent } = body || {}
    const nowIso = new Date().toISOString()
    let submissionId: string | null = null

    if (!message || typeof message !== 'string' || message.trim().length < 3) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }
    if (!consent) {
      return NextResponse.json({ error: 'Consent required' }, { status: 400 })
    }

    try {
      const retentionPolicy = getRetentionPolicy('contact_requests')
      const created = await db().collection('contact_requests').add(
        applyRetentionMetadata(
          {
            name: typeof name === 'string' && name.trim() ? name.trim() : null,
            email: typeof email === 'string' && email.trim() ? email.trim().toLowerCase() : null,
            company: typeof company === 'string' && company.trim() ? company.trim() : null,
            message: message.trim(),
            consent: true,
            marketingConsent: Boolean(marketingConsent),
            page: page || '/?source=contact-modal',
            userAgent: userAgent || req.headers.get('user-agent') || null,
          },
          retentionPolicy,
          new Date(nowIso),
        ),
      )
      submissionId = typeof created?.id === 'string' ? created.id : null
    } catch (dbError) {
      console.error('CONTACT FIREBASE SAVE ERROR:', dbError)
    }

    try {
      await sendAdminOpsNotification({
        eventType: 'contact_submitted',
        entityId: submissionId || 'not_persisted',
        source: '/api/contact',
        createdAt: nowIso,
        environment: inferEnvironmentFromHost(req.headers.get('host')),
      })
    } catch (pushError) {
      console.error('ADMIN PUSH ERROR (contact):', pushError)
    }

    await sendTelegramFeedback({
      category: 'contact',
      message: [
        '🆕 New Contact request (metadata-only)',
        '',
        `🆔 Submission: ${submissionId || 'not_persisted'}`,
        `📣 Marketing consent: ${marketingConsent ? 'yes' : 'no'}`,
        `🕒 CreatedAt: ${nowIso}`,
        '🔐 Open Admin dashboard for full details.',
      ].join('\n'),
      page: page || '/?source=contact-modal',
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
