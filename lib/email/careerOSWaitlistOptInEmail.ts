import { Resend } from 'resend'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'stAItuned <noreply@staituned.com>'

interface SendCareerOSWaitlistOptInEmailParams {
  email: string
  locale: 'it' | 'en'
  confirmationUrl: string
}

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

function getSubject(locale: 'it' | 'en'): string {
  return locale === 'en'
    ? 'Confirm Career OS updates subscription'
    : 'Conferma iscrizione aggiornamenti Career OS'
}

function getText(params: SendCareerOSWaitlistOptInEmailParams): string {
  if (params.locale === 'en') {
    return [
      'Please confirm you want to receive Career OS updates and offers by email.',
      '',
      `Confirm: ${params.confirmationUrl}`,
      '',
      'If you did not request this, ignore this email.',
    ].join('\n')
  }

  return [
    'Conferma che vuoi ricevere aggiornamenti e offerte Career OS via email.',
    '',
    `Conferma: ${params.confirmationUrl}`,
    '',
    'Se non hai richiesto tu questa iscrizione, ignora questa email.',
  ].join('\n')
}

export async function sendCareerOSWaitlistOptInEmail(
  params: SendCareerOSWaitlistOptInEmailParams,
): Promise<boolean> {
  const resend = getResendClient()
  if (!resend) {
    console.error('[Career OS Waitlist] RESEND_API_KEY is missing for opt-in email')
    return false
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.email,
      subject: getSubject(params.locale),
      text: getText(params),
    })

    if (error) {
      console.error('[Career OS Waitlist] Opt-in resend error:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('[Career OS Waitlist] Failed to send opt-in email:', error)
    return false
  }
}
