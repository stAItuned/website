import { randomUUID, createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/admin'
import { sendTelegramFeedback } from '@/lib/telegram'
import { aiActLeadPayloadSchema } from '@/lib/validation/aiActLead'
import { applyRetentionMetadata, computeRetentionUntil } from '@/lib/privacy/retention'
import { getRetentionPolicy } from '@/lib/privacy/retention-policies'

const AI_ACT_PRIVACY_VERSION = '2026-03-23'
const ACCESS_TOKEN_TTL_DAYS = 30

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
    const nowDate = new Date(nowIso)
    const accessToken = randomUUID()
    const accessTokenExpiresAt = computeRetentionUntil(nowIso, {
      ttlDays: ACCESS_TOKEN_TTL_DAYS,
      action: 'hard_delete',
      rationale: 'Temporary access token validity window for AI EU Act resources.',
    })
    const email = input.email.trim().toLowerCase()
    const docId = randomUUID()
    const source = input.source ?? 'landing'
    const company = input.company.trim() || null
    const retentionPolicy = getRetentionPolicy('leads_ai_act_tools')

    await db()
      .collection('leads_ai_act_tools')
      .doc(docId)
      .set(applyRetentionMetadata({
        created_at: nowIso,
        name: input.name.trim(),
        email,
        company,
        role: input.role.trim(),
        privacy_consent: input.privacyPolicyAccepted && input.dataProcessingAccepted,
        marketing_consent: input.marketingConsent,
        privacy_policy_version: AI_ACT_PRIVACY_VERSION,
        ip_hash: getIpHash(request),
        source,
        access_token: accessToken,
        accessToken: accessToken,
        accessTokenExpiresAt,
        access_token_expires_at: accessTokenExpiresAt,
        locale: input.locale,
        status: 'active',
      }, retentionPolicy, nowDate))

    await sendTelegramFeedback({
      category: 'ai_act_tools',
      message:
        `Nuovo lead AI Act (metadata-only)\\n` +
        `Submission: ${docId}\\n` +
        `Locale: ${input.locale}\\n` +
        `Marketing: ${input.marketingConsent ? 'si' : 'no'}\\n` +
        `Source: ${source}\\n` +
        `CreatedAt: ${nowIso}`,
      page: '/ai-eu-act',
    })

    const redirectUrl = `/ai-eu-act/risorse?token=${accessToken}&lang=${input.locale}`
    return NextResponse.json({ ok: true, redirectUrl }, { status: 200 })
  } catch (error) {
    console.error('AI EU Act lead API error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
