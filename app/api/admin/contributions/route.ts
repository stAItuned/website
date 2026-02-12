import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/firebase/server-auth';
import { getAllContributions } from '@/lib/firebase/contributor-db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const auth = await verifyAdmin(request);
        if (auth.error) {
            return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
        }

        // Fetch all contributions
        const contributions = await getAllContributions();

        // Filter for review or draft
        const reviewItems = contributions.filter((c: any) => c.status === 'review' || c.status === 'draft');

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
