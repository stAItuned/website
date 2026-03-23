import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

const verifyAdminMock = vi.fn()
const subscribeToTopicMock = vi.fn()
const setMock = vi.fn()
const docMock = vi.fn(() => ({ set: setMock }))
const collectionMock = vi.fn(() => ({ doc: docMock }))
const dbDefaultMock = vi.fn(() => ({ collection: collectionMock }))

vi.mock('@/lib/firebase/server-auth', () => ({
  verifyAdmin: (...args: unknown[]) => verifyAdminMock(...args),
}))

vi.mock('firebase-admin/messaging', () => ({
  getMessaging: () => ({
    subscribeToTopic: (...args: unknown[]) => subscribeToTopicMock(...args),
  }),
}))

vi.mock('@/lib/firebase/admin', () => ({
  dbDefault: () => dbDefaultMock(),
}))

type RequestArg = Parameters<typeof POST>[0]

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/admin/notifications/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-token',
    },
    body: JSON.stringify(body),
  })
}

describe('POST /api/admin/notifications/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    verifyAdminMock.mockResolvedValue({
      user: {
        uid: 'admin-uid',
        email: 'admin@staituned.com',
      },
    })
    subscribeToTopicMock.mockResolvedValue({ successCount: 1 })
    setMock.mockResolvedValue(undefined)
  })

  it('returns 401 when auth is missing', async () => {
    verifyAdminMock.mockResolvedValue({ error: 'Unauthorized', status: 401 })

    const response = await POST(makeRequest({ token: 'abc' }) as unknown as RequestArg)
    expect(response.status).toBe(401)
  })

  it('returns 403 when user is not admin', async () => {
    verifyAdminMock.mockResolvedValue({ error: 'Forbidden', status: 403 })

    const response = await POST(makeRequest({ token: 'abc' }) as unknown as RequestArg)
    expect(response.status).toBe(403)
  })

  it('returns 400 when token is missing', async () => {
    const response = await POST(makeRequest({ topic: 'admin-ops' }) as unknown as RequestArg)
    expect(response.status).toBe(400)
  })

  it('returns 400 when topic is not allowed', async () => {
    const response = await POST(
      makeRequest({ token: 'fcm-token', topic: 'new-articles' }) as unknown as RequestArg,
    )
    expect(response.status).toBe(400)
  })

  it('registers admin token and subscribes to admin-ops', async () => {
    const response = await POST(
      makeRequest({ token: 'fcm-token', topic: 'admin-ops' }) as unknown as RequestArg,
    )
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
    expect(subscribeToTopicMock).toHaveBeenCalledWith(['fcm-token'], 'admin-ops')
    expect(collectionMock).toHaveBeenCalledWith('fcm_admin_tokens')
    expect(docMock).toHaveBeenCalledWith('fcm-token')
    expect(setMock).toHaveBeenCalledTimes(1)
  })
})
