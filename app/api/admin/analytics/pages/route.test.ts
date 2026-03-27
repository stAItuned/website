import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from './route'

const verifyAdminMock = vi.fn()
const listAdminFirstPartyPageViewsMock = vi.fn()

vi.mock('@/lib/firebase/server-auth', () => ({
  verifyAdmin: (...args: unknown[]) => verifyAdminMock(...args),
}))

vi.mock('@/lib/admin/firstPartyPageViews', () => ({
  listAdminFirstPartyPageViews: (...args: unknown[]) => listAdminFirstPartyPageViewsMock(...args),
}))

type RequestArg = Parameters<typeof GET>[0]

function makeRequest(): Request {
  return new Request('http://localhost/api/admin/analytics/pages', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer test-token',
    },
  })
}

describe('GET /api/admin/analytics/pages', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when user is not authenticated', async () => {
    verifyAdminMock.mockResolvedValue({ error: 'Unauthorized', status: 401 })

    const response = await GET(makeRequest() as unknown as RequestArg)

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: 'Unauthorized',
    })
  })

  it('returns ranked first-party rows for admins', async () => {
    verifyAdminMock.mockResolvedValue({ user: { uid: 'admin-1', email: 'admin@example.com' } })
    listAdminFirstPartyPageViewsMock.mockResolvedValue([
      {
        slug: 'vibe-coding-saas',
        articleUrl: '/learn/midway/vibe-coding-saas',
        title: 'Vibe Coding SaaS',
        author: 'Daniele',
        language: 'it',
        target: 'midway',
        pageViews: 120,
        updatedAt: '2026-03-27T12:00:00.000Z',
      },
      {
        slug: 'gdpr-ai-rework-costs',
        articleUrl: '/learn/expert/gdpr-ai-rework-costs',
        title: 'GDPR AI Rework Costs',
        author: 'Daniele',
        language: 'en',
        target: 'expert',
        pageViews: 40,
        updatedAt: null,
      },
    ])

    const response = await GET(makeRequest() as unknown as RequestArg)

    expect(response.status).toBe(200)
    const json = (await response.json()) as {
      success: boolean
      rows: Array<{ pageViews: number }>
      summary: {
        trackedPages: number
        pagesWithViews: number
        totalViews: number
      }
      source: string
      generatedAt: string
    }

    expect(json.success).toBe(true)
    expect(json.rows).toHaveLength(2)
    expect(json.summary).toEqual({
      trackedPages: 2,
      pagesWithViews: 2,
      totalViews: 160,
    })
    expect(json.source).toBe('firestore:first-party')
    expect(typeof json.generatedAt).toBe('string')
  })

  it('returns 500 when the ranking query fails', async () => {
    verifyAdminMock.mockResolvedValue({ user: { uid: 'admin-1', email: 'admin@example.com' } })
    listAdminFirstPartyPageViewsMock.mockRejectedValue(new Error('boom'))

    const response = await GET(makeRequest() as unknown as RequestArg)

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: 'Failed to fetch first-party page views ranking',
    })
  })
})
