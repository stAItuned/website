import { sendTelegramFeedback } from '@/lib/telegram'
import { NextRequest, NextResponse } from 'next/server'
import { careerOSTranslations, normalizeCareerOSLocale } from '@/lib/i18n/career-os-translations'
import { db } from '@/lib/firebase/admin'
import { applyRetentionMetadata } from '@/lib/privacy/retention'
import { getRetentionPolicy } from '@/lib/privacy/retention-policies'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CAREER_OS_AUDIT_PRIVACY_VERSION = '2026-03-23'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Honeypot check
        if (typeof body?.website === 'string' && body.website.trim() !== '') {
            return NextResponse.json({ ok: true })
        }

        const {
            name,
            email,
            doubt,
            availability,
            phone,
            acceptedPrivacy,
            source,
            userAgent,
            locale: rawLocale,
        } = body || {}
        const locale = normalizeCareerOSLocale(rawLocale)
        const t = careerOSTranslations[locale].apiErrors.audit

        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ error: t.nameRequired }, { status: 400 })
        }

        if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
            return NextResponse.json({ error: t.invalidEmail }, { status: 400 })
        }

        if (!acceptedPrivacy) {
            return NextResponse.json({ error: t.privacyRequired }, { status: 400 })
        }

        if (!doubt || typeof doubt !== 'string' || !doubt.trim()) {
            return NextResponse.json({ error: t.doubtRequired }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()
        const nowIso = new Date().toISOString()
        const nowDate = new Date(nowIso)
        const retentionPolicy = getRetentionPolicy('career_os_audit')
        let submissionId: string | null = null

        try {
            const auditRef = db().collection('career_os_audit')
            const created = await auditRef.add(
                applyRetentionMetadata(
                    {
                        email: normalizedEmail,
                        name: name.trim(),
                        phone: phone?.trim() || null,
                        doubt: doubt.trim(),
                        availability: availability?.trim() || null,
                        acceptedPrivacy: true,
                        privacyVersion: CAREER_OS_AUDIT_PRIVACY_VERSION,
                        consent: {
                            privacy: {
                                accepted: true,
                                acceptedAt: nowIso,
                                version: CAREER_OS_AUDIT_PRIVACY_VERSION,
                            },
                        },
                        source: source || 'unknown',
                        page: '/career-os',
                        userAgent: userAgent || req.headers.get('user-agent') || null,
                        status: 'active',
                    },
                    retentionPolicy,
                    nowDate,
                ),
            )
            submissionId = created.id
        } catch (dbError) {
            console.error('CAREER OS AUDIT FIREBASE SAVE ERROR:', dbError)
        }

        const telegramMessage = [
            locale === 'en'
                ? '🆘 Career OS Audit Request (metadata-only)'
                : '🆘 Richiesta Audit Career OS (metadata-only)',
            '',
            `🆔 Submission: ${submissionId || 'not_persisted'}`,
            `🌐 Locale: ${locale}`,
            source ? `📍 Source: ${source}` : '',
            `🕒 CreatedAt: ${nowIso}`,
            '🔐 Open Admin dashboard for full details.'
        ]
            .filter(Boolean)
            .join('\n')

        try {
            await sendTelegramFeedback({
                category: 'career_os_audit',
                message: telegramMessage,
                page: '/career-os',
            })
        } catch (tgError) {
            console.error('TELEGRAM ERROR:', tgError)
            throw tgError
        }

        return NextResponse.json({ ok: true }, { status: 200 })
    } catch (err) {
        console.error('Career OS audit error:', err)
        return NextResponse.json({ error: careerOSTranslations.it.apiErrors.audit.serverError }, { status: 500 })
    }
}
