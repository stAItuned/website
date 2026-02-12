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
    answers?: Record<string, unknown> | unknown[] | string | null;
    report?: Record<string, unknown> | string | null;
}

function toIsoString(value: unknown): string {
    if (!value) return '';
    if (value instanceof Date) return value.toISOString();
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return new Date(value).toISOString();
    if (typeof value === 'object' && value !== null && 'toDate' in value) {
        const possible = value as { toDate?: () => Date };
        if (possible.toDate) return possible.toDate().toISOString();
    }
    return '';
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
            const data = doc.data() as {
                email?: string;
                name?: string;
                linkedinUrl?: string;
                marketingConsent?: boolean;
                paypalOrderId?: string;
                createdAt?: unknown;
                result?: {
                    readinessLabel?: string;
                    roleNow?: string;
                    roleNext?: string;
                    scores?: Record<string, number>;
                    normalizedScores?: Record<string, number>;
                    archetypeName?: string;
                };
                answers?: Record<string, unknown> | unknown[] | string | null;
                report?: Record<string, unknown> | string | null;
            };
            return {
                id: doc.id,
                email: data.email || '',
                name: data.name,
                linkedinUrl: data.linkedinUrl,
                marketingConsent: data.marketingConsent,
                paypalOrderId: data.paypalOrderId,
                createdAt: toIsoString(data.createdAt),
                result: data.result ? {
                    readinessLabel: data.result.readinessLabel,
                    roleNow: data.result.roleNow,
                    roleNext: data.result.roleNext,
                    scores: data.result.scores,
                    normalizedScores: data.result.normalizedScores,
                    archetypeName: data.result.archetypeName,
                } : undefined,
                answers: data.answers,
                report: data.report
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
