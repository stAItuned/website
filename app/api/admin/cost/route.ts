import { NextRequest, NextResponse } from 'next/server';
import { dbDefault } from '@/lib/firebase/admin';
import { verifyAdmin } from '@/lib/firebase/server-auth';

export async function GET(request: NextRequest) {
    const auth = await verifyAdmin(request);
    if (auth.error) {
        return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const snapshot = await dbDefault()
            .collection('api_usage')
            .where('timestamp', '>=', startOfMonth)
            .get();

        const usage = snapshot.docs.map(doc => doc.data());

        const totalCost = usage.reduce((acc, curr) => acc + (curr.estimatedCost || 0), 0);
        const totalTokens = usage.reduce((acc, curr) => acc + (curr.totalTokens || 0), 0);
        const requests = usage.length;

        const byModel = usage.reduce((acc, curr) => {
            const model = curr.model || 'unknown';
            if (!acc[model]) {
                acc[model] = { cost: 0, requests: 0, tokens: 0 };
            }
            acc[model].cost += (curr.estimatedCost || 0);
            acc[model].requests += 1;
            acc[model].tokens += (curr.totalTokens || 0);
            return acc;
        }, {} as Record<string, any>);

        const daily = usage.reduce((acc, curr) => {
            const date = curr.timestamp?.toDate ? curr.timestamp.toDate().toISOString().split('T')[0] : 'unknown';
            if (!acc[date]) {
                acc[date] = { date, cost: 0, tokens: 0, requests: 0 };
            }
            acc[date].cost += (curr.estimatedCost || 0);
            acc[date].tokens += (curr.totalTokens || 0);
            acc[date].requests += 1;
            return acc;
        }, {} as Record<string, any>);

        const dailyArray = Object.values(daily).sort((a: any, b: any) => a.date.localeCompare(b.date));

        return NextResponse.json({
            success: true,
            period: 'current_month',
            summary: {
                totalCost,
                totalTokens,
                requests
            },
            byModel,
            daily: dailyArray
        });

    } catch (error) {
        console.error('Error fetching cost data:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch cost data' }, { status: 500 });
    }
}
