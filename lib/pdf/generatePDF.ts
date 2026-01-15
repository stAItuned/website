import { renderToBuffer } from '@react-pdf/renderer'
import type { AuditResult } from '@/app/(public)/role-fit-audit/lib/scoring'

/**
 * Generate a PDF buffer for the Role Fit Audit report
 * This runs server-side in the API route
 */
export async function generateRoleFitAuditPDF(
    result: AuditResult,
    name?: string
): Promise<Buffer> {
    // Dynamic import to avoid Next.js Server Action inference on the component
    const { RoleFitAuditPDFDocument } = await import('./RoleFitAuditPDF')

    const pdfBuffer = await renderToBuffer(
        RoleFitAuditPDFDocument({ result, name })
    )
    return Buffer.from(pdfBuffer)
}
