import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { isAdmin } from '@/lib/firebase/admin-emails';
import { getContribution } from '@/lib/firebase/contributor-db';
import { generateContributorAgreementPDF } from '@/lib/pdf/generatePDF';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await verifyAuth(request);

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        if (!isAdmin(user.email)) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;
        const contribution = await getContribution(id);

        if (!contribution || !contribution.agreement) {
            return NextResponse.json({ success: false, error: 'Contribution or agreement not found' }, { status: 404 });
        }

        const agr = contribution.agreement;

        // 1. Fetch Agreement Markdown Text from filesystem
        let agreementText = '';
        try {
            const fs = await import('fs/promises');
            const path = await import('path');
            const lang = contribution.language || 'it';
            const filename = lang === 'it' ? 'contributor-agreement.md' : 'contributor-agreement.en.md';
            const filePath = path.join(process.cwd(), 'public/assets/staituned/contributors/article-writing', filename);
            agreementText = await fs.readFile(filePath, 'utf-8');
        } catch (fsError) {
            console.error('[API] Failed to read agreement file:', fsError);
            agreementText = 'Agreement text not available on server.';
        }

        // 2. Generate PDF
        const pdfBuffer = await generateContributorAgreementPDF({
            legalName: agr.author_name || (agr as any).legalName || 'N/A',
            email: agr.author_email || contribution.contributorEmail || 'N/A',
            date: agr.accepted_at || (agr as any).agreedAt || new Date().toISOString(),
            version: agr.agreement_version || (agr as any).version || '1.1',
            agreementText: agreementText, // Added missing property
            language: contribution.language || 'it',
            fiscalCode: agr.fiscal_code || (agr as any).fiscalCode || '',
            hash: agr.agreement_hash_sha256 || (agr as any).hash || ''
        });

        // Set headers for PDF viewing
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', `inline; filename="agreement_${id}.pdf"`);

        // Convert Buffer to Uint8Array for Next.js response compatibility
        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers,
        });

    } catch (error) {
        console.error('[API] admin/agreement/[id] error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate agreement view' },
            { status: 500 }
        );
    }
}
