import { sendTelegramFeedback } from '@/lib/telegram'
import { feedbackPayloadSchema } from '@/lib/validation/feedback'
import { db } from '@/lib/firebase/admin'
import { applyRetentionMetadata } from '@/lib/privacy/retention'
import { getRetentionPolicy } from '@/lib/privacy/retention-policies'
import { inferEnvironmentFromHost, sendAdminOpsNotification } from '@/lib/notifications/adminOpsPush'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Basic validation + honeypot
        if (typeof body?.website === 'string' && body.website.trim() !== '') {
            // bot detected (honeypot filled) – pretend ok
            return NextResponse.json({ ok: true })
        }

        const parsed = feedbackPayloadSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: 'Invalid payload',
                    details: parsed.error.flatten().fieldErrors,
                },
                { status: 400 }
            )
        }

        const { category, message, email, page, userAgent } = parsed.data
        const nowIso = new Date().toISOString()
        let submissionId: string | null = null

        // Persist feedback with retention metadata (best-effort, non-blocking)
        try {
            const retentionPolicy = getRetentionPolicy('feedback_submissions')
            const created = await db().collection('feedback_submissions').add(
                applyRetentionMetadata(
                    {
                        category,
                        message,
                        email: email || null,
                        page: page || null,
                        userAgent: userAgent || null,
                        consent: true,
                    },
                    retentionPolicy,
                    new Date(nowIso),
                ),
            )
            submissionId = typeof created?.id === 'string' ? created.id : null
        } catch (dbError) {
            console.error('FEEDBACK FIREBASE SAVE ERROR:', dbError)
        }

        // Send metadata-only notifications (no personal data content)
        await sendTelegramFeedback({
            category,
            message: [
                '🆕 New feedback submission (metadata-only)',
                '',
                `🆔 Submission: ${submissionId || 'not_persisted'}`,
                `🏷 Category: ${category}`,
                `🕒 CreatedAt: ${nowIso}`,
                '🔐 Open Admin dashboard for full details.',
            ].join('\n'),
            page,
        })

        try {
            await sendAdminOpsNotification({
                eventType: 'feedback_submitted',
                entityId: submissionId || 'not_persisted',
                source: '/api/feedbacks',
                createdAt: nowIso,
                environment: inferEnvironmentFromHost(req.headers.get('host')),
            })
        } catch (pushError) {
            console.error('ADMIN PUSH ERROR (feedback):', pushError)
        }

        return NextResponse.json({ ok: true }, { status: 200 })
    } catch (err) {
        console.error('Feedback error:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
