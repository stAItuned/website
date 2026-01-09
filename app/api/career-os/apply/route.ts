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
            source,
            page,
            userAgent,
        } = body || {}

        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
            return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
        }

        if (!background || typeof background !== 'string') {
            return NextResponse.json({ error: 'Background is required' }, { status: 400 })
        }

        if (!roleTarget || typeof roleTarget !== 'string') {
            return NextResponse.json({ error: 'Role target is required' }, { status: 400 })
        }

        if (!timeline || typeof timeline !== 'string') {
            return NextResponse.json({ error: 'Timeline is required' }, { status: 400 })
        }

        if (!mainBlock || typeof mainBlock !== 'string') {
            return NextResponse.json({ error: 'Main block is required' }, { status: 400 })
        }

        if (!applicationsLastMonth || typeof applicationsLastMonth !== 'string') {
            return NextResponse.json({ error: 'Applications count is required' }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()
        const calendlyBaseUrl =
            process.env.CAREER_OS_CALENDLY_URL ||
            process.env.NEXT_PUBLIC_CAREER_OS_CALENDLY_URL ||
            ''

        const calendlyLink = buildCalendlyLink(calendlyBaseUrl, normalizedEmail, name.trim())

        const applicationsRef = db().collection('career_os_applications')
        await applicationsRef.add({
            name: name.trim(),
            email: normalizedEmail,
            background: background.trim(),
            roleTarget: roleTarget.trim(),
            timeline: timeline.trim(),
            mainBlock: mainBlock.trim(),
            applicationsLastMonth: applicationsLastMonth.trim(),
            linkedinUrl: linkedinUrl?.trim() || null,
            notes: notes?.trim() || null,
            source: source || 'career-os',
            status: 'new',
            createdAt: new Date().toISOString(),
            userAgent: userAgent || req.headers.get('user-agent') || null,
            referrer: req.headers.get('referer') || null,
        })

        const telegramMessage = [
            '🆕 Nuova Application Career OS',
            '',
            `👤 Nome: ${name.trim()}`,
            `📧 Email: ${normalizedEmail}`,
            `🎓 Background: ${background.trim()}`,
            `🎯 Ruolo: ${roleTarget.trim()}`,
            `⏰ Timeline: ${timeline.trim()}`,
            `🚧 Blocco: ${mainBlock.trim()}`,
            `📝 Candidature: ${applicationsLastMonth.trim()}`,
            `🔗 LinkedIn: ${linkedinUrl?.trim() || 'Non fornito'}`,
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
