import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { NextRequest } from 'next/server'
import { POST } from './route'
import { sendTelegramFeedback } from '@/lib/telegram'
import { db } from '@/lib/firebase/admin'

vi.mock('@/lib/telegram', () => ({
  sendTelegramFeedback: vi.fn(),
}))

vi.mock('@/lib/firebase/admin', () => ({
  db: vi.fn(),
}))

function createReq(body: unknown): NextRequest {
  return {
    json: vi.fn(async () => body),
    headers: new Headers({ 'user-agent': 'test-agent' }),
  } as unknown as NextRequest
}

describe('api/contact route', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    const add = vi.fn(async () => undefined)
    const collection = vi.fn(() => ({ add }))
    vi.mocked(db).mockReturnValue({ collection } as unknown as ReturnType<typeof db>)
  })

  it('returns ok when honeypot is filled', async () => {
    const response = await POST(createReq({ website: 'spam-link' }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendTelegramFeedback).not.toHaveBeenCalled()
  })

  it('returns 400 if consent is missing', async () => {
    const response = await POST(
      createReq({
        message: 'Need info',
        consent: false,
        website: '',
      }),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Consent required' })
  })

  it('stores contact request with retention metadata and sends telegram', async () => {
    const response = await POST(
      createReq({
        name: 'Mario Rossi',
        email: 'mario@example.com',
        company: 'ACME',
        message: 'Ci sentiamo per una demo?',
        consent: true,
        marketingConsent: true,
        website: '',
      }),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendTelegramFeedback).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'contact',
        email: 'mario@example.com',
      }),
    )
  })
})
