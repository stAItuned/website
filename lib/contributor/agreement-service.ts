import { sendAgreementConfirmationEmail } from '@/lib/email/agreementEmail';
import { generateContributorAgreementPDF } from '@/lib/pdf/generatePDF';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

interface SendAgreementParams {
    email: string;
    displayName: string;
    legalName: string;
    agreedAt: string;
    version: string;
    language: 'it' | 'en';
    fiscalCode?: string;
    ipAddress?: string;
}

/**
 * Shared logic to generate the agreement PDF, calculate a digital hash,
 * and send it via email.
 */
export async function sendAgreementWithPDF(params: SendAgreementParams): Promise<{ success: boolean, hash: string }> {
    const { email, displayName, legalName, agreedAt, version, language, fiscalCode, ipAddress } = params;

    // 1. Fetch agreement text for PDF
    const filename = language === 'it' ? 'contributor-agreement.md' : 'contributor-agreement.en.md';
    const agreementPath = path.resolve(process.cwd(), 'public/assets/staituned/contributors/article-writing', filename);
    let agreementText = await fs.readFile(agreementPath, 'utf-8');

    // 2. Perform Replacements (sync with AgreementModal.tsx logic)
    const dateDisplay = new Date(agreedAt).toLocaleDateString(language === 'it' ? 'it-IT' : 'en-US');
    agreementText = agreementText.replace(/{Nome Cognome}/g, legalName);
    agreementText = agreementText.replace(/email {…}/g, `email ${email}`);
    agreementText = agreementText.replace(/{Data}/g, dateDisplay);
    agreementText = agreementText.replace(/CF {…}/g, `CF ${fiscalCode || '____'}`);
    agreementText = agreementText.replace(/{…}/g, '____');

    // 3. Calculate Digital Fingerprint (Hash)
    // We hash the final agreement text + user identification data + timestamp
    const hashInput = `${agreementText}|${legalName}|${email}|${fiscalCode || ''}|${agreedAt}|${ipAddress || ''}`;
    const agreementHash = crypto.createHash('sha256').update(hashInput).digest('hex');

    // 4. Generate PDF
    const pdfBuffer = await generateContributorAgreementPDF({
        legalName,
        email,
        date: dateDisplay,
        version,
        agreementText,
        language,
        hash: agreementHash
    });

    // 5. Send Email
    // Use legalName if displayName is missing or generic "Contributor"
    const greetingName = (displayName && displayName !== 'Contributor')
        ? displayName
        : legalName.split(' ')[0];

    const success = await sendAgreementConfirmationEmail({
        email,
        name: greetingName,
        agreement_version: version,
        accepted_at: agreedAt,
        author_name: legalName,
        author_email: email,
        fiscal_code: fiscalCode,
        language,
        ip: ipAddress || 'unknown',
        pdfBuffer,
        agreement_hash_sha256: agreementHash
    });

    return { success, hash: agreementHash };
}
