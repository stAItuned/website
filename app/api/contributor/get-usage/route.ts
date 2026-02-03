import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { getUserUsage } from '@/lib/ai/rate-limiter';

/**
 * Returns the current AI usage stats for the user
 * Used by frontend to show "Remaining: X"
 */
export async function GET(request: NextRequest) {
    try {
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const usage = await getUserUsage(user.uid);

        return NextResponse.json({
            success: true,
            data: usage
        });

    } catch (error) {
        console.error('[API] get-usage error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch usage stats' },
            { status: 500 }
        );
    }
}
