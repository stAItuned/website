import { sendTelegramFeedback } from '@/lib/telegram'
import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function buildCalendlyLink(baseUrl: string, email: string, name: string) {
    if (!baseUrl) return 'Non configurato'
    const normalizedBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`
    try {
        const url = new URL(normalizedBaseUrl)
        url.searchParams.set('email', email)
        if (name) {
            url.searchParams.set('name', name)
        }
        return url.toString()
    } catch {
        return normalizedBaseUrl
    }
}

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
        } = body || {}
        if (!name || typeof name !== 'string' || !name.trim()) return NextResponse.json({ error: 'Nome richiesto.' }, { status: 400 })
        if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) return NextResponse.json({ error: 'Email non valida.' }, { status: 400 })
        if (!background || typeof background !== 'string') return NextResponse.json({ error: 'Background richiesto.' }, { status: 400 })
        if (!roleTarget || typeof roleTarget !== 'string') return NextResponse.json({ error: 'Ruolo richiesto.' }, { status: 400 })
        if (!acceptedPrivacy) return NextResponse.json({ error: 'Accettazione privacy richiesta.' }, { status: 400 })

        const normalizedEmail = email.trim().toLowerCase()
        const calendlyBaseUrl =
            process.env.CAREER_OS_CALENDLY_URL ||
            process.env.NEXT_PUBLIC_CAREER_OS_CALENDLY_URL ||
            ''

        // DB Saving (Fail-safe)
        try {
            const applicationsRef = db().collection('career_os_applications')
            await applicationsRef.add({
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
                source: source || 'unknown',
                pricingTier: pricingTier || null,
                userAgent,
                page,
                createdAt: new Date().toISOString(), // Use ISO string for broader compatibility
            })
        } catch (dbError) {
            console.error('FIREBASE SAVE ERROR:', dbError)
            // We continue even if DB fails, as we want to send Telegram at least
        }

        // 3. Telegram Notification
        const calendlyLink = `${calendlyBaseUrl}?email=${encodeURIComponent(normalizedEmail)}&name=${encodeURIComponent(name.trim())}`

        const telegramMessage = [
            '🆕 Nuova Application Career OS',
            '',
            `👤 Nome: ${name.trim()}`,
            `📧 Email: ${normalizedEmail}`,
            phone ? `📱 Telefono: ${phone.trim()}` : '',
            `🎓 Background: ${background.trim()}`,
            `🎯 Ruolo Target: ${roleTarget}`,
            `⏳ Timeline: ${timeline}`,
            `🚧 Blocco: ${mainBlock}`,
            `� Candidature/mese: ${applicationsLastMonth}`,
            linkedinUrl ? `🔗 LinkedIn: ${linkedinUrl}` : '',
            pricingTier ? `💎 Interesse: ${pricingTier}` : '',
            source ? `📍 Source: ${source}` : '',
            notes?.trim() ? `🗒 Note: ${notes.trim()}` : '',
            '',
            `📅 Prenota call: ${calendlyLink}`,
        ]
            .filter(Boolean)
            .join('\n')

        await sendTelegramFeedback({
            category: 'career_os_application',
            message: telegramMessage,
            email: normalizedEmail,
            page: page || '/career-os',
            userAgent: userAgent || req.headers.get('user-agent') || undefined,
        })

        return NextResponse.json({ ok: true }, { status: 200 })
    } catch (err) {
        console.error('Career OS application error:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
