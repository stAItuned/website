import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { findWriterProfileByEmail } from '@/lib/writer/fs';
import { checkUserHasAgreement } from '@/lib/firebase/contributor-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const user = await verifyAuth(request);

        if (!user) {
            return NextResponse.json({ isWriter: false, hasProfile: false, hasAgreement: false }, { status: 200 });
        }

        const hasAgreement = await checkUserHasAgreement(user.uid);

        if (!user.email) {
            return NextResponse.json({ isWriter: false, hasProfile: false, hasAgreement }, { status: 200 });
        }

        const profile = await findWriterProfileByEmail(user.email);
        const hasProfile = Boolean(profile);

        if (!profile) {
            return NextResponse.json({ isWriter: false, hasProfile: false, hasAgreement }, { status: 200 });
        }

        return NextResponse.json({
            isWriter: true,
            hasProfile,
            hasAgreement,
            slug: profile.slug,
            profilePath: profile.profilePath,
            name: profile.name || profile.slug.replace('-', ' ')
        }, { status: 200 });

    } catch (error) {
        console.error('[API] writer-status error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to check status' },
            { status: 500 }
        );
    }
}
