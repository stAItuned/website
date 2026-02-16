
import { describe, expect, it } from 'vitest'
import { buildLinkedInAddCertificationUrl, buildLinkedInShareUrl, generateBadgeEmailHtml } from './badgeAwardEmail'
import type { Badge } from '@/lib/types/badge'

describe('badgeAwardEmail helpers', () => {
  it('builds a LinkedIn share URL with feed intent', () => {
    const url = buildLinkedInShareUrl(
      'https://staituned.com/verify/STA-26-ABC123',
      'Gold Impact'
    )
    expect(url).toContain('https://www.linkedin.com/feed/?shareActive=true&text=')
    // URL should contain encoded badge name and verify URL in the text
    expect(url).toContain(encodeURIComponent('Gold Impact'))
    expect(url).toContain(encodeURIComponent('https://staituned.com/verify/STA-26-ABC123'))
  })

  it('builds the complete LinkedIn add certification URL', () => {
    const badge: Badge = {
      id: 'gold-impact',
      category: 'impact',
      tier: 'gold',
      name: { en: 'Gold Impact Writer', it: 'Gold Impact Writer' },
      description: { en: 'Desc', it: 'Desc' },
      icon: 'gold-impact',
      criteria: [],
      thresholds: { qualifiedReads: 5000 }
    }
    const earnedAt = '2025-01-15T12:00:00Z'
    const verifyUrl = 'https://staituned.com/verify/123'
    const credentialId = 'STA-123'

    const url = buildLinkedInAddCertificationUrl(badge, credentialId, earnedAt, verifyUrl)

    // Basic structure
    expect(url).toContain('https://www.linkedin.com/profile/add?')
    expect(url).toContain('startTask=CERTIFICATION_NAME')

    // Parameters
    expect(url).toContain('name=Gold+Impact+Writer')
    expect(url).toContain('organizationName=stAItuned')
    // 2025-01-15 -> Year 2025, Month 0 (Jan) + 1 = 1
    expect(url).toContain('issueYear=2025')
    expect(url).toContain('issueMonth=1')
    expect(url).toContain('certUrl=https%3A%2F%2Fstaituned.com%2Fverify%2F123')
    expect(url).toContain('certId=STA-123')
  })

  it('generates HTML with credential ID and verify link inside the badge card', () => {
    const badge: Badge = {
      id: 'gold-impact',
      category: 'impact',
      tier: 'gold',
      name: { en: 'Gold Impact Writer', it: 'Gold Impact Writer' },
      description: { en: 'A great badge', it: 'A great badge' },
      icon: 'gold-impact',
      criteria: [{ label: '10 Articles' }],
      thresholds: { qualifiedReads: 5000 }
    }
    const credentialId = 'STA-TEST-123'

    const html = generateBadgeEmailHtml({
      email: 'test@example.com',
      badge,
      credentialId,
      earnedAt: '2025-01-01T00:00:00Z',
      name: 'Test User'
    })

    // Check for credential ID
    expect(html).toContain('Credential ID')
    expect(html).toContain('STA-TEST-123')

    // Check for Verify Link
    expect(html).toContain('View Verified Badge')
    expect(html).toContain(encodeURIComponent('STA-TEST-123')) // part of the link
  })
})
