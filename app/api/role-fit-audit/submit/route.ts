import { sendTelegramFeedback } from '@/lib/telegram'
import { sendRoleFitAuditReportEmail } from '@/lib/email/roleFitAuditEmail'
import { db } from '@/lib/firebase/admin'
import { generateAIAuditResult } from '@/lib/ai/roleFitAuditAI'
import { getAnswerLabelByQuestionId } from '@/app/(public)/role-fit-audit/lib/questions'
import { applyRetentionMetadata } from '@/lib/privacy/retention'
import { getRetentionPolicy } from '@/lib/privacy/retention-policies'
import { inferEnvironmentFromHost, sendAdminOpsNotification } from '@/lib/notifications/adminOpsPush'
import { NextRequest, NextResponse } from 'next/server'
import {
    normalizeRoleFitLocale,
    roleFitAuditTranslations,
    type RoleFitLocale,
} from '@/lib/i18n/role-fit-audit-translations'

// =============================================================================
// Validation
// =============================================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ROLE_FIT_PRIVACY_VERSION = '2026-03-22'

// =============================================================================
// POST Handler
// =============================================================================

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const locale = normalizeRoleFitLocale(body?.locale) as RoleFitLocale
        const i18n = roleFitAuditTranslations[locale]

        const { answers, email, name, linkedinUrl, marketingConsent, acceptedPrivacy, website, paypalOrderId } = body || {}

        // Honeypot check - silently accept but don't process bot submissions
        if (website && typeof website === 'string' && website.trim() !== '') {
            console.log('[GenAI Fit Check] Bot detected via honeypot, ignoring submission')
            return NextResponse.json({ ok: true, result: null }, { status: 200 })
        }

        // Validate required fields
        if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
            return NextResponse.json({ error: i18n.apiErrors.invalidEmail }, { status: 400 })
        }

        if (!answers || typeof answers !== 'object') {
            return NextResponse.json({ error: i18n.apiErrors.missingAnswers }, { status: 400 })
        }
        if (!acceptedPrivacy) {
            return NextResponse.json({ error: i18n.apiErrors.privacyRequired }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()
        const nowIso = new Date().toISOString()
        const retentionPolicy = getRetentionPolicy('role_fit_audit_submissions')

        // -------------------------------------------------------------------------
        // Generate AI Result (with static fallback)
        // -------------------------------------------------------------------------
        console.log('[GenAI Fit Check] Generating result...')
        const result = await generateAIAuditResult(
            answers,
            name?.trim(),
            locale,
            {
                userEmail: normalizedEmail,
                endpoint: 'role-fit-audit'
            }
        )
        console.log(`[GenAI Fit Check] Result generated (${result.generatedBy})`)

        // -------------------------------------------------------------------------
        // Save to Firestore
        // -------------------------------------------------------------------------
        let submissionId: string | null = null
        try {
            const submissionsRef = db().collection('role_fit_audit_submissions')
            const basePayload = {
                email: normalizedEmail,
                name: name?.trim() || null,
                linkedinUrl: linkedinUrl?.trim() || null,
                marketingConsent: Boolean(marketingConsent),
                paypalOrderId: paypalOrderId || null,
                answers,
                answersText: Object.entries(answers).reduce((acc, [qId, val]) => {
                    const label = getAnswerLabelByQuestionId(qId, Number(val), locale)
                    if (label) acc[qId] = label
                    return acc
                }, {} as Record<string, string>),
                locale,
                result: {
                    generatedBy: result.generatedBy,
                    scores: result.scores,
                    normalizedScores: result.normalizedScores,
                    archetypeId: result.archetype?.id,
                    archetypeName: result.archetype?.name,
                    readinessLabel: result.readinessLabel,
                    roleNow: result.roleRecommendation?.now,
                    roleNext: result.roleRecommendation?.next,
                    topGapIds: result.topGaps?.map((g: { id: string }) => g.id) || [],
                    // AI enhancements if available
                    aiEnhancements: result.aiEnhancements || null,
                },
                status: 'active',
                consent: {
                    privacy: {
                        accepted: true,
                        acceptedAt: nowIso,
                        version: ROLE_FIT_PRIVACY_VERSION,
                    },
                    marketing: {
                        requested: Boolean(marketingConsent),
                    },
                },
                privacyVersion: ROLE_FIT_PRIVACY_VERSION,
                dataMinimizationVersion: 'v1',
                userAgent: req.headers.get('user-agent') || null,
            }

            const created = await submissionsRef.add(
                applyRetentionMetadata(basePayload, retentionPolicy, new Date(nowIso)),
            )
            submissionId = created.id
        } catch (dbError) {
            console.error('FIREBASE SAVE ERROR (role-fit-audit):', dbError)
            // Continue even if DB fails
        }

        // -------------------------------------------------------------------------
        // Admin PWA Notification (metadata-only)
        // -------------------------------------------------------------------------
        try {
            await sendAdminOpsNotification({
                eventType: 'role_fit_audit_submitted',
                entityId: submissionId || 'not_persisted',
                source: '/api/role-fit-audit/submit',
                createdAt: nowIso,
                locale,
                environment: inferEnvironmentFromHost(req.headers.get('host')),
            })
        } catch (pushError) {
            console.error('ADMIN PUSH ERROR (role-fit-audit):', pushError)
            // Continue even if admin push fails
        }

        // -------------------------------------------------------------------------
        // Telegram Notification
        // -------------------------------------------------------------------------
        try {
            const telegramMessage = [
                `🎯 Nuovo GenAI Fit Check completato`,
                '',
                `🆔 Submission: ${submissionId || 'not_persisted'}`,
                `⚙️ Engine: ${result.generatedBy.toUpperCase()}`,
                `🌐 Locale: ${locale}`,
                `📣 Marketing: ${Boolean(marketingConsent) ? 'Sì' : 'No'}`,
                `🕒 CreatedAt: ${nowIso}`,
                '',
                `🏷 Archetipo: ${result.archetype?.name || 'N/A'}`,
                `📊 Readiness: ${result.readinessLabel || 'N/A'}`,
                `📈 Code: ${result.normalizedScores?.code || 0}/100`,
                `📈 Data: ${result.normalizedScores?.data || 0}/100`,
                `📈 Product: ${result.normalizedScores?.product || 0}/100`,
                `📈 GenAI: ${result.normalizedScores?.genai || 0}/100`,
            ]
                .filter(Boolean)
                .join('\n')

            await sendTelegramFeedback({
                category: 'role_fit_audit',
                message: telegramMessage,
                page: '/role-fit-audit',
            })
        } catch (telegramError) {
            console.error('TELEGRAM ERROR (role-fit-audit):', telegramError)
            // Continue even if Telegram fails
        }

        // -------------------------------------------------------------------------
        // Email Report with Resend
        // -------------------------------------------------------------------------
        try {
            await sendRoleFitAuditReportEmail({
                email: normalizedEmail,
                name: name?.trim(),
                result,
                locale,
                internalAlert: {
                    submissionId: submissionId || 'not_persisted',
                    generatedBy: result.generatedBy,
                    readinessLabel: result.readinessLabel || 'N/A',
                    archetypeId: result.archetype?.id || 'N/A',
                    createdAt: nowIso,
                },
            })
        } catch (emailError) {
            console.error('EMAIL ERROR (role-fit-audit):', emailError)
            // Continue even if email fails
        }

        // Return the result to the frontend
        return NextResponse.json({ ok: true, result }, { status: 200 })
    } catch (err) {
        console.error('GenAI Fit Check submit error:', err)
        return NextResponse.json({ error: roleFitAuditTranslations.it.apiErrors.serverError }, { status: 500 })
    }
}
