/**
 * Email Service for Role Fit Audit
 * 
 * Sends personalized report emails using Resend
 * Includes PDF report as attachment
 */

import { Resend } from 'resend'
import type { AuditResult } from '@/app/(public)/role-fit-audit/lib/scoring'
import { generateRoleFitAuditPDF } from '../pdf/generatePDF'

// =============================================================================
// Resend Client
// =============================================================================

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

// Email sender configuration
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'stAItuned <noreply@staituned.com>'

// =============================================================================
// Types
// =============================================================================

interface SendReportEmailParams {
  email: string
  name?: string
  result: AuditResult
}

// =============================================================================
// Email Template
// =============================================================================

function generateReportEmailHtml(name: string | undefined, result: AuditResult): string {
  const { normalizedScores, archetype, roleRecommendation, topGaps, readinessLabel, oneLineDiagnosis } = result

  const greeting = name ? `Ciao ${name}!` : 'Ciao!'

  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Il tuo Role Fit Audit - stAItuned</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <img src="https://staituned.com/assets/general/logo-text-dark.png" alt="stAItuned" style="height: 40px; width: auto;" />
    </div>

    <!-- Main Card -->
    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      
      <!-- Greeting -->
      <h1 style="font-size: 24px; margin: 0 0 16px 0; color: #1e293b;">${greeting}</h1>
      <p style="font-size: 16px; color: #64748b; margin: 0 0 24px 0;">
        Ecco il tuo report Role Fit Audit. Questo è il tuo punto di partenza verso una carriera GenAI.
      </p>

      <!-- One-line Diagnosis -->
      <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 16px; color: #1e293b; line-height: 1.6;">
          ${oneLineDiagnosis.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #d97706;">$1</strong>')}
        </p>
      </div>

      <!-- PDF Attachment Note -->
      <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center;">
        <p style="margin: 0 0 6px 0; font-size: 14px; color: #166534;">
          📎 <strong>Report PDF allegato</strong>
        </p>
        <p style="margin: 0; font-size: 13px; color: #15803d;">
          Aprilo per l'analisi approfondita del tuo profilo, la strategia di carriera e consigli personalizzati!
        </p>
      </div>

      <!-- Archetype -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 18px; margin: 0 0 8px 0; color: #1e293b;">
          🎯 Il tuo archetipo: ${archetype.name}
        </h2>
        <p style="font-size: 14px; color: #f59e0b; font-style: italic; margin: 0 0 12px 0;">
          "${archetype.tagline}"
        </p>
        <p style="font-size: 14px; color: #64748b; margin: 0;">
          <strong>Superpower:</strong> ${archetype.superpower}
        </p>
      </div>

      <!-- Scores -->
      <div style="margin-bottom: 24px; padding: 20px; background: #f8fafc; border-radius: 12px;">
        <h3 style="font-size: 16px; margin: 0 0 16px 0; color: #1e293b;">📊 I tuoi score</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #64748b;">⚙️ Code</td>
            <td style="padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">${normalizedScores.code}/100</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #64748b;">📊 Data</td>
            <td style="padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">${normalizedScores.data}/100</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #64748b;">💡 Product</td>
            <td style="padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">${normalizedScores.product}/100</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-size: 14px; color: #64748b;">🤖 GenAI</td>
            <td style="padding: 8px 0; font-size: 14px; font-weight: bold; text-align: right;">${normalizedScores.genai}/100</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8f0;">
            <td style="padding: 12px 0 0 0; font-size: 14px; color: #1e293b; font-weight: bold;">Readiness</td>
            <td style="padding: 12px 0 0 0; font-size: 14px; font-weight: bold; text-align: right; color: #f59e0b;">${readinessLabel}</td>
          </tr>
        </table>
      </div>

      <!-- Role Recommendations -->
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 16px; margin: 0 0 12px 0; color: #1e293b;">🎯 Ruoli consigliati</h3>
        <div style="display: flex; gap: 16px;">
          <div style="flex: 1; background: #fef3c7; padding: 16px; border-radius: 12px;">
            <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; color: #92400e; text-transform: uppercase;">NOW</p>
            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #1e293b;">${roleRecommendation.now}</p>
          </div>
          <div style="flex: 1; background: #f1f5f9; padding: 16px; border-radius: 12px;">
            <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: bold; color: #64748b; text-transform: uppercase;">NEXT</p>
            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #1e293b;">${roleRecommendation.next}</p>
          </div>
        </div>
      </div>

      <!-- Top Gaps -->
      ${topGaps.length > 0 ? `
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 16px; margin: 0 0 12px 0; color: #1e293b;">🚧 Top 3 gap da colmare</h3>
        ${topGaps.map((gap, i) => `
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 8px; border-left: 3px solid #ef4444;">
          <p style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #1e293b;">${i + 1}. ${gap.title}</p>
          <p style="margin: 0; font-size: 13px; color: #64748b;">
            <strong style="color: #f59e0b;">Fix 7 giorni:</strong> ${gap.fix7Days}
          </p>
        </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- CTA -->
      <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
        <h3 style="font-size: 18px; margin: 0 0 8px 0; color: #1e293b;">Vuoi il piano personalizzato?</h3>
        <p style="font-size: 14px; color: #64748b; margin: 0 0 16px 0;">
          Con Career OS ottieni una roadmap completa, review 1:1 del tuo profilo, e supporto per arrivare al colloquio.
        </p>
        <a href="https://staituned.com/career-os#candidati" 
           style="display: inline-block; background: linear-gradient(135deg, #fef3c7 0%, #f59e0b 100%); color: #1e293b; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: bold; font-size: 15px;">
          Applica al Career OS →
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; padding: 20px;">
      <p style="margin-bottom: 16px;">
        <a href="https://www.linkedin.com/company/stai-tuned" style="text-decoration: none; margin-right: 16px;">
          <img src="https://staituned.com/assets/general/linkedin.png" alt="LinkedIn" style="height: 24px; width: auto; opacity: 0.8;" />
        </a>
        <a href="https://staituned.com" style="text-decoration: none;">
          <img src="https://staituned.com/assets/general/logo-dark.png" alt="Website" style="height: 24px; width: auto; opacity: 0.8;" />
        </a>
      </p>
      <p style="font-size: 12px; color: #94a3b8; margin: 0 0 8px 0;">
        Ricevi questa email perché hai completato il Role Fit Audit su stAItuned.
      </p>
      <p style="font-size: 12px; color: #94a3b8; margin: 0;">
        <a href="https://staituned.com/privacy" style="color: #94a3b8;">Privacy Policy</a> · 
        <a href="https://staituned.com" style="color: #94a3b8;">staituned.com</a>
      </p>
    </div>

  </div>
</body>
</html>
`
}

function generateReportEmailText(name: string | undefined, result: AuditResult): string {
  const { normalizedScores, archetype, roleRecommendation, topGaps, readinessLabel } = result

  const greeting = name ? `Ciao ${name}!` : 'Ciao!'

  return `
${greeting}

Ecco il tuo report Role Fit Audit.

=== IL TUO ARCHETIPO ===
${archetype.name}: "${archetype.tagline}"
Superpower: ${archetype.superpower}

=== I TUOI SCORE ===
Code: ${normalizedScores.code}/100
Data: ${normalizedScores.data}/100
Product: ${normalizedScores.product}/100
GenAI: ${normalizedScores.genai}/100
Readiness: ${readinessLabel}

=== RUOLI CONSIGLIATI ===
NOW: ${roleRecommendation.now}
NEXT: ${roleRecommendation.next}

=== TOP GAP DA COLMARE ===
${topGaps.map((gap, i) => `${i + 1}. ${gap.title} - Fix 7 giorni: ${gap.fix7Days}`).join('\n')}

---

Vuoi il piano personalizzato? Applica al Career OS:
https://staituned.com/career-os#candidati

---

Ricevi questa email perché hai completato il Role Fit Audit su stAItuned.
https://staituned.com
`
}

// =============================================================================
// Send Email Function
// =============================================================================

export async function sendRoleFitAuditReportEmail(params: SendReportEmailParams): Promise<boolean> {
  const { email, name, result } = params
  const resend = getResendClient()

  if (!resend) {
    console.error('[Role Fit Audit] CRITICAL: RESEND_API_KEY is missing in process.env')
    return false
  }

  try {
    // Generate PDF report
    let pdfBuffer: Buffer | null = null
    try {
      pdfBuffer = await generateRoleFitAuditPDF(result, name)
      console.log(`[Role Fit Audit] PDF generated successfully (${pdfBuffer.length} bytes)`)
    } catch (pdfError) {
      console.error('[Role Fit Audit] PDF generation failed, sending without attachment:', pdfError)
    }

    // Build email options
    const emailOptions = {
      from: FROM_EMAIL,
      to: email,
      subject: `🎯 Il tuo Role Fit Audit: sei un ${result.archetype.name}`,
      html: generateReportEmailHtml(name, result),
      text: generateReportEmailText(name, result),
    }

    const payload = pdfBuffer
      ? {
          ...emailOptions,
          attachments: [
            {
              filename: `role-fit-audit-${result.archetype.id}.pdf`,
              content: pdfBuffer,
            },
          ],
        }
      : emailOptions

    const { error } = await resend.emails.send(payload)

    if (error) {
      console.error('Resend error:', error)
      return false
    }

    console.log(`[Role Fit Audit] Email sent successfully to: ${email} (PDF attached: ${!!pdfBuffer})`)
    return true
  } catch (err) {
    console.error('Failed to send Role Fit Audit email:', err)
    return false
  }
}
