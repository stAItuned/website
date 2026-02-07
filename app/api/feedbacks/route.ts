import { sendTelegramFeedback } from '@/lib/telegram'
import { feedbackPayloadSchema } from '@/lib/validation/feedback'
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

        // Send to Telegram
        await sendTelegramFeedback({
            category,
            message,
            email: email || undefined,
            page,
            userAgent,
        })

        // 1) (Default) Send to Slack webhook if present
        const webhook = process.env.SLACK_WEBHOOK_FEEDBACK
        if (webhook) {
            const text = [
                '*New stAI Tuned feedback*',
                `*Category*: ${category ?? 'n/a'}`,
                `*Message*: ${message}`,
                email ? `*Email*: ${email}` : null,
                page ? `*Page*: ${page}` : null,
                userAgent ? `*UA*: ${userAgent}` : null,
            ]
                .filter(Boolean)
                .join('\n')

            await fetch(webhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            })
        }

        // 2) (Optional) Firestore/Admin, Resend, etc. — add here if you want

        return NextResponse.json({ ok: true }, { status: 200 })
    } catch (err) {
        console.error('Feedback error:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
