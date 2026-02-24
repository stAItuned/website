import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { NextRequest } from 'next/server'
import { GET } from './route'
import { db } from '@/lib/firebase/admin'
import { createWaitlistOptInToken } from '@/lib/security/waitlistDoubleOptIn'

vi.mock('@/lib/firebase/admin', () => ({
  db: vi.fn(),
}))

function createReq(url: string): NextRequest {
  const parsed = new URL(url)
  return {
    nextUrl: parsed,
  } as unknown as NextRequest
}

describe('api/career-os/waitlist/confirm route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    process.env.WAITLIST_OPTIN_SECRET = 'test-secret'
    process.env.NEXT_PUBLIC_SITE_URL = 'https://staituned.com'

    const set = vi.fn(async () => undefined)
    const doc = vi.fn(() => ({ set }))
    const collection = vi.fn(() => ({ doc }))
    vi.mocked(db).mockReturnValue({ collection } as unknown as ReturnType<typeof db>)
  })

  it('redirects to invalid status when token is invalid', async () => {
    const response = await GET(createReq('https://staituned.com/api/career-os/waitlist/confirm?token=invalid'))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/career-os?lang=it&waitlist=waitlist-invalid-token')
  })

  it('confirms marketing consent and redirects to success status', async () => {
    const token = createWaitlistOptInToken({
      email: 'john@example.com',
      intentKey: '1to1:Pro',
      locale: 'en',
    })
    expect(token).toBeTruthy()

    const response = await GET(createReq(`https://staituned.com/api/career-os/waitlist/confirm?token=${encodeURIComponent(token as string)}`))

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/career-os?lang=en&waitlist=waitlist-marketing-confirmed')
  })
})
