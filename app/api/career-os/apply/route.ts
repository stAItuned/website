import { sendTelegramFeedback } from '@/lib/telegram'
import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { careerOSTranslations, normalizeCareerOSLocale } from '@/lib/i18n/career-os-translations'
import { applyRetentionMetadata } from '@/lib/privacy/retention'
import { getRetentionPolicy } from '@/lib/privacy/retention-policies'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CAREER_OS_APPLY_PRIVACY_VERSION = '2026-03-23'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        if (typeof body?.website === 'string' && body.website.trim() !== '') {
            return NextResponse.json({ ok: true })
        }

        const {
            name,
            email,
            background,
            roleTarget,
            timeline,
            mainBlock,
            applicationsLastMonth,
            linkedinUrl,
            notes,
            phone,
            acceptedPrivacy,
            source,
            pricingTier,
            page,
            userAgent,
            locale: rawLocale,
        } = body || {}
        const locale = normalizeCareerOSLocale(rawLocale)
        const t = careerOSTranslations[locale].apiErrors.apply

        if (!name || typeof name !== 'string' || !name.trim()) return NextResponse.json({ error: t.nameRequired }, { status: 400 })
        if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) return NextResponse.json({ error: t.invalidEmail }, { status: 400 })
        if (!background || typeof background !== 'string') return NextResponse.json({ error: t.backgroundRequired }, { status: 400 })
        if (!roleTarget || typeof roleTarget !== 'string') return NextResponse.json({ error: t.roleRequired }, { status: 400 })
        if (!acceptedPrivacy) return NextResponse.json({ error: t.privacyRequired }, { status: 400 })

        const normalizedEmail = email.trim().toLowerCase()
        const nowIso = new Date().toISOString()
        const nowDate = new Date(nowIso)
        const retentionPolicy = getRetentionPolicy('career_os_applications')
        let submissionId: string | null = null

        // DB Saving (Fail-safe)
        try {
            const applicationsRef = db().collection('career_os_applications')
            const basePayload = {
                name: name.trim(),
                email: normalizedEmail,
                phone: phone?.trim() || null,
                background: background.trim(),
                roleTarget,
                timeline,
                mainBlock,
                applicationsLastMonth,
                linkedinUrl: linkedinUrl?.trim() || null,
                notes: notes?.trim() || null,
                acceptedPrivacy: true,
                privacyVersion: CAREER_OS_APPLY_PRIVACY_VERSION,
                consent: {
                    privacy: {
                        accepted: true,
                        acceptedAt: nowIso,
                        version: CAREER_OS_APPLY_PRIVACY_VERSION,
                    },
                },
                source: source || 'unknown',
                pricingTier: pricingTier || null,
                userAgent: userAgent || req.headers.get('user-agent') || null,
                page: page || '/career-os',
                status: 'active',
            }

            const created = await applicationsRef.add(
                applyRetentionMetadata(basePayload, retentionPolicy, nowDate),
            )
            submissionId = created.id
        } catch (dbError) {
            console.error('FIREBASE SAVE ERROR:', dbError)
            // Continue even if DB fails.
        }

        const telegramMessage = [
            locale === 'en'
                ? '🆕 New Career OS Application (metadata-only)'
                : '🆕 Nuova Application Career OS (metadata-only)',
            '',
            `🆔 Submission: ${submissionId || 'not_persisted'}`,
            `🌐 Locale: ${locale}`,
            pricingTier ? `${locale === 'en' ? '💎 Interest' : '💎 Interesse'}: ${pricingTier}` : '',
            source ? `📍 Source: ${source}` : '',
            `🕒 CreatedAt: ${nowIso}`,
            '🔐 Open Admin dashboard for full details.',
        ]
            .filter(Boolean)
            .join('\n')

        await sendTelegramFeedback({
            category: 'career_os_application',
            message: telegramMessage,
            page: page || '/career-os',
        })

        return NextResponse.json({ ok: true }, { status: 200 })
    } catch (err) {
        console.error('Career OS application error:', err)
        return NextResponse.json({ error: careerOSTranslations.it.apiErrors.apply.serverError }, { status: 500 })
    }
}
