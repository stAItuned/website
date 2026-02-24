import { Resend } from 'resend'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'stAItuned <noreply@staituned.com>'
const INTERNAL_EMAIL = 'info@staituned.com'

interface SendCareerOSWaitlistInternalEmailParams {
  email: string
  locale: 'it' | 'en'
  intent: string
  pricingTier: string
  pricingMode: string
  objective?: string
  acceptedPrivacy: boolean
  marketingConsent: boolean
  marketingConsentStatus: 'not_requested' | 'pending_confirmation' | 'confirmed'
  acceptedTerms: boolean
  source?: string
  page?: string
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

function buildSubject(locale: 'it' | 'en'): string {
  return locale === 'en'
    ? '📥 Career OS waitlist lead'
    : '📥 Nuovo lead waitlist Career OS'
}

function buildText(params: SendCareerOSWaitlistInternalEmailParams): string {
  return [
    `Email: ${params.email}`,
    `Intent: ${params.intent}`,
    `Tier: ${params.pricingTier}`,
    `Mode: ${params.pricingMode}`,
    `Objective: ${params.objective || 'n/a'}`,
    `Accepted privacy: ${params.acceptedPrivacy ? 'yes' : 'no'}`,
    `Marketing consent: ${params.marketingConsent ? 'yes' : 'no'}`,
    `Marketing status: ${params.marketingConsentStatus}`,
    `Accepted terms: ${params.acceptedTerms ? 'yes' : 'no'}`,
    `Source: ${params.source || 'unknown'}`,
    `Page: ${params.page || '/career-os#pricing'}`,
  ].join('\n')
}

export async function sendCareerOSWaitlistInternalEmail(
  params: SendCareerOSWaitlistInternalEmailParams,
): Promise<boolean> {
  const resend = getResendClient()
  if (!resend) {
    console.error('[Career OS Waitlist] RESEND_API_KEY is missing')
    return false
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: INTERNAL_EMAIL,
      replyTo: params.email,
      subject: buildSubject(params.locale),
      text: buildText(params),
    })

    if (error) {
      console.error('[Career OS Waitlist] Resend error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('[Career OS Waitlist] Failed to send internal email:', error)
    return false
  }
}
