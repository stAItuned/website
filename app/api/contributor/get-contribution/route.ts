import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { getContribution } from '@/lib/firebase/contributor-db';
import { sanitizeFirestoreDate } from '@/lib/firebase/utils';

export async function GET(request: NextRequest) {
    try {
        const user = await verifyAuth(request);

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'Missing contribution ID' }, { status: 400 });
        }

        const contribution = await getContribution(id);

        if (!contribution) {
            return NextResponse.json({ success: false, error: 'Contribution not found' }, { status: 404 });
        }

        // Security check: only the owner can see the progress
        if (contribution.contributorId !== user.uid) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        const sanitized = {
            ...contribution,
            createdAt: sanitizeFirestoreDate(contribution.createdAt),
            updatedAt: sanitizeFirestoreDate(contribution.updatedAt),
            lastSavedAt: sanitizeFirestoreDate(contribution.lastSavedAt),
        };

        return NextResponse.json({ success: true, contribution: sanitized });
    } catch (error: any) {
        console.error('Error fetching contribution:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
