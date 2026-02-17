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

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

/**
 * Build a LinkedIn Link (Feed Share) URL.
 * This is better than shareArticle for pre-filling text.
 */
export function buildLinkedInShareUrl(verifyUrl: string, badgeName: string): string {
  const text = `I'm excited to share that I've earned the ${badgeName} badge on stAItuned! 🚀\n\nIt represents my commitment to practical AI education and community contribution.\n\nVerify my credential here:`
  const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}%20${encodeURIComponent(verifyUrl)}`
  return url
}

/**
 * Build a LinkedIn "Add Certification" URL.
 */
export function buildLinkedInAddCertificationUrl(badge: Badge, credentialId: string, earnedAt: string, verifyUrl: string): string {
  const date = new Date(earnedAt)
  const issueYear = date.getFullYear()
  const issueMonth = date.getMonth() + 1 // 1-12

  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: badge.name.en,
    organizationName: 'stAItuned',
    organizationId: '101346338', // Attempting to use the ID for stAI tuned if valid, otherwise it might be ignored or require manual input.
    issueYear: issueYear.toString(),
    issueMonth: issueMonth.toString(),
    certUrl: verifyUrl,
    certId: credentialId,
  })

  return `https://www.linkedin.com/profile/add?${params.toString()}`
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

function getNextGoalMessage(badge: Badge): string | null {
  if (badge.category === 'contribution') {
    if (badge.tier === 'contributor') return 'Next milestone: Bronze Writer (10 articles). Keep it up!'
    if (badge.tier === 'bronze') return 'Next milestone: Silver Writer (30 articles). You can do it!'
    if (badge.tier === 'silver') return 'Next milestone: Gold Writer (50 articles). Legend status awaits!'
  }
  if (badge.category === 'impact') {
    if (badge.tier === 'bronze') return 'Aim for Silver Impact: 2,000 qualified reads on a single article.'
    if (badge.tier === 'silver') return 'Aim for Gold Impact: 5,000 qualified reads. That sets you apart.'
  }
  return null
}

export function generateBadgeEmailHtml(params: SendBadgeAwardEmailParams): string {
  const { name, badge, credentialId, earnedAt } = params
  const greeting = name ? `Hi ${name},` : 'Hi,'
  const verifyUrl = buildVerificationUrl(credentialId)

  const shareUrl = buildLinkedInShareUrl(verifyUrl, badge.name.en)
  const addCertUrl = buildLinkedInAddCertificationUrl(badge, credentialId, earnedAt, verifyUrl)

  const badgeImage = `${SITE_URL}${getBadgeImageSource(badge.icon)}`
  const issueDate = formatIssueDate(earnedAt)
  const accent = getTierAccent(badge.tier)
  const nextGoalMsg = getNextGoalMessage(badge)

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
      <a href="${SITE_URL}" style="text-decoration: none;">
        <img src="${SITE_URL}/assets/general/logo-text-dark.png" alt="stAItuned" style="height: 36px; width: auto;" />
      </a>
    </div>

    <div style="background: white; border-radius: 18px; padding: 32px; box-shadow: 0 8px 24px rgba(15,23,42,0.08); border: 1px solid #e2e8f0;">
      <p style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.12em; color: #94a3b8; text-align: center;">Badge unlocked</p>
      <h1 style="margin: 0 0 12px 0; font-size: 26px; color: #0f172a; text-align: center;">${greeting} you earned the ${badge.name.en} badge! 🏆</h1>
      <p style="margin: 0 0 20px 0; font-size: 16px; color: #475569; text-align: center;">
        Your contributions are making a real impact. This badge recognizes your effort in sharing practical AI knowledge with our community.
      </p>

      <div style="text-align: center; margin-bottom: 28px;">
        <div style="display: inline-block; padding: 24px; border-radius: 24px; background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%); border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          <img src="${badgeImage}" alt="${badge.name.en} badge" style="width: 200px; height: auto; display: block; margin: 0 auto;" />
          <div style="margin-top: 16px;">
             <span style="display: inline-block; padding: 6px 12px; border-radius: 99px; background: ${accent.bg}; color: ${accent.text}; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">
              ${badge.tier} Tier
            </span>
          </div>
          <p style="margin: 12px 0 0 0; font-size: 15px; font-weight: 600; color: #0f172a;">
            ${badge.description.en}
          </p>
          <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">
            ${criteriaSummary}
          </p>

          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed #e2e8f0;">
            <p style="margin: 0; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 0.05em;">Credential ID</p>
            <p style="margin: 2px 0 8px 0; font-family: monospace; font-size: 14px; color: #334155;">${credentialId}</p>
            <a href="${verifyUrl}" style="display: inline-block; font-size: 13px; color: #2563eb; text-decoration: none; font-weight: 600;">View Verified Badge →</a>
          </div>
        </div>
      </div>

      <!-- Call to Action Section -->
      <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; margin-bottom: 32px;">
         <a href="${shareUrl}" style="display: inline-flex; align-items: center; justify-content: center; background: #0077b5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(0, 119, 181, 0.25);">
           <!-- LinkedIn Icon SVG -->
           <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" alt="In" style="height: 16px; width: 16px; margin-right: 8px; filter: brightness(0) invert(1);" /> 
           Share on LinkedIn
        </a>
        <a href="${addCertUrl}" style="display: inline-flex; align-items: center; justify-content: center; background: white; border: 1px solid #cbd5e1; color: #334155; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 15px; transition: all 0.2s;">
           Add to Profile
        </a>
      </div>

      ${nextGoalMsg ? `
      <div style="margin: 0 0 24px 0; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 16px; text-align: center;">
        <p style="margin: 0; font-size: 14px; color: #0369a1; font-weight: 600;">
          🚀 What's Next?
        </p>
        <p style="margin: 4px 0 0 0; font-size: 14px; color: #0c4a6e; font-weight: 500;">
          ${nextGoalMsg}
        </p>
        <div style="margin-top: 12px;">
           <a href="${SITE_URL}/write" style="font-size: 13px; color: #0284c7; text-decoration: none; font-weight: 600;">Write your next article →</a>
        </div>
      </div>
      ` : ''}

      <div style="border-top: 1px solid #e2e8f0; margin-top: 24px; padding-top: 24px;">
         ${articlesHtml}
         ${qualifiedReadHtml}
         
         <div style="background: #f8fafc; border-radius: 12px; padding: 16px; font-size: 13px; color: #475569;">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #0f172a;">Verification Details</p>
            <div style="display: flex; flex-wrap: wrap; gap: 8px 24px; align-items: baseline;">
              <div>
               <span style="color: #94a3b8; margin-right: 4px;">Credential ID:</span>
               <span style="font-family: monospace; color: #0f172a;">${credentialId}</span>
              </div>
              <div>
               <span style="color: #94a3b8; margin-right: 4px;">Issued On:</span>
               <span>${issueDate}</span>
              </div>
              <div style="width: 100%; margin-top: 4px;">
                <a href="${verifyUrl}" style="color: #2563eb; text-decoration: none; font-size: 12px; word-break: break-all;">${verifyUrl}</a>
              </div>
            </div>
         </div>
      </div>

    </div>

    <div style="text-align: center; margin-top: 28px; padding: 12px;">
      <p style="margin: 0 0 6px 0; font-size: 12px; color: #94a3b8;">
        You received this email because you earned a badge on stAItuned.
      </p>
      <p style="margin: 0; font-size: 12px; color: #94a3b8;">
        <a href="${SITE_URL}/privacy" style="color: #94a3b8;">Privacy Policy</a> ·
        <a href="${SITE_URL}" style="color: #94a3b8;">stAItuned.com</a>
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
  const shareUrl = buildLinkedInShareUrl(verifyUrl, badge.name.en)
  const addCertUrl = buildLinkedInAddCertificationUrl(badge, credentialId, earnedAt, verifyUrl)
  const issueDate = formatIssueDate(earnedAt)
  const nextGoalMsg = getNextGoalMessage(badge)

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

You earned the ${badge.name.en} badge on stAItuned! 🏆

This recognizes your contribution to practical AI education.

Badge Details:
- Name: ${badge.name.en}
- Tier: ${badge.tier}
- Date: ${issueDate}
- ID: ${credentialId}
- Verify: ${verifyUrl}

${badge.description.en}
(${criteriaSummary})

${nextGoalMsg ? `\n> ${nextGoalMsg}\n` : ''}

--------------------------------------------------
SHARE YOUR SUCCESS
--------------------------------------------------

1. Share on LinkedIn:
${shareUrl}

2. Add to LinkedIn Certifications:
${addCertUrl}

(Or add manually: Name: ${badge.name.en}, Issuing Org: stAItuned, Date: ${issueDate}, ID: ${credentialId}, URL: ${verifyUrl})

--------------------------------------------------
${articlesText}
${badge.category === 'impact' ? `Qualified read: ${qualifiedReadDefinition}\n` : ''}

Thank you for being a valued contributor.
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
      subject: `You earned the ${badge.name.en} badge! 🏆`,
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
