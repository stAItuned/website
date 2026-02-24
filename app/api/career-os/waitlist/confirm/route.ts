import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/admin'
import { verifyWaitlistOptInToken } from '@/lib/security/waitlistDoubleOptIn'

function buildRedirect(baseUrl: string, locale: 'it' | 'en', status: 'confirmed' | 'invalid') {
  const path = status === 'confirmed' ? 'waitlist-marketing-confirmed' : 'waitlist-invalid-token'
  return `${baseUrl}/career-os?lang=${locale}&waitlist=${path}`
}

export async function GET(req: NextRequest) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin ?? 'https://staituned.com').replace(/\/+$/, '')
  const token = req.nextUrl.searchParams.get('token') || ''
  const payload = verifyWaitlistOptInToken(token)

  if (!payload) {
    return NextResponse.redirect(buildRedirect(siteUrl, 'it', 'invalid'))
  }

  try {
    const docId = Buffer.from(`${payload.email}:${payload.intentKey}`).toString('base64').replace(/[/+=]/g, '_')
    const nowIso = new Date().toISOString()
    await db().collection('career_os_waitlist').doc(docId).set(
      {
        marketingConsent: true,
        marketingConsentStatus: 'confirmed',
        consent: {
          marketing: {
            requested: true,
            confirmed: true,
            confirmedAt: nowIso,
          },
        },
        updatedAt: nowIso,
      },
      { merge: true },
    )

    return NextResponse.redirect(buildRedirect(siteUrl, payload.locale, 'confirmed'))
  } catch (error) {
    console.error('[Career OS Waitlist] confirm error:', error)
    return NextResponse.redirect(buildRedirect(siteUrl, payload.locale, 'invalid'))
  }
}
