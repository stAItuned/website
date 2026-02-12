
import { Resend } from 'resend'
import { BRAND } from '@/lib/brand'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'stAI tuned <noreply@staituned.com>'
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? BRAND.url).replace(/\/+$/, '')

interface SendAgreementConfirmationParams {
    email: string
    name: string
    agreement_version: string
    accepted_at: string
    author_name: string
    author_email: string
    fiscal_code?: string
    language: 'it' | 'en'
    ip?: string
    pdfBuffer?: Buffer
    agreement_hash_sha256?: string
}

export async function sendAgreementConfirmationEmail(params: SendAgreementConfirmationParams): Promise<boolean> {
    const { email, name, agreement_version, accepted_at, author_name, author_email, fiscal_code, language, pdfBuffer, agreement_hash_sha256, ip } = params

    // Force English subject and body if requested, or based on parameter
    const subject = 'stAI tuned Contributor Agreement Confirmation'

    const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; color: #333; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0f172a;">Contributor Agreement Confirmation</h2>
        
        <p>Hi ${name},<br>thank you for accepting the stAI tuned contributor agreement.</p>

        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
            <p><strong>Acceptance Details:</strong></p>
            <ul style="list-style: none; padding: 0;">
                <li><strong>Version:</strong> ${agreement_version}</li>
                <li><strong>Date:</strong> ${new Date(accepted_at).toLocaleString('en-US')}</li>
                <li><strong>Legal Name:</strong> ${author_name}</li>
                ${fiscal_code ? `<li><strong>Fiscal Code/Tax ID:</strong> ${fiscal_code}</li>` : ''}
                ${ip ? `<li><strong>IP Address:</strong> ${ip}</li>` : ''}
                ${agreement_hash_sha256 ? `<li><strong>Digital Fingerprint:</strong> <code style="font-size: 11px;">${agreement_hash_sha256}</code></li>` : ''}
            </ul>
        </div>

        <p>Please find the signed agreement attached to this email as a PDF for your records.</p>

        <p style="font-size: 12px; color: #64748b; margin-top: 40px;">
            stAI tuned<br>
            <a href="${SITE_URL}">${SITE_URL}</a>
        </p>
    </div>
</body>
</html>
    `

    try {
        const payload: any = {
            from: FROM_EMAIL,
            to: email,
            cc: 'staituned.owner@gmail.com',
            subject,
            html,
        }

        if (pdfBuffer) {
            payload.attachments = [
                {
                    filename: `staituned-contributor-agreement-${accepted_at.split('T')[0]}.pdf`,
                    content: pdfBuffer,
                }
            ]
        }

        const { error } = await resend.emails.send(payload)

        if (error) {
            console.error('[Agreement Email] Resend error:', error)
            return false
        }
        return true
    } catch (err) {
        console.error('[Agreement Email] Failed to send:', err)
        return false
    }
}
