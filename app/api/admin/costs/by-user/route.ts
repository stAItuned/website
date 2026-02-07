
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { isAdmin } from '@/lib/firebase/admin-emails';
import { dbDefault } from '@/lib/firebase/admin';

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
        const days = parseInt(searchParams.get('days') || '30');

        const now = new Date();
        const startDate = new Date();
        startDate.setDate(now.getDate() - days);

        // Fetch usage logs
        const usageSnapshot = await dbDefault()
            .collection('api_usage')
            .where('timestamp', '>=', startDate)
            .get();

        const logs = usageSnapshot.docs.map(doc => doc.data());

        // Aggregate by user
        const userStats: Record<string, {
            email: string;
            requests: number;
            totalTokens: number;
            totalCost: number;
            geminiCost: number;
            perplexityCost: number;
        }> = {};

        logs.forEach(log => {
            const email = log.userEmail || 'Anonymous';
            const cost = log.estimatedCost || 0;
            const tokens = log.totalTokens || 0;

            if (!userStats[email]) {
                userStats[email] = {
                    email,
                    requests: 0,
                    totalTokens: 0,
                    totalCost: 0,
                    geminiCost: 0,
                    perplexityCost: 0
                };
            }

            userStats[email].requests++;
            userStats[email].totalTokens += tokens;
            userStats[email].totalCost += cost;

            if (log.provider === 'gemini') {
                userStats[email].geminiCost += cost;
            } else if (log.provider === 'perplexity') {
                userStats[email].perplexityCost += cost;
            }
        });

        // Convert to array and sort by cost desc
        const userBreakdown = Object.values(userStats)
            .sort((a, b) => b.totalCost - a.totalCost);

        return NextResponse.json({
            success: true,
            data: userBreakdown
        });

    } catch (error) {
        console.error('[API] admin/costs/by-user error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user cost data' },
            { status: 500 }
        );
    }
}
