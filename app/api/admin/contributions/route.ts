import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { getAllContributions } from '@/lib/firebase/contributor-db';
import { isAdmin } from '@/lib/firebase/admin-emails';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const user = await verifyAuth(request);

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        if (!isAdmin(user.email)) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        // Fetch all contributions
        const contributions = await getAllContributions();

        // Filter for review or draft
        const reviewItems = contributions.filter(c => c.status === 'review' || c.status === 'draft');

        return NextResponse.json({
            success: true,
            contributions: reviewItems
        });

    } catch (error) {
        console.error('[API] admin/contributions error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch contributions' },
            { status: 500 }
        );
    }
}
