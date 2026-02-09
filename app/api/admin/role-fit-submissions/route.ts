import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { isAdmin } from '@/lib/firebase/admin-emails';
import { db } from '@/lib/firebase/admin';

interface RoleFitSubmission {
    id: string;
    email: string;
    name?: string;
    linkedinUrl?: string;
    marketingConsent?: boolean;
    paypalOrderId?: string;
    createdAt: string;
    result?: {
        readinessLabel?: string;
        roleNow?: string;
        roleNext?: string;
        scores?: Record<string, number>;
        normalizedScores?: Record<string, number>;
        archetypeName?: string;
    };
}

export async function GET(request: NextRequest) {
    try {
        const user = await verifyAuth(request);

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        if (!isAdmin(user.email)) {
            return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        console.log('[Admin RoleFit] Fetching submissions for admin:', user.email);

        // Use the specific DB instance configured for role-fit-audit
        const snapshot = await db().collection('role_fit_audit_submissions')
            .orderBy('createdAt', 'desc')
            .limit(100)
            .get();

        console.log('[Admin RoleFit] Found submissions count:', snapshot.docs.length);

        const submissions: RoleFitSubmission[] = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                email: data.email,
                name: data.name,
                linkedinUrl: data.linkedinUrl,
                marketingConsent: data.marketingConsent,
                paypalOrderId: data.paypalOrderId,
                createdAt: data.createdAt,
                result: data.result ? {
                    readinessLabel: data.result.readinessLabel,
                    roleNow: data.result.roleNow,
                    roleNext: data.result.roleNext,
                    scores: data.result.scores,
                    normalizedScores: data.result.normalizedScores,
                    archetypeName: data.result.archetypeName,
                } : undefined
            };
        });

        return NextResponse.json({
            success: true,
            submissions,
            total: submissions.length
        });

    } catch (error) {
        console.error('[API] admin/role-fit-submissions error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to list role fit submissions' },
            { status: 500 }
        );
    }
}
