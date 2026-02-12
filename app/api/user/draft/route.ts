import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { checkUserHasAgreement, createContribution, getContribution, updateContribution } from '@/lib/firebase/contributor-db';
import { Contribution } from '@/lib/types/contributor';
import { getWriterByUid } from '@/lib/writer/firestore';
import { contributionDraftCreateSchema, contributionDraftUpdateSchema } from '@/lib/validation/contributionDraft';

export async function GET(request: NextRequest) {
    try {
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const hasAgreement = await checkUserHasAgreement(user.uid);
        if (!hasAgreement) {
            return NextResponse.json({ error: 'Contributor agreement required' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
        }

        const contribution = await getContribution(id);

        if (!contribution) {
            return NextResponse.json({ error: 'Contribution not found' }, { status: 404 });
        }

        if (contribution.contributorId !== user.uid) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json({ contribution });
    } catch (error) {
        console.error('[API] GET /user/draft error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!user.uid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const hasAgreement = await checkUserHasAgreement(user.uid);
        if (!hasAgreement) {
            return NextResponse.json({ error: 'Contributor agreement required' }, { status: 403 });
        }

        const writerProfile = await getWriterByUid(user.uid);
        if (!writerProfile) {
            return NextResponse.json({ error: 'Writer profile required' }, { status: 403 });
        }

        const json = await request.json();
        const parsed = contributionDraftCreateSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid payload', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        const timestamp = new Date().toISOString();
        const newContribution: Omit<Contribution, 'id'> = {
            ...parsed.data,
            contributorId: user.uid,
            contributorEmail: user.email || '',
            createdAt: timestamp,
            updatedAt: timestamp,
            lastSavedAt: timestamp,
        };

        const id = await createContribution(newContribution);

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error('[API] POST /user/draft error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!user.uid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const hasAgreement = await checkUserHasAgreement(user.uid);
        if (!hasAgreement) {
            return NextResponse.json({ error: 'Contributor agreement required' }, { status: 403 });
        }

        const writerProfile = await getWriterByUid(user.uid);
        if (!writerProfile) {
            return NextResponse.json({ error: 'Writer profile required' }, { status: 403 });
        }

        const json = await request.json();
        const parsed = contributionDraftUpdateSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { error: 'Invalid payload', details: parsed.error.flatten() },
                { status: 400 }
            );
        }
        const { id, ...updates } = parsed.data;

        if (!id) {
            return NextResponse.json({ error: 'Missing id in body' }, { status: 400 });
        }

        // Check ownership before updating
        const existing = await getContribution(id);
        if (!existing) {
            return NextResponse.json({ error: 'Contribution not found' }, { status: 404 });
        }

        if (existing.contributorId !== user.uid) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const timestamp = new Date().toISOString();
        const mergedBrief = updates.brief ? { ...existing.brief, ...updates.brief } : undefined;

        const nextStatus = updates.status ?? existing.status
        const nextStep = updates.currentStep ?? existing.currentStep
        const statusChanged = nextStatus !== existing.status || nextStep !== existing.currentStep
        const nextStatusHistory = statusChanged ? [
            ...(existing.statusHistory ?? []),
            {
                status: nextStatus,
                currentStep: nextStep,
                changedAt: timestamp,
                changedBy: user.email || 'user',
            },
        ] : existing.statusHistory

        await updateContribution(id, {
            ...(updates.status ? { status: updates.status } : {}),
            ...(updates.currentStep ? { currentStep: updates.currentStep } : {}),
            ...(typeof updates.draftContent === 'string' ? { draftContent: updates.draftContent } : {}),
            ...(mergedBrief ? { brief: mergedBrief } : {}),
            updatedAt: timestamp,
            lastSavedAt: timestamp,
            ...(statusChanged ? { statusHistory: nextStatusHistory } : {}),
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API] PUT /user/draft error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
