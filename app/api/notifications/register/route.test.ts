import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DELETE, POST } from './route'
import { db } from '@/lib/firebase/admin'

vi.mock('@/lib/firebase/admin', () => ({
  db: vi.fn(),
}))

describe('api/notifications/register route', () => {
  const set = vi.fn(async () => undefined)
  const get = vi.fn(async () => ({ exists: false, data: () => ({}) }))
  const doc = vi.fn(() => ({ get, set }))
  const collection = vi.fn(() => ({ doc }))

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(db).mockReturnValue({ collection } as unknown as ReturnType<typeof db>)
  })

  it('rejects missing token', async () => {
    const response = await POST(new Request('http://localhost/api/notifications/register', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Token is required' })
  })

  it('registers token with retention metadata', async () => {
    const response = await POST(new Request('http://localhost/api/notifications/register', {
      method: 'POST',
      body: JSON.stringify({ token: 'fcm_123' }),
      headers: { 'Content-Type': 'application/json' },
    }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'fcm_123',
        subscriptionStatus: 'subscribed',
        status: 'active',
        retentionUntil: expect.any(String),
      }),
      { merge: true },
    )
  })

  it('marks token as unregistered with lifecycle fields', async () => {
    const response = await DELETE(new Request('http://localhost/api/notifications/register', {
      method: 'DELETE',
      body: JSON.stringify({ token: 'fcm_123' }),
      headers: { 'Content-Type': 'application/json' },
    }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'fcm_123',
        subscriptionStatus: 'unregistered',
        active: false,
        retentionUntil: expect.any(String),
      }),
      { merge: true },
    )
  })
})
