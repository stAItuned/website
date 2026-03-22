import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/newsletter/subscribe
 *
 * Newsletter is dismissed as part of GDPR workstream 2.
 * Endpoint kept intentionally to return a deterministic status
 * for legacy clients during transition.
 */
export async function POST(_req: NextRequest) {
    return NextResponse.json(
        {
            ok: false,
            error: 'newsletter_dismissed',
            message: 'Newsletter subscriptions are no longer available.'
        },
        { status: 410 }
    )
}
