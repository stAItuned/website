import { sendTelegramFeedback } from '@/lib/telegram'
import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { sendNewsletterWelcomeEmail } from '@/lib/email/newsletterEmail'

/**
 * POST /api/newsletter/subscribe
 * 
 * Subscribes an email to the newsletter.
 * - Stores in Firestore `newsletter_subscribers` collection
 * - Sends Telegram notification
 * - Prevents duplicates
 */
export async function POST(req: NextRequest) {
    console.log('[Newsletter API] RESEND_API_KEY present:', !!process.env.RESEND_API_KEY)
    try {
        const body = await req.json()

        // Honeypot check (bots fill this hidden field)
        if (typeof body?.website === 'string' && body.website.trim() !== '') {
            console.log('[Newsletter] BOT DETECTED (Honeypot filled):', body.website)
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

        // Check for existing subscriber using encoded email as ID
        const subscribersRef = db().collection('newsletter_subscribers')
        const docId = Buffer.from(normalizedEmail).toString('base64').replace(/[/+=]/g, '_')
        const docRef = subscribersRef.doc(docId)
        const doc = await docRef.get()

        if (doc.exists) {
            console.log('[Newsletter] User already subscribed (DocID):', normalizedEmail)
            return NextResponse.json({ ok: true, message: 'Subscribed!' }, { status: 200 })
        }

        // Add new subscriber with encoded ID
        console.log(`[Newsletter] Adding to Firestore (ID: ${docId}): ${normalizedEmail}`)
        await docRef.set({
            email: normalizedEmail,
            subscribedAt: new Date().toISOString(),
            source: source || 'website',
            status: 'active',
            userAgent: req.headers.get('user-agent') || null,
            referrer: req.headers.get('referer') || null,
        })
        console.log('[Newsletter] Firestore OK')

        // Send Telegram notification
        console.log('[Newsletter] Sending Telegram...')
        await sendTelegramFeedback({
            category: 'newsletter',
            message: `📬 Nuovo iscritto alla newsletter!\n\nEmail: ${normalizedEmail}\nFonte: ${source || 'website'}`,
            email: normalizedEmail,
            page: source || '/newsletter',
            userAgent: req.headers.get('user-agent') || undefined,
        })
        console.log('[Newsletter] Telegram OK')

        // Send Welcome Email
        console.log(`[Newsletter] Attempting Resend to: ${normalizedEmail}`)
        const emailSent = await sendNewsletterWelcomeEmail({ email: normalizedEmail })

        if (!emailSent) {
            console.error(`[Newsletter] Resend FAILED for ${normalizedEmail}`)
            // Alert via Telegram if email fails
            await sendTelegramFeedback({
                category: 'newsletter_error',
                message: `❌ Errore invio welcome email!\n\nEmail: ${normalizedEmail}\nDestinatario non ha ricevuto la mail di benvenuto.`,
                email: normalizedEmail,
                page: source || '/newsletter'
            }).catch(e => console.error('Telegram fallback failed:', e))
        } else {
            console.log(`[Newsletter] Resend SUCCESS for ${normalizedEmail}`)
        }

        return NextResponse.json({ ok: true, message: 'Subscribed!' }, { status: 200 })
    } catch (err) {
        console.error('[Newsletter FATAL ERROR]:', err)
        // Global error notification
        await sendTelegramFeedback({
            category: 'newsletter_fatal',
            message: `🚨 Errore fatale nell'api newsletter!\n\nDettaglio: ${err instanceof Error ? err.message : String(err)}`,
            page: '/api/newsletter/subscribe'
        }).catch(() => { })

        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
