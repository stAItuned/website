
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

        // Use UTC consistently
        const now = new Date();
        const startDate = new Date();
        startDate.setUTCDate(now.getUTCDate() - days);
        startDate.setUTCHours(0, 0, 0, 0);

        // Fetch usage logs
        const usageSnapshot = await dbDefault()
            .collection('api_usage')
            .where('timestamp', '>=', startDate)
            .get();

        const logs = usageSnapshot.docs.map(doc => doc.data());

        // Process data
        let totalCost = 0;
        let geminiCost = 0;
        let perplexityCost = 0;
        let totalRequests = logs.length;

        const dailyCosts: Record<string, number> = {};

        logs.forEach(log => {
            const cost = Number(log.estimatedCost || 0);
            totalCost += cost;

            if (log.provider === 'gemini') {
                geminiCost += cost;
            } else if (log.provider === 'perplexity') {
                perplexityCost += cost;
            }

            // Daily aggregation
            if (log.timestamp) {
                // Handle Firestore Timestamp or Date string
                const date = log.timestamp.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
                const dateKey = date.toISOString().split('T')[0]; // UTC Key YYYY-MM-DD
                dailyCosts[dateKey] = (dailyCosts[dateKey] || 0) + cost;
            }
        });

        // Fill in missing days with 0
        const chartData: Array<{ date: string; cost: number }> = [];

        for (let i = 0; i <= days; i++) {
            const d = new Date(startDate);
            d.setUTCDate(startDate.getUTCDate() + i);
            const dateKey = d.toISOString().split('T')[0];
            chartData.push({
                date: dateKey,
                cost: dailyCosts[dateKey] || 0
            });
        }

        console.log('Daily Costs Keys:', Object.keys(dailyCosts));
        console.log('Chart Data Sample:', chartData.filter(c => c.cost > 0));

        return NextResponse.json({
            success: true,
            data: {
                totalCost,
                geminiCost,
                perplexityCost,
                totalRequests,
                chartData
            }
        });

    } catch (error) {
        console.error('[API] admin/costs error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch cost data' },
            { status: 500 }
        );
    }
}
