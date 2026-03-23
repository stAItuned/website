import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const setMock = vi.fn()

vi.mock('@/lib/firebase/admin', () => ({
  dbDefault: () => ({
    collection: () => ({
      doc: () => ({
        set: (...args: unknown[]) => setMock(...args),
      }),
    }),
  }),
}))

vi.mock('@/lib/contentlayer', () => ({
  allPosts: [
    { slug: 'test-article', published: true },
  ],
}))

function makeRequest(body: unknown, headers?: Record<string, string>): Request {
  return new Request('http://localhost/api/analytics/page-view', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: JSON.stringify(body),
  })
}

describe('POST /api/analytics/page-view', () => {
  beforeEach(() => {
    vi.resetModules()
    setMock.mockReset()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('increments page views for a valid article slug', async () => {
    const { POST } = await import('./route')

    const response = await POST(
      makeRequest(
        { slug: 'test-article', path: '/learn/newbie/test-article' },
        { 'x-forwarded-for': '1.1.1.1' },
      ) as any,
    )

    const payload = await response.json()
    expect(response.status).toBe(200)
    expect(payload.ok).toBe(true)
    expect(setMock).toHaveBeenCalledTimes(1)
    expect(setMock).toHaveBeenCalledWith(
      expect.objectContaining({
        originalSlug: 'test-article',
        pageViewsFirstParty: expect.anything(),
      }),
      { merge: true },
    )
  })

  it('skips unknown slugs', async () => {
    const { POST } = await import('./route')

    const response = await POST(
      makeRequest(
        { slug: 'unknown-article', path: '/learn/newbie/unknown-article' },
        { 'x-forwarded-for': '2.2.2.2' },
      ) as any,
    )

    const payload = await response.json()
    expect(response.status).toBe(202)
    expect(payload.skipped).toBe('unknown_slug')
    expect(setMock).not.toHaveBeenCalled()
  })

  it('skips prefetch requests', async () => {
    const { POST } = await import('./route')

    const response = await POST(
      makeRequest(
        { slug: 'test-article', path: '/learn/newbie/test-article' },
        {
          purpose: 'prefetch',
          'x-forwarded-for': '3.3.3.3',
        },
      ) as any,
    )

    const payload = await response.json()
    expect(response.status).toBe(202)
    expect(payload.skipped).toBe('prefetch_or_bot')
    expect(setMock).not.toHaveBeenCalled()
  })

  it('dedupes repeated requests in a short time window', async () => {
    const { POST } = await import('./route')

    const req = makeRequest(
      { slug: 'test-article', path: '/learn/newbie/test-article' },
      { 'x-forwarded-for': '4.4.4.4' },
    )

    const first = await POST(req as any)
    const firstPayload = await first.json()
    expect(first.status).toBe(200)
    expect(firstPayload.ok).toBe(true)

    const second = await POST(
      makeRequest(
        { slug: 'test-article', path: '/learn/newbie/test-article' },
        { 'x-forwarded-for': '4.4.4.4' },
      ) as any,
    )
    const secondPayload = await second.json()
    expect(second.status).toBe(202)
    expect(secondPayload.skipped).toBe('deduped')
    expect(setMock).toHaveBeenCalledTimes(1)
  })

  it('skips requests from non-production origins', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://staituned.com')

    const { POST } = await import('./route')

    const response = await POST(
      makeRequest(
        { slug: 'test-article' },
        { host: 'localhost:3000' },
      ) as any,
    )

    const payload = await response.json()
    expect(response.status).toBe(202)
    expect(payload.skipped).toBe('non_production_origin')
    expect(setMock).not.toHaveBeenCalled()
  })

  it('accepts requests from custom allowed hosts configured via env', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('PAGE_VIEW_ALLOWED_HOSTS', 'staging.staituned.com')

    const { POST } = await import('./route')

    const response = await POST(
      makeRequest(
        { slug: 'test-article' },
        { host: 'staging.staituned.com' },
      ) as any,
    )

    const payload = await response.json()
    expect(response.status).toBe(200)
    expect(payload.ok).toBe(true)
    expect(setMock).toHaveBeenCalledTimes(1)
  })
})
