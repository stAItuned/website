import { sendTelegramFeedback } from '@/lib/telegram'
import { NextRequest, NextResponse } from 'next/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
        } = body || {}

        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
            return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
        }

        if (!acceptedPrivacy) {
            return NextResponse.json({ error: 'Privacy acceptance is required' }, { status: 400 })
        }

        if (!doubt || typeof doubt !== 'string' || !doubt.trim()) {
            return NextResponse.json({ error: 'Doubt is required' }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()

        // Send Telegram first as primary notification
        const telegramMessage = [
            '🆘 Richiesta Audit Career OS',
            '',
            `👤 Nome: ${name.trim()}`,
            `📧 Email: ${normalizedEmail}`,
            phone ? `📱 Telefono: ${phone.trim()}` : '',
            `❓ Dubbio: ${doubt.trim()}`,
            availability ? `📅 Disponibilità: ${availability.trim()}` : '',
            '',
            'Richiede contatto per chiarimenti.'
        ]
            .filter(Boolean)
            .join('\n')

        try {
            await sendTelegramFeedback({
                category: 'career_os_audit',
                message: telegramMessage,
                email: normalizedEmail,
                page: '/career-os',
                userAgent: userAgent || req.headers.get('user-agent') || undefined,
            })
        } catch (tgError) {
            console.error('TELEGRAM ERROR:', tgError)
            // If Telegram fails, we really have no backup. But we return 200 to user? 
            // Ideally return 500 if both fail. But let's assume Telegram is critical.
            // Actually, the original request was about Server Error often caused by Firebase.
            // Since Audit Modal DOES NOT SAVE TO DB currently (only Telegram),
            // the error must be Telegram-related or env-related there.
            // But if I want to make it robust, I should catch.
            throw tgError // Re-throw to be caught by outer catch and return 500
        }


        return NextResponse.json({ ok: true }, { status: 200 })
    } catch (err) {
        console.error('Career OS audit error:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
