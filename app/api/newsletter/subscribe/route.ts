import { sendTelegramFeedback } from '@/lib/telegram'
import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/newsletter/subscribe
 * 
 * Subscribes an email to the newsletter.
 * - Stores in Firestore `newsletter_subscribers` collection
 * - Sends Telegram notification
 * - Prevents duplicates
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Honeypot check (bots fill this hidden field)
        if (typeof body?.website === 'string' && body.website.trim() !== '') {
            return NextResponse.json({ ok: true })
        }

        const { email, source } = body || {}

        // Validate email
        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(normalizedEmail)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
        }

        // Check for existing subscriber
        const subscribersRef = db().collection('newsletter_subscribers')
        const existingQuery = await subscribersRef
            .where('email', '==', normalizedEmail)
            .limit(1)
            .get()

        if (!existingQuery.empty) {
            // Already subscribed - return success silently (don't reveal subscription status)
            return NextResponse.json({ ok: true, message: 'Subscribed!' }, { status: 200 })
        }

        // Add new subscriber
        await subscribersRef.add({
            email: normalizedEmail,
            subscribedAt: new Date().toISOString(),
            source: source || 'website',
            status: 'active',
            // Track additional metadata
            userAgent: req.headers.get('user-agent') || null,
            referrer: req.headers.get('referer') || null,
        })

        // Send Telegram notification
        await sendTelegramFeedback({
            category: 'newsletter',
            message: `📬 Nuovo iscritto alla newsletter!\n\nEmail: ${normalizedEmail}\nFonte: ${source || 'website'}`,
            email: normalizedEmail,
            page: source || '/newsletter',
            userAgent: req.headers.get('user-agent') || undefined,
        })

        return NextResponse.json({ ok: true, message: 'Subscribed!' }, { status: 200 })
    } catch (err) {
        console.error('Newsletter subscribe error:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
