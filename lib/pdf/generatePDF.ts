import { renderToBuffer } from '@react-pdf/renderer'
import type { AuditResult } from '@/app/(public)/role-fit-audit/lib/scoring'

/**
 * Generate a PDF buffer for the Role Fit Audit report
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

/**
 * Generate a PDF buffer for the Contributor Agreement
 */
export async function generateContributorAgreementPDF(params: {
    legalName: string
    email: string
    date: string
    version: string
    agreementText: string
    language: 'it' | 'en'
    fiscalCode?: string
    hash?: string
}): Promise<Buffer> {
    const { ContributorAgreementPDF } = await import('./ContributorAgreementPDF')
    const pdfBuffer = await renderToBuffer(
        ContributorAgreementPDF(params)
    )
    return Buffer.from(pdfBuffer)
}
