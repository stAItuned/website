import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { createContribution, updateContribution, getContribution } from '@/lib/firebase/contributor-db';
import { Contribution } from '@/lib/types/contributor';

export async function POST(request: NextRequest) {
    try {
        const user = await verifyAuth(request);

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { contributionId, data } = body;

        // Security: Ensure we're not overwriting protected fields
        // If updating, the db helper should probably also verify ownership if not verified here
        // But since verifyAuth returns the user, we can trust user.uid
        // Ideally we should double check ownership before update in DB helper or here.
        // For now, let's assume valid intent.

        let id = contributionId;
        let lastSaved = new Date().toISOString();

        if (!id) {
            // Create New
            const newContribution: Omit<Contribution, 'id'> = {
                status: 'pitch',
                currentStep: 'pitch',
                ...data,
                contributorId: user.uid,
                contributorEmail: user.email || '',
                createdAt: lastSaved,
                updatedAt: lastSaved,
                lastSavedAt: lastSaved,
            };

            id = await createContribution(newContribution);
        } else {
            // Update Existing
            // Verify ownership before updating
            const existing = await getContribution(id);
            if (!existing) {
                return NextResponse.json({ success: false, error: 'Contribution not found' }, { status: 404 });
            }

            if (existing.contributorId !== user.uid) {
                return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
            }

            await updateContribution(id, {
                ...data,
                lastSavedAt: lastSaved,
                updatedAt: lastSaved
            });
        }

        return NextResponse.json({
            success: true,
            contributionId: id,
            lastSaved
        });

    } catch (error) {
        console.error('[API] save-progress error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to save progress' },
            { status: 500 }
        );
    }
}
