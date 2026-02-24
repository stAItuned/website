import { sendTelegramFeedback } from '@/lib/telegram'
import { sendRoleFitAuditReportEmail } from '@/lib/email/roleFitAuditEmail'
import { db } from '@/lib/firebase/admin'
import { generateAIAuditResult } from '@/lib/ai/roleFitAuditAI'
import { getAnswerLabelByQuestionId } from '@/app/(public)/role-fit-audit/lib/questions'
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

// =============================================================================
// POST Handler
// =============================================================================

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const locale = normalizeRoleFitLocale(body?.locale) as RoleFitLocale
        const i18n = roleFitAuditTranslations[locale]

        const { answers, email, name, linkedinUrl, marketingConsent, website, paypalOrderId } = body || {}

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

        const normalizedEmail = email.trim().toLowerCase()

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
        try {
            const submissionsRef = db().collection('role_fit_audit_submissions')
            await submissionsRef.add({
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
                userAgent: req.headers.get('user-agent') || null,
                createdAt: new Date().toISOString(),
            })
        } catch (dbError) {
            console.error('FIREBASE SAVE ERROR (role-fit-audit):', dbError)
            // Continue even if DB fails
        }

        // -------------------------------------------------------------------------
        // Telegram Notification
        // -------------------------------------------------------------------------
        try {
            const telegramMessage = [
                `🎯 Nuovo GenAI Fit Check completato (${result.generatedBy.toUpperCase()})`,
                '',
                name ? `👤 Nome: ${name.trim()}` : '',
                `📧 Email: ${normalizedEmail}`,
                paypalOrderId ? `💰 PayPal ID: ${paypalOrderId}` : '',
                linkedinUrl ? `🔗 LinkedIn: ${linkedinUrl.trim()}` : '',
                `📣 Marketing: ${Boolean(marketingConsent) ? 'Sì' : 'No'}`,
                '',
                `🏷 Archetipo: ${result.archetype?.name || 'N/A'}`,
                `📊 Readiness: ${result.readinessLabel || 'N/A'}`,
                `🎯 NOW: ${result.roleRecommendation?.now || 'N/A'}`,
                `⏭ NEXT: ${result.roleRecommendation?.next || 'N/A'}`,
                '',
                `📈 Scores:`,
                `   Code: ${result.normalizedScores?.code || 0}/100`,
                `   Data: ${result.normalizedScores?.data || 0}/100`,
                `   Product: ${result.normalizedScores?.product || 0}/100`,
                `   GenAI: ${result.normalizedScores?.genai || 0}/100`,
                '',
                `🚧 Top Gaps: ${result.topGaps?.map((g: { title: string }) => g.title).join(', ') || 'Nessuno'}`,
                '',
                result.aiEnhancements?.coachingNote ? `💬 AI Note: ${result.aiEnhancements.coachingNote.substring(0, 100)}...` : '',
            ]
                .filter(Boolean)
                .join('\n')

            await sendTelegramFeedback({
                category: 'role_fit_audit',
                message: telegramMessage,
                email: normalizedEmail,
                page: '/role-fit-audit',
                userAgent: req.headers.get('user-agent') || undefined,
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
