import { sendTelegramFeedback } from '@/lib/telegram'
import { sendRoleFitAuditReportEmail } from '@/lib/email/roleFitAuditEmail'
import { db } from '@/lib/firebase/admin'
import { generateAIAuditResult } from '@/lib/ai/roleFitAuditAI'
import { QUESTIONS } from '@/app/(public)/role-fit-audit/lib/questions'
import { NextRequest, NextResponse } from 'next/server'

// =============================================================================
// Validation
// =============================================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// =============================================================================
// POST Handler
// =============================================================================

export async function POST(req: NextRequest) {
    console.log('[API Route] Key present:', !!process.env.GOOGLE_AI_API_KEY)
    try {
        const body = await req.json()

        const { answers, email, name, linkedinUrl, website } = body || {}

        // Honeypot check - silently accept but don't process bot submissions
        if (website && typeof website === 'string' && website.trim() !== '') {
            console.log('[Role Fit Audit] Bot detected via honeypot, ignoring submission')
            return NextResponse.json({ ok: true, result: null }, { status: 200 })
        }

        // Validate required fields
        if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
            return NextResponse.json({ error: 'Email non valida.' }, { status: 400 })
        }

        if (!answers || typeof answers !== 'object') {
            return NextResponse.json({ error: 'Risposte mancanti.' }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()

        // -------------------------------------------------------------------------
        // Generate AI Result (with static fallback)
        // -------------------------------------------------------------------------
        console.log('[Role Fit Audit] Generating result...')
        const result = await generateAIAuditResult(answers, name?.trim())
        console.log(`[Role Fit Audit] Result generated (${result.generatedBy})`)

        // -------------------------------------------------------------------------
        // Save to Firestore
        // -------------------------------------------------------------------------
        try {
            const submissionsRef = db().collection('role_fit_audit_submissions')
            await submissionsRef.add({
                email: normalizedEmail,
                name: name?.trim() || null,
                linkedinUrl: linkedinUrl?.trim() || null,
                answers,
                answersText: Object.entries(answers).reduce((acc, [qId, val]) => {
                    const q = QUESTIONS.find(q => q.id === qId)
                    const opt = q?.options.find(o => o.value === val)
                    if (opt) acc[qId] = opt.label
                    return acc
                }, {} as Record<string, string>),
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
                `🎯 Nuovo Role Fit Audit completato (${result.generatedBy.toUpperCase()})`,
                '',
                name ? `👤 Nome: ${name.trim()}` : '',
                `📧 Email: ${normalizedEmail}`,
                linkedinUrl ? `🔗 LinkedIn: ${linkedinUrl.trim()}` : '',
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
            })
        } catch (emailError) {
            console.error('EMAIL ERROR (role-fit-audit):', emailError)
            // Continue even if email fails
        }

        // Return the result to the frontend
        return NextResponse.json({ ok: true, result }, { status: 200 })
    } catch (err) {
        console.error('Role Fit Audit submit error:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
