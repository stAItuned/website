import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { checkUserHasAgreement, createContribution, getContribution, updateContribution } from '@/lib/firebase/contributor-db';
import { Contribution } from '@/lib/types/contributor';
import { findWriterProfileByEmail } from '@/lib/writer/fs';
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
        if (!user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const hasAgreement = await checkUserHasAgreement(user.uid);
        if (!hasAgreement) {
            return NextResponse.json({ error: 'Contributor agreement required' }, { status: 403 });
        }

        const writerProfile = await findWriterProfileByEmail(user.email);
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
        if (!user.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const hasAgreement = await checkUserHasAgreement(user.uid);
        if (!hasAgreement) {
            return NextResponse.json({ error: 'Contributor agreement required' }, { status: 403 });
        }

        const writerProfile = await findWriterProfileByEmail(user.email);
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

        await updateContribution(id, {
            ...(updates.status ? { status: updates.status } : {}),
            ...(updates.currentStep ? { currentStep: updates.currentStep } : {}),
            ...(typeof updates.draftContent === 'string' ? { draftContent: updates.draftContent } : {}),
            ...(mergedBrief ? { brief: mergedBrief } : {}),
            updatedAt: timestamp,
            lastSavedAt: timestamp,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[API] PUT /user/draft error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
