/**
 * Email Service for Role Fit Audit
 */

import { Resend } from 'resend'
import type { AuditResult } from '@/app/(public)/role-fit-audit/lib/scoring'
import { generateRoleFitAuditPDF } from '../pdf/generatePDF'
import { roleFitAuditTranslations, type RoleFitLocale } from '@/lib/i18n/role-fit-audit-translations'
import { sendTelegramFeedback } from '@/lib/telegram'

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'stAItuned <noreply@staituned.com>'
interface SendReportEmailParams {
  email: string
  name?: string
  result: AuditResult
  locale: RoleFitLocale
  internalAlert: {
    submissionId: string
    generatedBy: string
    readinessLabel: string
    archetypeId: string
    createdAt: string
  }
}

function formatGreeting(locale: RoleFitLocale, name?: string): string {
  const t = roleFitAuditTranslations[locale].email
  if (name) return t.greetingNamed.replace('{name}', name)
  return t.greetingGeneric
}

function generateReportEmailHtml(name: string | undefined, result: AuditResult, locale: RoleFitLocale): string {
  const { normalizedScores, archetype, roleRecommendation, topGaps, readinessLabel, oneLineDiagnosis } = result
  const t = roleFitAuditTranslations[locale].email
  const greeting = formatGreeting(locale, name)

  return `
<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title} - stAItuned</title>
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background:#f8fafc;color:#1e293b;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <img src="https://staituned.com/assets/general/logo-text-dark.png" alt="stAItuned" style="height:40px;width:auto;" />
    </div>

    <div style="background:white;border-radius:16px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
      <h1 style="font-size:24px;margin:0 0 16px 0;color:#1e293b;">${greeting}</h1>
      <p style="font-size:16px;color:#64748b;margin:0 0 24px 0;">${t.intro}</p>

      <div style="background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%);border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0;font-size:16px;color:#1e293b;line-height:1.6;">${oneLineDiagnosis.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#d97706;">$1</strong>')}</p>
      </div>

      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
        <p style="margin:0 0 6px 0;font-size:14px;color:#166534;">📎 <strong>${t.attachmentTitle}</strong></p>
        <p style="margin:0;font-size:13px;color:#15803d;">${t.attachmentSubtitle}</p>
      </div>

      <div style="margin-bottom:24px;">
        <h2 style="font-size:18px;margin:0 0 8px 0;color:#1e293b;">🎯 ${t.archetype}: ${archetype.name}</h2>
        <p style="font-size:14px;color:#f59e0b;font-style:italic;margin:0 0 12px 0;">
          "${archetype.tagline.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#d97706;">$1</strong>')}"
        </p>
        <p style="font-size:14px;color:#64748b;margin:0;"><strong>Superpower:</strong> ${archetype.superpower}</p>
      </div>

      <div style="margin-bottom:24px;padding:20px;background:#f8fafc;border-radius:12px;">
        <h3 style="font-size:16px;margin:0 0 16px 0;color:#1e293b;">📊 ${t.scores}</h3>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;font-size:14px;color:#64748b;">⚙️ Code</td><td style="padding:8px 0;font-size:14px;font-weight:bold;text-align:right;">${normalizedScores.code}/100</td></tr>
          <tr><td style="padding:8px 0;font-size:14px;color:#64748b;">📊 Data</td><td style="padding:8px 0;font-size:14px;font-weight:bold;text-align:right;">${normalizedScores.data}/100</td></tr>
          <tr><td style="padding:8px 0;font-size:14px;color:#64748b;">💡 Product</td><td style="padding:8px 0;font-size:14px;font-weight:bold;text-align:right;">${normalizedScores.product}/100</td></tr>
          <tr><td style="padding:8px 0;font-size:14px;color:#64748b;">🤖 GenAI</td><td style="padding:8px 0;font-size:14px;font-weight:bold;text-align:right;">${normalizedScores.genai}/100</td></tr>
          <tr style="border-top:1px solid #e2e8f0;"><td style="padding:12px 0 0 0;font-size:14px;color:#1e293b;font-weight:bold;">${t.readiness}</td><td style="padding:12px 0 0 0;font-size:14px;font-weight:bold;text-align:right;color:#f59e0b;">${readinessLabel}</td></tr>
        </table>
      </div>

      <div style="margin-bottom:24px;">
        <h3 style="font-size:16px;margin:0 0 12px 0;color:#1e293b;">🎯 ${t.roles}</h3>
        <div style="display:flex;gap:16px;">
          <div style="flex:1;background:#fef3c7;padding:16px;border-radius:12px;">
            <p style="margin:0 0 4px 0;font-size:12px;font-weight:bold;color:#92400e;text-transform:uppercase;">${t.now}</p>
            <p style="margin:0;font-size:14px;font-weight:bold;color:#1e293b;">${roleRecommendation.now}</p>
          </div>
          <div style="flex:1;background:#f1f5f9;padding:16px;border-radius:12px;">
            <p style="margin:0 0 4px 0;font-size:12px;font-weight:bold;color:#64748b;text-transform:uppercase;">${t.next}</p>
            <p style="margin:0;font-size:14px;font-weight:bold;color:#1e293b;">${roleRecommendation.next}</p>
          </div>
        </div>
      </div>

      ${topGaps.length > 0
        ? `<div style="margin-bottom:24px;">
        <h3 style="font-size:16px;margin:0 0 12px 0;color:#1e293b;">🚧 ${t.gaps}</h3>
        ${topGaps
          .map(
            (gap, i) => `<div style="background:#f8fafc;padding:16px;border-radius:8px;margin-bottom:8px;border-left:3px solid #ef4444;">
          <p style="margin:0 0 4px 0;font-size:14px;font-weight:bold;color:#1e293b;">${i + 1}. ${gap.title}</p>
          <p style="margin:0;font-size:13px;color:#64748b;"><strong style="color:#f59e0b;">${t.fixIn7Days}:</strong> ${gap.fix7Days}</p>
        </div>`
          )
          .join('')}
      </div>`
        : ''}

      <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid #e2e8f0;">
        <h3 style="font-size:18px;margin:0 0 8px 0;color:#1e293b;">${t.ctaTitle}</h3>
        <p style="font-size:14px;color:#64748b;margin:0 0 16px 0;">${t.ctaBody}</p>
        <a href="https://staituned.com/career-os#candidati" style="display:inline-block;background:linear-gradient(135deg,#fef3c7 0%,#f59e0b 100%);color:#1e293b;text-decoration:none;padding:14px 32px;border-radius:50px;font-weight:bold;font-size:15px;">${t.ctaButton}</a>
      </div>
    </div>

    <div style="text-align:center;margin-top:32px;padding:20px;">
      <p style="margin-bottom:16px;">
        <a href="https://www.linkedin.com/company/stai-tuned" style="text-decoration:none;margin-right:16px;"><img src="https://staituned.com/assets/general/linkedin.png" alt="LinkedIn" style="height:24px;width:auto;opacity:.8;" /></a>
        <a href="https://staituned.com" style="text-decoration:none;"><img src="https://staituned.com/assets/general/logo-dark.png" alt="Website" style="height:24px;width:auto;opacity:.8;" /></a>
      </p>
      <p style="font-size:12px;color:#94a3b8;margin:0 0 8px 0;">${t.complianceLine}</p>
      <p style="font-size:12px;color:#94a3b8;margin:0;"><a href="https://staituned.com/privacy" style="color:#94a3b8;">${t.privacy}</a> · <a href="https://staituned.com/terms" style="color:#94a3b8;">${t.terms}</a></p>
    </div>
  </div>
</body>
</html>
`
}

function generateReportEmailText(name: string | undefined, result: AuditResult, locale: RoleFitLocale): string {
  const { normalizedScores, archetype, roleRecommendation, topGaps, readinessLabel } = result
  const t = roleFitAuditTranslations[locale].email
  const greeting = formatGreeting(locale, name)

  return `
${greeting}

${t.title}

${t.archetype}: ${archetype.name} - "${archetype.tagline.replace(/\*\*(.*?)\*\*/g, '$1')}"

${t.scores}
Code: ${normalizedScores.code}/100
Data: ${normalizedScores.data}/100
Product: ${normalizedScores.product}/100
GenAI: ${normalizedScores.genai}/100
${t.readiness}: ${readinessLabel}

${t.roles}
${t.now}: ${roleRecommendation.now}
${t.next}: ${roleRecommendation.next}

${t.gaps}
${topGaps.map((gap, i) => `${i + 1}. ${gap.title} - ${t.fixIn7Days}: ${gap.fix7Days}`).join('\n')}

${t.ctaTitle}
https://staituned.com/career-os#candidati

${t.complianceLine}
https://staituned.com
`
}

export async function sendRoleFitAuditReportEmail(params: SendReportEmailParams): Promise<boolean> {
  const { email, name, result, locale, internalAlert } = params
  const resend = getResendClient()

  if (!resend) {
    console.error('[Role Fit Audit] CRITICAL: RESEND_API_KEY is missing in process.env')
    return false
  }

  try {
    let pdfBuffer: Buffer | null = null
    try {
      pdfBuffer = await generateRoleFitAuditPDF(result, locale, name)
      console.log(`[Role Fit Audit] PDF generated successfully (${pdfBuffer.length} bytes)`)
    } catch (pdfError) {
      console.error('[Role Fit Audit] PDF generation failed, sending without attachment:', pdfError)
    }

    const emailT = roleFitAuditTranslations[locale].email
    const payloadBase = {
      from: FROM_EMAIL,
      to: email,
      subject: `🎯 ${emailT.subjectPrefix}: ${result.archetype.name}`,
      html: generateReportEmailHtml(name, result, locale),
      text: generateReportEmailText(name, result, locale),
    }

    const payload = pdfBuffer
      ? {
          ...payloadBase,
          attachments: [
            {
              filename: `${emailT.pdfFilenamePrefix}-${result.archetype.id.toLowerCase()}.pdf`,
              content: pdfBuffer,
            },
          ],
        }
      : payloadBase

    const { error } = await resend.emails.send(payload)

    if (error) {
      console.error('Resend error:', error)
      return false
    }

    const internalMessage = [
      '🎯 Role Fit report sent',
      '',
      `🆔 Submission: ${internalAlert.submissionId}`,
      `⚙️ Engine: ${internalAlert.generatedBy}`,
      `📊 Readiness: ${internalAlert.readinessLabel}`,
      `🏷 Archetype: ${internalAlert.archetypeId}`,
      `🕒 CreatedAt: ${internalAlert.createdAt}`,
    ].join('\n')

    await sendTelegramFeedback({
      category: 'role_fit_audit_internal',
      message: internalMessage,
      page: '/role-fit-audit',
    })

    console.log(`[Role Fit Audit] Email sent successfully to: ${email} (PDF attached: ${!!pdfBuffer})`)
    return true
  } catch (err) {
    console.error('Failed to send Role Fit Audit email:', err)
    return false
  }
}
