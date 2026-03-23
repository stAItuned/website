import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { NextRequest } from 'next/server'
import { POST } from './route'
import { db } from '@/lib/firebase/admin'
import { sendTelegramFeedback } from '@/lib/telegram'

const sendAdminOpsNotificationMock = vi.fn()

vi.mock('@/lib/firebase/admin', () => ({
  db: vi.fn(),
}))

vi.mock('@/lib/notifications/adminOpsPush', () => ({
  inferEnvironmentFromHost: () => 'test',
  sendAdminOpsNotification: (...args: unknown[]) => sendAdminOpsNotificationMock(...args),
}))

vi.mock('@/lib/telegram', () => ({
  sendTelegramFeedback: vi.fn(),
}))

function createReq(body: unknown): NextRequest {
  return {
    json: vi.fn(async () => body),
    headers: new Headers({ 'user-agent': 'test-agent', referer: '/contributors' }),
  } as unknown as NextRequest
}

describe('api/contributors/apply route', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    const add = vi.fn(async () => ({ id: 'contrib_123' }))
    const get = vi.fn(async () => ({ empty: true }))
    const limit = vi.fn(() => ({ get }))
    const where = vi.fn(() => ({ limit }))
    const collection = vi.fn(() => ({ where, add }))
    vi.mocked(db).mockReturnValue({ collection } as unknown as ReturnType<typeof db>)
  })

  it('returns ok when honeypot is filled', async () => {
    const response = await POST(createReq({ website: 'spam' }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendTelegramFeedback).not.toHaveBeenCalled()
  })

  it('returns 400 on invalid payload', async () => {
    const response = await POST(createReq({ name: '', email: 'invalid', website: '' }))

    expect(response.status).toBe(400)
  })

  it('stores contributor application and sends telegram', async () => {
    const response = await POST(
      createReq({
        name: 'Jane Doe',
        email: 'jane@example.com',
        linkedinUrl: 'https://linkedin.com/in/jane',
        expertise: 'AI writing',
        bio: 'I can contribute.',
        source: 'test',
        website: '',
      }),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true, message: 'Application submitted!' })
    expect(sendTelegramFeedback).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'contributor_application',
      }),
    )
    expect(sendAdminOpsNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'contributors_apply_submitted',
      }),
    )
  })
})
