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
    arrayUnion: vi.fn((value: string) => ({ __op: 'arrayUnion', value })),
  },
}))

describe('api/notifications/subscribe route', () => {
  const subscribeToTopic = vi.fn(async () => undefined)
  const set = vi.fn(async () => undefined)
  const get = vi.fn(async () => ({ exists: false, data: () => ({}) }))
  const doc = vi.fn(() => ({ get, set }))
  const collection = vi.fn(() => ({ doc }))

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(getMessaging).mockReturnValue({ subscribeToTopic } as unknown as ReturnType<typeof getMessaging>)
    vi.mocked(db).mockReturnValue({ collection } as unknown as ReturnType<typeof db>)
  })

  it('rejects invalid topic', async () => {
    const response = await POST(new Request('http://localhost/api/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify({ token: 'fcm_123', topic: 'invalid' }),
      headers: { 'Content-Type': 'application/json' },
    }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({ error: 'Invalid topic' })
  })

  it('subscribes and updates retention-governed token state', async () => {
    const response = await POST(new Request('http://localhost/api/notifications/subscribe', {
      method: 'POST',
      body: JSON.stringify({ token: 'fcm_123', topic: 'new-articles' }),
      headers: { 'Content-Type': 'application/json' },
    }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
    expect(subscribeToTopic).toHaveBeenCalledWith(['fcm_123'], 'new-articles')
    expect(set).toHaveBeenCalledWith(
      expect.objectContaining({
        token: 'fcm_123',
        subscriptionStatus: 'subscribed',
        retentionUntil: expect.any(String),
      }),
      { merge: true },
    )
  })
})
