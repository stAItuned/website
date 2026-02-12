import { NextRequest, NextResponse } from 'next/server';
import { awardBadge, getAuthorBadges, generateCredentialId } from '@/lib/firebase/badge-service';
import { BADGE_DEFINITIONS } from '@/lib/config/badge-config';
import { AuthorBadge } from '@/lib/types/badge';
import { verifyAdmin } from '@/lib/firebase/server-auth';

export async function POST(req: NextRequest) {
    const auth = await verifyAdmin(req);
    if (auth.error) {
        return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    try {
        const { authorSlug, badgeId } = await req.json();

        // 1. Validate Badge ID
        const badgeDef = BADGE_DEFINITIONS.find(b => b.id === badgeId);
        if (!badgeDef) {
            return NextResponse.json({ success: false, error: 'Badge not found' }, { status: 400 });
        }

        // 2. Check if already earned
        const existing = await getAuthorBadges(authorSlug);
        if (existing.some(b => b.badgeId === badgeId)) {
            return NextResponse.json({ success: false, error: 'Badge already earned' }, { status: 400 });
        }

        // 3. Construct the badge payload
        const now = new Date();
        const newBadge: AuthorBadge = {
            badgeId: badgeDef.id,
            authorId: authorSlug,
            earnedAt: now.toISOString(),
            credentialId: generateCredentialId(now.getFullYear() % 100),
            metrics: { manualAward: true },
            evidenceArticles: [],
            version: "1.0",
            isNew: true
        };

        // 4. Award it
        await awardBadge(authorSlug, newBadge, []);

        return NextResponse.json({ success: true, credentialId: newBadge.credentialId });

    } catch (error) {
        console.error('Error awarding badge:', error);
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
    }
}
