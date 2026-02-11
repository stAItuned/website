import { describe, expect, it } from 'vitest'
import { buildLinkedInAddCertificationUrl, buildLinkedInShareUrl } from './badgeAwardEmail'

describe('badgeAwardEmail helpers', () => {
  it('builds a LinkedIn share URL with encoded params', () => {
    const url = buildLinkedInShareUrl(
      'https://staituned.com/verify/STA-26-ABC123',
      'Gold Impact Badge · stAItuned',
      'Proud to share a badge from stAItuned.'
    )
    expect(url).toBe('https://www.linkedin.com/shareArticle?mini=true&url=https%3A%2F%2Fstaituned.com%2Fverify%2FSTA-26-ABC123&title=Gold+Impact+Badge+%C2%B7+stAItuned&summary=Proud+to+share+a+badge+from+stAItuned.&source=stAItuned')
  })

  it('returns the LinkedIn add certification URL', () => {
    expect(buildLinkedInAddCertificationUrl()).toBe('https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME')
  })
})
