import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { createContribution, updateContribution, getContribution } from '@/lib/firebase/contributor-db';
import { Contribution } from '@/lib/types/contributor';
import { headers } from 'next/headers';
import { sendAgreementConfirmationEmail } from '@/lib/email/agreementEmail';

export async function POST(request: NextRequest) {
    try {
        const user = await verifyAuth(request);

        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { contributionId, data } = body;

        // Audit Trail Extraction
        const headersList = await headers();
        const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';

        let id = contributionId;
        let lastSaved = new Date().toISOString();

        // 1. Prepare Data to Save
        // Inject Audit Trail into Agreement if present and not already auditing
        // Note: The client sends 'agreement' object when saving from StepAgreement
        let dataToSave = { ...data };

        if (dataToSave.agreement && (dataToSave.agreement.agreed || dataToSave.agreement.checkbox_general)) {
            dataToSave.agreement = {
                ...dataToSave.agreement,
                checkbox_general: true,
                checkbox_1341: true,
                accepted_at: dataToSave.agreement.agreedAt || dataToSave.agreement.accepted_at || lastSaved,
                agreement_version: dataToSave.agreement.version || dataToSave.agreement.agreement_version || '1.1',
                author_name: dataToSave.agreement.legalName || dataToSave.agreement.author_name,
                author_email: user.email || '',
                ip: ip,
                user_agent: userAgent
            };
        }

        let isNewAgreement = false;

        const createNewContribution = async () => {
            const newContribution: Omit<Contribution, 'id'> = {
                status: 'pitch',
                currentStep: 'pitch',
                ...dataToSave,
                contributorId: user.uid,
                contributorEmail: user.email || '',
                createdAt: lastSaved,
                updatedAt: lastSaved,
                lastSavedAt: lastSaved,
            };

            id = await createContribution(newContribution);
            if (dataToSave.agreement?.checkbox_general || dataToSave.agreement?.agreed) {
                isNewAgreement = true;
            }
        };

        if (!id) {
            // Create New
            await createNewContribution();
        } else {
            // Update Existing
            const existing = await getContribution(id);
            if (!existing) {
                // If stale/invalid id, create a new contribution instead of failing
                await createNewContribution();
                return NextResponse.json({
                    success: true,
                    contributionId: id,
                    lastSaved,
                    note: 'Recreated missing contribution'
                });
            }

            if (existing.contributorId !== user.uid) {
                return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
            }

            // Check if this is a fresh agreement
            if (!existing.agreement?.checkbox_general && dataToSave.agreement?.checkbox_general) {
                isNewAgreement = true;
            }

            // If already agreed, preserve original audit trail if not provided
            if (existing.agreement?.agreed && dataToSave.agreement) {
                // Keep original IP/UA/Time if strictly needed, or update if we consider this a re-signing.
                // Usually, we want to keep the FIRST signature audit.
                // For now, let's allow overwrite if the client re-sends it, but typically client flow blocks this.
                // Actually, let's ensure we don't lose the original audit if the new one is partial?
                // The client sends the full object.
            }

            const nextStatus = dataToSave.status ?? existing.status;
            const nextStep = dataToSave.currentStep ?? existing.currentStep;
            const statusChanged = nextStatus !== existing.status || nextStep !== existing.currentStep;
            const nextStatusHistory = statusChanged ? [
                ...(existing.statusHistory ?? []),
                {
                    status: nextStatus,
                    currentStep: nextStep,
                    changedAt: lastSaved,
                    changedBy: user.email || 'user',
                },
            ] : existing.statusHistory;

            await updateContribution(id, {
                ...dataToSave,
                lastSavedAt: lastSaved,
                updatedAt: lastSaved,
                ...(statusChanged ? { statusHistory: nextStatusHistory } : {}),
            });
        }

        // 2. Send Email if New Agreement
        if (isNewAgreement && dataToSave.agreement) {
            try {
                const { sendAgreementWithPDF } = await import('@/lib/contributor/agreement-service');
                const { hash } = await sendAgreementWithPDF({
                    email: user.email || '',
                    displayName: user.displayName || 'Contributor',
                    legalName: dataToSave.agreement.author_name,
                    agreedAt: dataToSave.agreement.accepted_at,
                    version: dataToSave.agreement.agreement_version,
                    language: dataToSave.language || 'it',
                    fiscalCode: dataToSave.agreement.fiscal_code || (dataToSave.agreement as any).fiscalCode || (dataToSave.agreement as any).fiscalCode,
                    ipAddress: ip as string
                });

                const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '');
                const agreementViewUrl = `${SITE_URL}/api/admin/agreement/${id}`;

                // Update the document with the hash for audit trail using new field name
                await updateContribution(id, {
                    agreement: {
                        ...dataToSave.agreement,
                        agreement_hash_sha256: hash,
                        agreement_view_url: agreementViewUrl
                    }
                });
            } catch (emailError) {
                console.error('[API] Failed to generate PDF or send email:', emailError);
            }
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
