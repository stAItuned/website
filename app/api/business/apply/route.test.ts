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

describe('api/business/apply route', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    const add = vi.fn(async () => undefined)
    const collection = vi.fn(() => ({ add }))
    vi.mocked(db).mockReturnValue({ collection } as unknown as ReturnType<typeof db>)
  })

  it('returns ok when honeypot is filled', async () => {
    const response = await POST(createReq({ website: 'https://spam.example' }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendTelegramFeedback).not.toHaveBeenCalled()
  })

  it('returns italian localized error by default', async () => {
    const response = await POST(createReq({ name: '', email: 'invalid' }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Nome richiesto.' })
  })

  it('returns english localized error when locale=en', async () => {
    const response = await POST(createReq({ locale: 'en', name: '', email: 'invalid' }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Name is required.' })
  })

  it('sends telegram and returns ok for valid payload', async () => {
    const response = await POST(
      createReq({
        locale: 'en',
        name: 'Jane Doe',
        email: 'jane@example.com',
        company: 'ACME',
        role: 'Operations Manager',
        processName: 'Worker time reporting',
        mainPain: 'Data is fragmented across chat and spreadsheets.',
        acceptedPrivacy: true,
        source: 'test-suite',
        website: '',
      }),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendTelegramFeedback).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'business_demo_request',
        email: 'jane@example.com',
      }),
    )
  })
})
