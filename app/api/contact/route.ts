import { sendTelegramFeedback } from '@/lib/telegram'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Basic validation + honeypot
    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      // bot detected (honeypot filled) – pretend ok
      return NextResponse.json({ ok: true })
    }

    const { name, email, company, message, page, userAgent, consent } = body || {}

    if (!message || typeof message !== 'string' || message.trim().length < 3) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }
    if (!consent) {
      return NextResponse.json({ error: 'Consent required' }, { status: 400 })
    }

    await sendTelegramFeedback({
      category: 'contact',
      message: `Nome: ${name || 'n/a'}\nAzienda: ${company || 'n/a'}\n\n${message}`,
      email,
      page: page || '/?source=contact-modal',
      userAgent,
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
