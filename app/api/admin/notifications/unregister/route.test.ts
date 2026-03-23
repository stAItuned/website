import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

const verifyAdminMock = vi.fn()
const unsubscribeFromTopicMock = vi.fn()
const setMock = vi.fn()

vi.mock('@/lib/firebase/server-auth', () => ({
  verifyAdmin: (...args: unknown[]) => verifyAdminMock(...args),
}))

vi.mock('firebase-admin/messaging', () => ({
  getMessaging: () => ({
    unsubscribeFromTopic: (...args: unknown[]) => unsubscribeFromTopicMock(...args),
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
  return new Request('http://localhost/api/admin/notifications/unregister', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-token',
    },
    body: JSON.stringify(body),
  })
}

describe('POST /api/admin/notifications/unregister', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    verifyAdminMock.mockResolvedValue({ user: { uid: 'uid', email: 'admin@staituned.com' } })
    unsubscribeFromTopicMock.mockResolvedValue({ successCount: 1 })
    setMock.mockResolvedValue(undefined)
  })

  it('returns 401 on unauthorized', async () => {
    verifyAdminMock.mockResolvedValue({ error: 'Unauthorized', status: 401 })
    const response = await POST(makeRequest({ token: 'token-1' }) as unknown as RequestArg)
    expect(response.status).toBe(401)
  })

  it('returns 400 when token is missing', async () => {
    const response = await POST(makeRequest({}) as unknown as RequestArg)
    expect(response.status).toBe(400)
  })

  it('unregisters token from admin-ops', async () => {
    const response = await POST(makeRequest({ token: 'token-1' }) as unknown as RequestArg)
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
    expect(unsubscribeFromTopicMock).toHaveBeenCalledWith(['token-1'], 'admin-ops')
    expect(setMock).toHaveBeenCalledTimes(1)
  })
})
