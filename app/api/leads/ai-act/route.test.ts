import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { NextRequest } from 'next/server'
import { POST } from './route'
import { db } from '@/lib/firebase/admin'
import { sendTelegramFeedback } from '@/lib/telegram'

vi.mock('@/lib/firebase/admin', () => ({
  db: vi.fn(),
}))

vi.mock('@/lib/telegram', () => ({
  sendTelegramFeedback: vi.fn(),
}))

function createReq(body: unknown): NextRequest {
  return {
    json: vi.fn(async () => body),
    headers: new Headers({
      'x-forwarded-for': '127.0.0.1',
      'user-agent': 'vitest-agent',
    }),
  } as unknown as NextRequest
}

describe('api/leads/ai-act route', () => {
  const set = vi.fn(async () => undefined)
  const doc = vi.fn(() => ({ set }))
  const collection = vi.fn(() => ({ doc }))

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(db).mockReturnValue({ collection } as unknown as ReturnType<typeof db>)
  })

  it('returns ok for honeypot submission', async () => {
    const response = await POST(createReq({ website: 'spam-bot' }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendTelegramFeedback).not.toHaveBeenCalled()
  })

  it('returns 400 for invalid payload', async () => {
    const response = await POST(
      createReq({
        name: '',
        email: 'invalid',
      }),
    )

    expect(response.status).toBe(400)
    const payload = (await response.json()) as { error: string; details?: unknown }
    expect(payload.error).toBe('Invalid payload')
    expect(payload.details).toBeDefined()
  })

  it('stores lead and returns redirect url', async () => {
    const response = await POST(
      createReq({
        name: 'Mario Rossi',
        email: 'mario@example.com',
        company: 'stAItuned',
        role: 'CTO',
        source: 'landing',
        privacyPolicyAccepted: true,
        dataProcessingAccepted: true,
        marketingConsent: true,
        locale: 'it',
        website: '',
      }),
    )

    expect(response.status).toBe(200)
    const payload = (await response.json()) as { ok: boolean; redirectUrl?: string }
    expect(payload.ok).toBe(true)
    expect(typeof payload.redirectUrl).toBe('string')
    expect(payload.redirectUrl).toContain('/ai-eu-act/risorse?token=')
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        retentionUntil: expect.any(String),
        accessTokenExpiresAt: expect.any(String),
        access_token: expect.any(String),
        status: 'active',
      }),
    )
    expect(sendTelegramFeedback).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'ai_act_tools',
        page: '/ai-eu-act',
      }),
    )
  })
})
