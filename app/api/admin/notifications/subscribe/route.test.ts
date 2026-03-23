import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

const verifyAdminMock = vi.fn()
const subscribeToTopicMock = vi.fn()
const setMock = vi.fn()

vi.mock('@/lib/firebase/server-auth', () => ({
  verifyAdmin: (...args: unknown[]) => verifyAdminMock(...args),
}))

vi.mock('firebase-admin/messaging', () => ({
  getMessaging: () => ({
    subscribeToTopic: (...args: unknown[]) => subscribeToTopicMock(...args),
  }),
}))

vi.mock('@/lib/firebase/admin', () => ({
  dbDefault: () => ({
    collection: () => ({
      doc: () => ({
        set: (...args: unknown[]) => setMock(...args),
      }),
    }),
  }),
}))

type RequestArg = Parameters<typeof POST>[0]

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/admin/notifications/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-token',
    },
    body: JSON.stringify(body),
  })
}

describe('POST /api/admin/notifications/subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    verifyAdminMock.mockResolvedValue({ user: { uid: 'uid', email: 'admin@staituned.com' } })
    subscribeToTopicMock.mockResolvedValue({ successCount: 1 })
    setMock.mockResolvedValue(undefined)
  })

  it('returns 400 on invalid topic', async () => {
    const response = await POST(
      makeRequest({ token: 'token-1', topic: 'new-articles' }) as unknown as RequestArg,
    )

    expect(response.status).toBe(400)
  })

  it('subscribes to admin topic when authorized', async () => {
    const response = await POST(
      makeRequest({ token: 'token-1', topic: 'admin-ops' }) as unknown as RequestArg,
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
    expect(subscribeToTopicMock).toHaveBeenCalledWith(['token-1'], 'admin-ops')
  })
})
