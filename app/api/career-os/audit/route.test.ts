import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { NextRequest } from 'next/server'
import { POST } from './route'
import { sendTelegramFeedback } from '@/lib/telegram'

vi.mock('@/lib/telegram', () => ({
  sendTelegramFeedback: vi.fn(),
}))

function createReq(body: unknown): NextRequest {
  return {
    json: vi.fn(async () => body),
    headers: new Headers({ 'user-agent': 'test-agent' }),
  } as unknown as NextRequest
}

describe('api/career-os/audit route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('returns ok when honeypot is filled', async () => {
    const response = await POST(
      createReq({
        website: 'https://spam.example',
      })
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendTelegramFeedback).not.toHaveBeenCalled()
  })

  it('returns italian localized error by default', async () => {
    const response = await POST(
      createReq({
        name: '',
      })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Nome richiesto.' })
  })

  it('returns english localized error when locale=en', async () => {
    const response = await POST(
      createReq({
        locale: 'en',
        name: '',
      })
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Name is required.' })
  })

  it('sends telegram and returns ok for valid payload', async () => {
    const response = await POST(
      createReq({
        locale: 'en',
        name: 'John Doe',
        email: 'john@example.com',
        doubt: 'I am unsure about role fit',
        acceptedPrivacy: true,
        availability: 'Mon 10:00',
        website: '',
      })
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendTelegramFeedback).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'career_os_audit',
        email: 'john@example.com',
      })
    )
  })
})
