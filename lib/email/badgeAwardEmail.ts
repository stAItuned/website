/**
 * Badge award email service (Resend).
 *
 * Sends a brand-oriented email when a contributor earns a badge.
 */

import { Resend } from 'resend'
import { getBadgeImageSource } from '@/lib/badges/badge-utils'
import type { Badge, ArticleMetricSnapshot } from '@/lib/types/badge'
import { BRAND } from '@/lib/brand'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'stAItuned <noreply@staituned.com>'
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? BRAND.url).replace(/\/+$/, '')

interface SendBadgeAwardEmailParams {
  email: string
  name?: string
  badge: Badge
  credentialId: string
  earnedAt: string
  articleMetrics?: ArticleMetricSnapshot[]
}

const LINKEDIN_ADD_CERT_URL = 'https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME'

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

/**
 * Build a LinkedIn share URL with optional prefilled text.
 */
export function buildLinkedInShareUrl(verifyUrl: string, title: string, summary: string): string {
  const params = new URLSearchParams({
    mini: 'true',
    url: verifyUrl,
    title,
    summary,
    source: 'stAItuned',
  })
  return `https://www.linkedin.com/shareArticle?${params.toString()}`
}

/**
 * Build a LinkedIn "Add Certification" URL.
 */
export function buildLinkedInAddCertificationUrl(): string {
  return LINKEDIN_ADD_CERT_URL
}

function formatIssueDate(earnedAt: string): string {
  const parsed = new Date(earnedAt)
  if (Number.isNaN(parsed.getTime())) return 'Unknown'
  return parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function getTierAccent(tier: Badge['tier']): { bg: string; text: string; ring: string } {
  switch (tier) {
    case 'gold':
      return { bg: '#FEF3C7', text: '#92400E', ring: '#F59E0B' }
    case 'silver':
      return { bg: '#F1F5F9', text: '#334155', ring: '#CBD5F5' }
    case 'bronze':
      return { bg: '#FEE2E2', text: '#7F1D1D', ring: '#F59E0B' }
    case 'special':
      return { bg: '#E0F2FE', text: '#075985', ring: '#38BDF8' }
    default:
      return { bg: '#EEF2FF', text: '#3730A3', ring: '#6366F1' }
  }
}

function buildVerificationUrl(credentialId: string): string {
  return `${SITE_URL}/verify/${encodeURIComponent(credentialId)}`
}

function generateBadgeEmailHtml(params: SendBadgeAwardEmailParams): string {
  const { name, badge, credentialId, earnedAt } = params
  const greeting = name ? `Hi ${name},` : 'Hi,'
  const verifyUrl = buildVerificationUrl(credentialId)
  const shareCopy = `Proud to share that I earned the ${badge.name.en} badge from stAItuned. Credential ID: ${credentialId}. Verify here: ${verifyUrl}`
  const shareTitle = `${badge.name.en} Badge · stAItuned`
  const shareUrl = buildLinkedInShareUrl(verifyUrl, shareTitle, shareCopy)
  const addCertUrl = buildLinkedInAddCertificationUrl()
  const badgeImage = `${SITE_URL}${getBadgeImageSource(badge.icon)}`
  const issueDate = formatIssueDate(earnedAt)
  const accent = getTierAccent(badge.tier)
  const criteriaSummary = badge.criteria
    .map((criteria) => `${criteria.value ? `${criteria.value} ` : ''}${criteria.label}`)
    .join(' · ')
  const qualifiedReadDefinition =
    'Qualified read = an article view with average time on page of 30 seconds or more (proxy).'
  const qualifiedReadHtml =
    badge.category === 'impact'
      ? `
      <div style="margin: 0 0 22px 0; padding: 12px 14px; border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 13px; color: #475569;">${qualifiedReadDefinition}</p>
      </div>
      `
      : ''

  const metrics = params.articleMetrics || []
  const topMetrics = [...metrics].sort((a, b) => b.pageViews - a.pageViews).slice(0, 5)
  const hasMoreArticles = metrics.length > 5

  const articlesHtml =
    topMetrics.length > 0
      ? `
      <div style="margin: 24px 0; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px;">
        <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em;">Contributing Articles</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr style="border-bottom: 2px solid #f1f5f9;">
              <th style="text-align: left; padding: 8px 0; color: #94a3b8; font-weight: 600;">Article</th>
              <th style="text-align: right; padding: 8px 0; color: #94a3b8; font-weight: 600;">Metric</th>
            </tr>
          </thead>
          <tbody>
            ${topMetrics
        .map(
          (m) => `
              <tr style="border-bottom: 1px solid #f8fafc;">
                <td style="padding: 10px 0; color: #475569; line-height: 1.4;">
                  <span style="font-weight: 600; color: #0f172a;">${m.title || m.slug.replaceAll('-', ' ')}</span><br/>
                  <span style="font-size: 11px; color: #94a3b8;">${m.url.replace('/learn/', '…/')}</span>
                </td>
                <td style="padding: 10px 0; text-align: right; vertical-align: middle;">
                  <span style="font-weight: 700; color: #0f172a;">${m.pageViews.toLocaleString()}</span>
                  <span style="font-size: 11px; color: #94a3b8;">${badge.category === 'impact' ? 'reads' : 'views'}</span>
                </td>
              </tr>
            `
        )
        .join('')}
          </tbody>
        </table>
        ${hasMoreArticles
        ? `
          <p style="margin: 12px 0 0 0; font-size: 12px; color: #94a3b8; font-style: italic; text-align: center;">
            ...and ${metrics.length - 5} other contributing articles.
          </p>
        `
        : ''
      }
      </div>
    `
      : ''

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You earned a badge on stAItuned</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #0f172a;">
  <div style="max-width: 640px; margin: 0 auto; padding: 36px 20px;">
    <div style="text-align: center; margin-bottom: 28px;">
      <img src="${SITE_URL}/assets/general/logo-text-dark.png" alt="stAItuned" style="height: 36px; width: auto;" />
    </div>

    <div style="background: white; border-radius: 18px; padding: 32px; box-shadow: 0 8px 24px rgba(15,23,42,0.08); border: 1px solid #e2e8f0;">
      <p style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.12em; color: #94a3b8;">Badge unlocked</p>
      <h1 style="margin: 0 0 12px 0; font-size: 26px; color: #0f172a;">${greeting} you earned the ${badge.name.en} badge.</h1>
      <p style="margin: 0 0 20px 0; font-size: 16px; color: #475569;">
        Thank you for contributing to the stAItuned mission of practical, high-impact AI education. This badge recognizes the tangible impact of your work and marks a clear milestone in your contributor journey.
      </p>
      <div style="margin: 0 0 22px 0; padding: 14px 16px; border-radius: 12px; background: #f1f5f9; border: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 14px; color: #0f172a; font-weight: 600;">Goal achieved</p>
        <p style="margin: 6px 0 0 0; font-size: 14px; color: #475569;">${badge.description.en}</p>
      </div>

      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 18px; border-radius: 24px; background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%); box-shadow: 0 16px 30px rgba(15, 23, 42, 0.25);">
          <img src="${badgeImage}" alt="${badge.name.en} badge" style="width: 220px; height: auto; border-radius: 18px; display: block; background: #fff;" />
          <div style="margin-top: 12px; padding: 6px 12px; border-radius: 999px; background: rgba(15, 23, 42, 0.8); color: #cbd5f5; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; display: inline-block;">
            ID ${credentialId}
          </div>
        </div>
        <div style="margin-top: 16px;">
          <div style="display: inline-block; padding: 6px 12px; border-radius: 999px; background: ${accent.bg}; color: ${accent.text}; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
            ${badge.tier} tier
          </div>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #475569;">
            ${criteriaSummary}
          </p>
        </div>
      </div>

      <div style="background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #0f172a;">Badge criteria</p>
        <ul style="margin: 0; padding-left: 18px; color: #475569; font-size: 13px; line-height: 1.6;">
          ${badge.criteria.map((criteria) => `<li>${criteria.label}${criteria.value ? `: ${criteria.value}` : ''}</li>`).join('')}
        </ul>
      </div>
      ${articlesHtml}
      ${qualifiedReadHtml}

      <div style="border: 1px solid #fde68a; background: #fffbeb; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
        <h2 style="margin: 0 0 10px 0; font-size: 18px; color: #92400e;">Share it on LinkedIn</h2>
        <p style="margin: 0 0 14px 0; font-size: 14px; color: #854d0e;">
          Help others discover stAItuned and the impact you create. The button below opens LinkedIn with a prefilled post and your verified credential link.
        </p>
        <a href="${shareUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: #1e293b; text-decoration: none; padding: 12px 24px; border-radius: 999px; font-weight: 700; font-size: 14px;">
          Share on LinkedIn
        </a>
        <div style="margin-top: 12px; font-size: 12px; color: #92400e; line-height: 1.6;">
          Suggested copy (ready to paste or tweak):
          <div style="margin-top: 6px; background: #fff7ed; padding: 10px; border-radius: 10px; font-family: 'Courier New', monospace; color: #7c2d12;">
            ${shareCopy}
          </div>
        </div>
      </div>

      <div style="border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin-bottom: 22px;">
        <h2 style="margin: 0 0 10px 0; font-size: 16px; color: #0f172a;">Add it to LinkedIn Certifications</h2>
        <ol style="margin: 0 0 12px 0; padding-left: 18px; font-size: 13px; color: #475569; line-height: 1.7;">
          <li>Go to your LinkedIn profile and click "Add profile section".</li>
          <li>Choose "Add licenses and certifications".</li>
          <li>Fill in the details below.</li>
        </ol>
        <div style="background: #f8fafc; border-radius: 10px; padding: 12px; font-size: 12px; color: #334155; line-height: 1.6;">
          Name: <strong>${badge.name.en}</strong><br/>
          Issuing organization: <strong>stAI tuned</strong><br/>
          Issue date: <strong>${issueDate}</strong><br/>
          Credential ID: <strong>${credentialId}</strong><br/>
          Credential URL: <strong>${verifyUrl}</strong>
        </div>
        <a href="${addCertUrl}" style="display: inline-block; margin-top: 12px; color: #1d4ed8; text-decoration: none; font-weight: 600; font-size: 13px;">
          Open LinkedIn add certification
        </a>
      </div>

      <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        <a href="${verifyUrl}" style="color: #1d4ed8; text-decoration: none; font-weight: 600; font-size: 13px;">
          View and verify credential
        </a>
      </div>
    </div>

    <div style="text-align: center; margin-top: 28px; padding: 12px;">
      <p style="margin: 0 0 6px 0; font-size: 12px; color: #94a3b8;">
        You received this email because you earned a badge on stAItuned.
      </p>
      <p style="margin: 0; font-size: 12px; color: #94a3b8;">
        <a href="${SITE_URL}/privacy" style="color: #94a3b8;">Privacy Policy</a> ·
        <a href="${SITE_URL}" style="color: #94a3b8;">${SITE_URL.replace('https://', '')}</a>
      </p>
    </div>
  </div>
</body>
</html>
`
}

function generateBadgeEmailText(params: SendBadgeAwardEmailParams): string {
  const { name, badge, credentialId, earnedAt } = params
  const greeting = name ? `Hi ${name},` : 'Hi,'
  const verifyUrl = buildVerificationUrl(credentialId)
  const shareCopy = `Proud to share that I earned the ${badge.name.en} badge from stAItuned. Credential ID: ${credentialId}. Verify here: ${verifyUrl}`
  const shareTitle = `${badge.name.en} Badge · stAItuned`
  const shareUrl = buildLinkedInShareUrl(verifyUrl, shareTitle, shareCopy)
  const addCertUrl = buildLinkedInAddCertificationUrl()
  const issueDate = formatIssueDate(earnedAt)
  const criteriaSummary = badge.criteria
    .map((criteria) => `${criteria.value ? `${criteria.value} ` : ''}${criteria.label}`)
    .join(' · ')
  const qualifiedReadDefinition =
    'Qualified read = an article view with average time on page of 30 seconds or more (proxy).'

  const metrics = params.articleMetrics || []
  const topMetrics = [...metrics].sort((a, b) => b.pageViews - a.pageViews).slice(0, 5)
  const hasMoreArticles = metrics.length > 5

  const articlesText =
    topMetrics.length > 0
      ? `
CONTRIBUTING ARTICLES:
${topMetrics
        .map(
          (m) =>
            `- ${m.title || m.slug.replaceAll('-', ' ')}: ${m.pageViews.toLocaleString()} ${badge.category === 'impact' ? 'reads' : 'views'} (${m.url})`
        )
        .join('\n')}
${hasMoreArticles ? `[...and ${metrics.length - 5} other contributing articles]` : ''}
`
      : ''

  return `
${greeting}

You earned the ${badge.name.en} badge on stAItuned.

Goal achieved: ${badge.description.en}
Criteria: ${criteriaSummary}

${articlesText}
${badge.category === 'impact' ? `Qualified read: ${qualifiedReadDefinition}` : ''}
Credential ID: ${credentialId}
Verify: ${verifyUrl}

Share on LinkedIn (prefilled): ${shareUrl}

Add it to LinkedIn Certifications:
1) Add profile section -> Add licenses and certifications
2) Name: ${badge.name.en}
3) Issuing organization: stAI tuned
4) Issue date: ${issueDate}
5) Credential ID: ${credentialId}
6) Credential URL: ${verifyUrl}

Open LinkedIn add certification: ${addCertUrl}

Thank you for supporting the stAItuned mission. Your contribution helps professionals learn practical AI and GenAI with clarity, rigor, and real-world impact.
${SITE_URL}
`
}

/**
 * Send a badge award email via Resend.
 */
export async function sendBadgeAwardEmail(params: SendBadgeAwardEmailParams): Promise<boolean> {
  const { email, badge } = params
  try {
    const resend = getResendClient()
    if (!resend) {
      console.error('[Badge Email] RESEND_API_KEY is missing')
      return false
    }

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `You earned the ${badge.name.en} badge — thank you for supporting the stAItuned mission`,
      html: generateBadgeEmailHtml(params),
      text: generateBadgeEmailText(params),
    })

    if (error) {
      console.error('[Badge Email] Resend error:', error)
      return false
    }

    console.log(`[Badge Email] Sent ${badge.id} badge email to ${email}`)
    return true
  } catch (err) {
    console.error('[Badge Email] Failed to send email:', err)
    return false
  }
}
