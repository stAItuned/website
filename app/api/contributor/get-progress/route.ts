import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { getUserContributions } from '@/lib/firebase/contributor-db';

export async function GET(request: NextRequest) {
    try {
        const user = await verifyAuth(request);

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const contributions = await getUserContributions(user.uid);

        return NextResponse.json({
            success: true,
            contributions
        });

    } catch (error: any) {
        console.error('[API] get-progress error details:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to fetch contributions' },
            { status: 500 }
        );
    }
}
