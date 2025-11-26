import { sendTelegramFeedback } from '@/lib/telegram'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Honeypot check
    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ ok: true })
    }

    const { name, email, github, experience, hours, message, page, userAgent, consent, marketingConsent } = body || {}

    if (!message || typeof message !== 'string' || message.trim().length < 3) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }
    if (!consent) {
      return NextResponse.json({ error: 'Consent required' }, { status: 400 })
    }

    const composed = `Nome: ${name || 'n/a'}\nEmail: ${email || 'n/a'}\nGitHub: ${github || 'n/a'}\nEsperienza: ${experience || 'n/a'}\nOre/settimana: ${hours || 'n/a'}\nMarketing: ${marketingConsent ? 'Sì' : 'No'}\n\n${message}`

    await sendTelegramFeedback({
      category: 'lab',
      message: composed,
      email,
      page: page || '/lab',
      userAgent,
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('Lab API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
