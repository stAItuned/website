import { sendTelegramFeedback } from '@/lib/telegram'
import { db } from '@/lib/firebase/admin'
import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/contributors/apply
 * 
 * Handles contributor application submissions.
 * - Stores in Firestore `contributor_applications` collection
 * - Sends Telegram notification
 * - Prevents duplicate applications by email
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Honeypot check (bots fill this hidden field)
        if (typeof body?.website === 'string' && body.website.trim() !== '') {
            return NextResponse.json({ ok: true })
        }

        const { name, email, linkedinUrl, expertise, bio, source } = body || {}

        // Validate required fields
        if (!name || typeof name !== 'string' || !name.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        if (!email || typeof email !== 'string') {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        if (!expertise || typeof expertise !== 'string' || !expertise.trim()) {
            return NextResponse.json({ error: 'Expertise areas are required' }, { status: 400 })
        }

        if (!bio || typeof bio !== 'string' || !bio.trim()) {
            return NextResponse.json({ error: 'Bio is required' }, { status: 400 })
        }

        const normalizedEmail = email.trim().toLowerCase()

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(normalizedEmail)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
        }

        // Check for existing application
        const applicationsRef = db().collection('contributor_applications')
        const existingQuery = await applicationsRef
            .where('email', '==', normalizedEmail)
            .limit(1)
            .get()

        if (!existingQuery.empty) {
            // Already applied - return success message
            return NextResponse.json({
                ok: true,
                message: 'You have already submitted an application. We\'ll be in touch!'
            }, { status: 200 })
        }

        // Add new application
        await applicationsRef.add({
            name: name.trim(),
            email: normalizedEmail,
            linkedinUrl: linkedinUrl?.trim() || null,
            expertise: expertise.trim(),
            bio: bio.trim(),
            source: source || 'website',
            status: 'pending',
            appliedAt: new Date().toISOString(),
            // Track additional metadata
            userAgent: req.headers.get('user-agent') || null,
            referrer: req.headers.get('referer') || null,
        })

        // Send Telegram notification
        await sendTelegramFeedback({
            category: 'contributor_application',
            message: `✍️ Nuova richiesta di contributor!\n\n👤 Nome: ${name.trim()}\n📧 Email: ${normalizedEmail}\n🔗 LinkedIn: ${linkedinUrl?.trim() || 'N/A'}\n🎯 Expertise: ${expertise.trim()}\n\n📝 Bio:\n${bio.trim()}\n\nFonte: ${source || 'website'}`,
            email: normalizedEmail,
            page: source || '/contributor-apply',
            userAgent: req.headers.get('user-agent') || undefined,
        })

        return NextResponse.json({ ok: true, message: 'Application submitted!' }, { status: 200 })
    } catch (err) {
        console.error('Contributor application error:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
