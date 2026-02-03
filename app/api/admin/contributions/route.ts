import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { getAllContributions } from '@/lib/firebase/contributor-db';
import { isAdmin } from '@/lib/firebase/admin-emails';

export async function GET(request: NextRequest) {
    try {
        const user = await verifyAuth(request);

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        if (!isAdmin(user.email)) {
            return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || undefined;

        const contributions = await getAllContributions(status);

        return NextResponse.json({
            success: true,
            contributions,
            total: contributions.length
        });

    } catch (error) {
        console.error('[API] admin/contributions error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to list contributions' },
            { status: 500 }
        );
    }
}
