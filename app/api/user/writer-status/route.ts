import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { getWriterByUid } from '@/lib/writer/firestore';
import { checkUserHasAgreement } from '@/lib/firebase/contributor-db';
import { isWriterPublishEnabled, resolveWriterOnboardingState } from '@/lib/writer/onboarding-state';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function jsonNoStore<T>(data: T, init?: ResponseInit) {
    const response = NextResponse.json(data, init);
    response.headers.set('Cache-Control', 'no-store');
    return response;
}

export async function GET(request: NextRequest) {
    try {
        const user = await verifyAuth(request);

        if (!user) {
            return jsonNoStore({
                isWriter: false,
                hasProfile: false,
                hasAgreement: false,
                writerOnboardingState: 'profile_missing',
                writerPublishEnabled: false,
            }, { status: 200 });
        }

        const hasAgreement = await checkUserHasAgreement(user.uid);

        // Ensure we have a UID before calling getWriterByUid (verifyAuth ensures it but type might be loose)
        if (!user.uid) {
            return jsonNoStore({
                isWriter: false,
                hasProfile: false,
                hasAgreement,
                writerOnboardingState: 'profile_missing',
                writerPublishEnabled: false,
            }, { status: 200 });
        }

        const profile = await getWriterByUid(user.uid);
        const hasProfile = Boolean(profile);

        if (!profile) {
            return jsonNoStore({
                isWriter: false,
                hasProfile: false,
                hasAgreement,
                writerOnboardingState: 'profile_missing',
                writerPublishEnabled: false,
            }, { status: 200 });
        }

        const writerOnboardingState = resolveWriterOnboardingState({
            hasProfile,
            hasAgreement,
        });

        return jsonNoStore({
            isWriter: true,
            hasProfile,
            hasAgreement,
            writerOnboardingState,
            writerPublishEnabled: isWriterPublishEnabled(writerOnboardingState),
            slug: profile.slug,
            // Returning profilePath for compatibility, though we should move to /author/[slug]
            profilePath: `/author/${profile.slug}`,
            name: profile.displayName || profile.slug,
            writerDisplayName: profile.displayName || profile.slug,
            writerImageUrl: profile.image?.publicUrl || null,
        }, { status: 200 });

    } catch (error) {
        console.error('[API] writer-status error:', error);
        return jsonNoStore(
            { success: false, error: 'Failed to check status' },
            { status: 500 }
        );
    }
}
