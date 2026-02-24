import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { NextRequest } from 'next/server'
import { POST } from './route'
import { db } from '@/lib/firebase/admin'
import { sendTelegramFeedback } from '@/lib/telegram'
import { sendCareerOSWaitlistInternalEmail } from '@/lib/email/careerOSWaitlistEmail'
import { sendCareerOSWaitlistOptInEmail } from '@/lib/email/careerOSWaitlistOptInEmail'

vi.mock('@/lib/firebase/admin', () => ({
  db: vi.fn(),
}))

vi.mock('@/lib/telegram', () => ({
  sendTelegramFeedback: vi.fn(),
}))

vi.mock('@/lib/email/careerOSWaitlistEmail', () => ({
  sendCareerOSWaitlistInternalEmail: vi.fn(async () => true),
}))

vi.mock('@/lib/email/careerOSWaitlistOptInEmail', () => ({
  sendCareerOSWaitlistOptInEmail: vi.fn(async () => true),
}))

function createReq(body: unknown): NextRequest {
  return {
    json: vi.fn(async () => body),
    headers: new Headers({ 'user-agent': 'test-agent' }),
  } as unknown as NextRequest
}

describe('api/career-os/waitlist route', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    const set = vi.fn(async () => undefined)
    const doc = vi.fn(() => ({ set }))
    const collection = vi.fn(() => ({ doc }))
    vi.mocked(db).mockReturnValue({ collection } as unknown as ReturnType<typeof db>)
  })

  it('returns ok when honeypot is filled', async () => {
    const response = await POST(createReq({ website: 'spam' }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendTelegramFeedback).not.toHaveBeenCalled()
  })

  it('rejects invalid email', async () => {
    const response = await POST(
      createReq({
        email: 'invalid',
        acceptedPrivacy: true,
        acceptedTerms: true,
        intent: { pricingTier: 'Pro', pricingMode: '1to1' },
      }),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Email non valida.' })
  })

  it('rejects missing required privacy consent', async () => {
    const response = await POST(
      createReq({
        locale: 'en',
        email: 'john@example.com',
        acceptedPrivacy: false,
        acceptedTerms: true,
        intent: { pricingTier: 'Pro', pricingMode: '1to1' },
      }),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Privacy acceptance is required.' })
  })

  it('stores waitlist lead and sends notifications', async () => {
    const response = await POST(
      createReq({
        locale: 'en',
        email: 'john@example.com',
        acceptedPrivacy: true,
        acceptedTerms: true,
        marketingConsent: true,
        intent: {
          pricingTier: 'Pro',
          pricingMode: '1to1',
          objective: 'offer-ready',
        },
        source: 'pricing_waitlist_modal',
      }),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendTelegramFeedback).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'career_os_waitlist',
        email: 'john@example.com',
      }),
    )
    expect(sendCareerOSWaitlistInternalEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'john@example.com',
        intent: '1to1:Pro',
        marketingConsent: false,
        marketingConsentStatus: 'pending_confirmation',
      }),
    )
    expect(sendCareerOSWaitlistOptInEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'john@example.com',
        locale: 'en',
      }),
    )
  })

  it('rejects missing required terms acceptance', async () => {
    const response = await POST(
      createReq({
        locale: 'en',
        email: 'john@example.com',
        acceptedPrivacy: true,
        acceptedTerms: false,
        intent: { pricingTier: 'Pro', pricingMode: '1to1' },
      }),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Terms acceptance is required.' })
  })

  it('does not send marketing opt-in email when marketing consent is not requested', async () => {
    const response = await POST(
      createReq({
        locale: 'it',
        email: 'mario@example.com',
        acceptedPrivacy: true,
        acceptedTerms: true,
        marketingConsent: false,
        intent: {
          pricingTier: 'Starter',
          pricingMode: '1to1',
        },
      }),
    )

    expect(response.status).toBe(200)
    expect(sendCareerOSWaitlistOptInEmail).not.toHaveBeenCalled()
    expect(sendCareerOSWaitlistInternalEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        marketingConsentStatus: 'not_requested',
      }),
    )
  })
})
