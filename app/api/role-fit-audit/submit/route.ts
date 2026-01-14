import { sendTelegramFeedback } from '@/lib/telegram'
import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

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

        const { answers, email, name, linkedinUrl, result } = body || {}

        // Validate required fields
        if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
            return NextResponse.json({ error: 'Email non valida.' }, { status: 400 })
        }

        if (!answers || typeof answers !== 'object') {
            return NextResponse.json({ error: 'Risposte mancanti.' }, { status: 400 })
        }

        if (!result || typeof result !== 'object') {
            return NextResponse.json({ error: 'Risultato mancante.' }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()

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
                result: {
                    scores: result.scores,
                    normalizedScores: result.normalizedScores,
                    archetypeId: result.archetype?.id,
                    archetypeName: result.archetype?.name,
                    readinessLabel: result.readinessLabel,
                    roleNow: result.roleRecommendation?.now,
                    roleNext: result.roleRecommendation?.next,
                    topGapIds: result.topGaps?.map((g: { id: string }) => g.id) || [],
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
                '🎯 Nuovo Role Fit Audit completato',
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
        // Email Confirmation (placeholder - to be implemented)
        // -------------------------------------------------------------------------
        // TODO: Implement email sending with Resend or similar
        // For now, we just log the intent
        console.log(`[Role Fit Audit] Email confirmation would be sent to: ${normalizedEmail}`)

        return NextResponse.json({ ok: true }, { status: 200 })
    } catch (err) {
        console.error('Role Fit Audit submit error:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
