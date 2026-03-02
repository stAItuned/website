import { randomUUID, createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/admin'
import { sendTelegramFeedback } from '@/lib/telegram'
import { aiActLeadPayloadSchema } from '@/lib/validation/aiActLead'

function getIpHash(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const rawIp = forwardedFor?.split(',')[0]?.trim() || realIp || 'unknown'
  return createHash('sha256').update(rawIp).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (typeof body?.website === 'string' && body.website.trim() !== '') {
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    const parsed = aiActLeadPayloadSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const input = parsed.data
    const nowIso = new Date().toISOString()
    const accessToken = randomUUID()
    const email = input.email.trim().toLowerCase()
    const docId = randomUUID()
    const source = input.source ?? 'landing'
    const company = input.company.trim() || null

    await db()
      .collection('leads_ai_act_tools')
      .doc(docId)
      .set({
        created_at: nowIso,
        name: input.name.trim(),
        email,
        company,
        role: input.role.trim(),
        privacy_consent: input.privacyPolicyAccepted && input.dataProcessingAccepted,
        marketing_consent: input.marketingConsent,
        privacy_policy_version: 'v1.0',
        ip_hash: getIpHash(request),
        source,
        access_token: accessToken,
        locale: input.locale,
      })

    await sendTelegramFeedback({
      category: 'ai_act_tools',
      message:
        `Nuovo lead AI Act\\n` +
        `Nome: ${input.name.trim()}\\n` +
        `Azienda: ${company ?? 'n/a'}\\n` +
        `Ruolo: ${input.role.trim()}\\n` +
        `Marketing: ${input.marketingConsent ? 'si' : 'no'}\\n` +
        `Source: ${source}`,
      email,
      page: '/ai-eu-act',
      userAgent: request.headers.get('user-agent') ?? undefined,
    })

    const redirectUrl = `/ai-eu-act/risorse?token=${accessToken}&lang=${input.locale}`
    return NextResponse.json({ ok: true, redirectUrl }, { status: 200 })
  } catch (error) {
    console.error('AI EU Act lead API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
