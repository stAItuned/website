import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { getUserContributions } from '@/lib/firebase/contributor-db';
import { sendAgreementWithPDF } from '@/lib/contributor/agreement-service';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const contributions = await getUserContributions(user.uid);
        const signedContribution = contributions
            .filter(c => c.agreement?.checkbox_general || c.agreement?.agreed)
            .sort((a, b) => {
                const dateB = b.agreement?.accepted_at || b.agreement?.agreedAt || 0;
                const dateA = a.agreement?.accepted_at || a.agreement?.agreedAt || 0;
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            })[0];

        if (!signedContribution || !signedContribution.agreement) {
            return NextResponse.json({ success: false, error: 'No signed agreement found' }, { status: 404 });
        }

        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';

        const { success, hash } = await sendAgreementWithPDF({
            email: user.email || '',
            displayName: user.displayName || 'Contributor',
            legalName: signedContribution.agreement.author_name || signedContribution.agreement.legalName || '',
            agreedAt: signedContribution.agreement.accepted_at || signedContribution.agreement.agreedAt || '',
            version: signedContribution.agreement.agreement_version || signedContribution.agreement.version || '',
            language: signedContribution.language || 'en',
            fiscalCode: signedContribution.agreement.fiscal_code || (signedContribution.agreement as any).fiscalCode,
            ipAddress: ip
        });

        if (!success) {
            throw new Error('Failed to send email');
        }

        // 4. Update the contribution with the hash if it was missing (retroactive audit)
        if (!signedContribution.agreement.agreement_hash_sha256 || !signedContribution.agreement.agreement_view_url) {
            const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '');
            const agreementViewUrl = `${SITE_URL}/api/admin/agreement/${signedContribution.id}`;

            const { updateContribution } = await import('@/lib/firebase/contributor-db');
            await updateContribution(signedContribution.id, {
                agreement: {
                    ...signedContribution.agreement,
                    agreement_hash_sha256: signedContribution.agreement.agreement_hash_sha256 || hash,
                    agreement_view_url: signedContribution.agreement.agreement_view_url || agreementViewUrl
                }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('[API] send-agreement-copy error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to send copy' },
            { status: 500 }
        );
    }
}
