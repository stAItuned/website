import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/admin'
import { sendTelegramFeedback } from '@/lib/telegram'
import { sendCareerOSWaitlistInternalEmail } from '@/lib/email/careerOSWaitlistEmail'
import { sendCareerOSWaitlistOptInEmail } from '@/lib/email/careerOSWaitlistOptInEmail'
import { careerOSTranslations, normalizeCareerOSLocale } from '@/lib/i18n/career-os-translations'
import { createWaitlistOptInToken } from '@/lib/security/waitlistDoubleOptIn'
import { applyRetentionMetadata } from '@/lib/privacy/retention'
import { getRetentionPolicy } from '@/lib/privacy/retention-policies'
import { inferEnvironmentFromHost, sendAdminOpsNotification } from '@/lib/notifications/adminOpsPush'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WAITLIST_TERMS_VERSION = '2026-02-24'
const WAITLIST_PRIVACY_VERSION = '2026-02-24'

type WaitlistIntent = {
  pricingTier?: string | null
  pricingMode?: string | null
  objective?: string | null
}

function buildDocId(email: string, intentKey: string): string {
  return Buffer.from(`${email}:${intentKey}`).toString('base64').replace(/[/+=]/g, '_')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ ok: true })
    }

    const locale = normalizeCareerOSLocale(body?.locale)
    const t = careerOSTranslations[locale].apiErrors.waitlist
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const acceptedPrivacy = Boolean(body?.acceptedPrivacy)
    const acceptedTerms = Boolean(body?.acceptedTerms)
    const marketingConsent = Boolean(body?.marketingConsent)
    const source = typeof body?.source === 'string' ? body.source : 'career_os_pricing'
    const page = typeof body?.page === 'string' ? body.page : '/career-os#pricing'
    const userAgent = body?.userAgent || req.headers.get('user-agent') || null
    const forwardedFor = req.headers.get('x-forwarded-for') || ''
    const ipAddress = forwardedFor.split(',')[0]?.trim() || null
    const intent = (body?.intent || {}) as WaitlistIntent
    const pricingTier = intent.pricingTier?.trim() || null
    const pricingMode = intent.pricingMode?.trim() || null
    const objective = intent.objective?.trim() || null

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: t.invalidEmail }, { status: 400 })
    }
    if (!acceptedPrivacy) {
      return NextResponse.json({ error: t.privacyRequired }, { status: 400 })
    }
    if (!acceptedTerms) {
      return NextResponse.json({ error: t.termsRequired }, { status: 400 })
    }
    if (!pricingTier || !pricingMode) {
      return NextResponse.json({ error: t.intentRequired }, { status: 400 })
    }

    const intentKey = `${pricingMode}:${pricingTier}`
    const nowIso = new Date().toISOString()
    const retentionPolicy = getRetentionPolicy('career_os_waitlist')
    const requestedMarketingConsent = marketingConsent
    const marketingConsentStatus = requestedMarketingConsent ? 'pending_confirmation' : 'not_requested'
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')
    let marketingOptInEmailSent = false

    const waitlistRef = db().collection('career_os_waitlist').doc(buildDocId(email, intentKey))
    const basePayload = {
        email,
        intent: {
          pricingTier,
          pricingMode,
          objective,
          key: intentKey,
        },
        acceptedPrivacy: true,
        acceptedTerms: true,
        marketingConsent: false,
        requestedMarketingConsent,
        marketingConsentStatus,
        source,
        page,
        userAgent,
        ipAddress,
        consent: {
          privacy: {
            accepted: true,
            acceptedAt: nowIso,
            version: WAITLIST_PRIVACY_VERSION,
          },
          terms: {
            accepted: true,
            acceptedAt: nowIso,
            version: WAITLIST_TERMS_VERSION,
          },
          marketing: {
            requested: requestedMarketingConsent,
            confirmed: false,
            confirmedAt: null,
          },
        },
        termsVersion: WAITLIST_TERMS_VERSION,
        privacyVersion: WAITLIST_PRIVACY_VERSION,
    }

    await waitlistRef.set(
      applyRetentionMetadata(basePayload, retentionPolicy, new Date(nowIso)),
      { merge: true },
    )

    try {
      await sendAdminOpsNotification({
        eventType: 'career_os_waitlist_submitted',
        entityId: waitlistRef.id,
        source: '/api/career-os/waitlist',
        createdAt: nowIso,
        locale,
        environment: inferEnvironmentFromHost(req.headers.get('host')),
      })
    } catch (pushError) {
      console.error('[Career OS Waitlist] admin push error:', pushError)
    }

    if (requestedMarketingConsent) {
      const token = createWaitlistOptInToken({
        email,
        intentKey,
        locale,
      })
      if (token) {
        const confirmationUrl = `${siteUrl}/api/career-os/waitlist/confirm?token=${encodeURIComponent(token)}`
        marketingOptInEmailSent = await sendCareerOSWaitlistOptInEmail({
          email,
          locale,
          confirmationUrl,
        })
      }
    }

    await sendTelegramFeedback({
      category: 'career_os_waitlist',
      message: [
        locale === 'en' ? '📥 New Career OS waitlist lead (metadata-only)' : '📥 Nuovo lead waitlist Career OS (metadata-only)',
        '',
        `🆔 Submission: ${waitlistRef.id}`,
        `🎯 Tier: ${pricingTier}`,
        `🧩 Mode: ${pricingMode}`,
        objective ? `🚀 Objective: ${objective}` : '',
        `📬 Marketing consent requested: ${requestedMarketingConsent ? (locale === 'en' ? 'Yes' : 'Sì') : 'No'}`,
        requestedMarketingConsent ? `✉️ Double opt-in email sent: ${marketingOptInEmailSent ? 'Yes' : 'No'}` : '',
        `📍 Source: ${source}`,
        `🕒 CreatedAt: ${nowIso}`,
        '🔐 Open Admin dashboard for full details.',
      ]
        .filter(Boolean)
        .join('\n'),
      page,
    })

    const emailSent = await sendCareerOSWaitlistInternalEmail({
      email,
      locale,
      intent: intentKey,
      pricingTier,
      pricingMode,
      objective: objective || undefined,
      acceptedPrivacy: true,
      marketingConsent: false,
      marketingConsentStatus,
      acceptedTerms: true,
      source,
      page,
    })

    if (!emailSent) {
      console.error('[Career OS Waitlist] Internal notification email failed')
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('Career OS waitlist error:', error)
    return NextResponse.json({ error: careerOSTranslations.it.apiErrors.waitlist.serverError }, { status: 500 })
  }
}
