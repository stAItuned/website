import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'
import { getMessaging } from 'firebase-admin/messaging'
import { db } from '@/lib/firebase/admin'

vi.mock('firebase-admin/messaging', () => ({
  getMessaging: vi.fn(),
}))

vi.mock('@/lib/firebase/admin', () => ({
  db: vi.fn(),
}))

vi.mock('firebase-admin/firestore', () => ({
  FieldValue: {
    arrayRemove: vi.fn((value: string) => ({ __op: 'arrayRemove', value })),
  },
}))

describe('api/notifications/unsubscribe route', () => {
  const unsubscribeFromTopic = vi.fn(async () => undefined)
  const set = vi.fn(async () => undefined)
  const get = vi.fn(async () => ({ exists: false, data: () => ({}) }))
  const doc = vi.fn(() => ({ get, set }))
  const collection = vi.fn(() => ({ doc }))

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(getMessaging).mockReturnValue({ unsubscribeFromTopic } as unknown as ReturnType<typeof getMessaging>)
    vi.mocked(db).mockReturnValue({ collection } as unknown as ReturnType<typeof db>)
  })

  it('rejects missing fields', async () => {
    const response = await POST(new Request('http://localhost/api/notifications/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ token: 'fcm_123' }),
      headers: { 'Content-Type': 'application/json' },
    }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Token and topic are required' })
  })

  it('unsubscribes and updates lifecycle state', async () => {
    const response = await POST(new Request('http://localhost/api/notifications/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ token: 'fcm_123', topic: 'new-articles' }),
      headers: { 'Content-Type': 'application/json' },
    }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
    expect(unsubscribeFromTopic).toHaveBeenCalledWith(['fcm_123'], 'new-articles')
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'fcm_123',
        subscriptionStatus: 'unsubscribed',
        active: false,
        retentionUntil: expect.any(String),
      }),
      { merge: true },
    )
  })
})
