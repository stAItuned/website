import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const articleSetMock = vi.fn()
const pageSetMock = vi.fn()

vi.mock('@/lib/firebase/admin', () => ({
  dbDefault: () => ({
    collection: (name: string) => ({
      doc: () => ({
        set: (...args: unknown[]) =>
          name === 'articles' ? articleSetMock(...args) : pageSetMock(...args),
      }),
    }),
  }),
}))

vi.mock('@/lib/analytics/publicPageTracking', () => ({
  PUBLIC_PAGE_VIEWS_COLLECTION: 'page_views_first_party',
  getTrackedPublicPage: (path: string) => {
    if (path === '/learn/newbie/test-article') {
      return {
        key: '/learn/newbie/test-article',
        docId: 'learn__newbie__test-article',
        path: '/learn/newbie/test-article',
        title: 'Test Article',
        pageType: 'article',
        author: 'Daniele',
        language: 'it',
        target: 'newbie',
        articleSlug: 'test-article',
      }
    }

    if (path === '/career-os') {
      return {
        key: '/career-os',
        docId: 'career-os',
        path: '/career-os',
        title: 'Career OS',
        pageType: 'landing',
        author: null,
        language: null,
        target: null,
        articleSlug: null,
      }
    }

    return null
  },
  getTrackedArticlePageBySlug: (slug: string) => {
    if (slug === 'test-article') {
      return {
        key: '/learn/newbie/test-article',
        docId: 'learn__newbie__test-article',
        path: '/learn/newbie/test-article',
        title: 'Test Article',
        pageType: 'article',
        author: 'Daniele',
        language: 'it',
        target: 'newbie',
        articleSlug: 'test-article',
      }
    }

    return null
  },
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
    articleSetMock.mockReset()
    pageSetMock.mockReset()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('increments page views for a valid article path', async () => {
    const { POST } = await import('./route')

    const response = await POST(
      makeRequest(
        { path: '/learn/newbie/test-article' },
        { 'x-forwarded-for': '1.1.1.1' },
      ) as any,
    )

    const payload = await response.json()
    expect(response.status).toBe(200)
    expect(payload.ok).toBe(true)
    expect(articleSetMock).toHaveBeenCalledTimes(1)
    expect(pageSetMock).not.toHaveBeenCalled()
    expect(articleSetMock).toHaveBeenCalledWith(
      expect.objectContaining({
        originalSlug: 'test-article',
        pageViewsFirstParty: expect.anything(),
      }),
      { merge: true },
    )
  })

  it('increments page views for a valid non-article public page', async () => {
    const { POST } = await import('./route')

    const response = await POST(
      makeRequest(
        { path: '/career-os' },
        { 'x-forwarded-for': '2.2.2.2' },
      ) as any,
    )

    const payload = await response.json()
    expect(response.status).toBe(200)
    expect(payload.ok).toBe(true)
    expect(articleSetMock).not.toHaveBeenCalled()
    expect(pageSetMock).toHaveBeenCalledTimes(1)
    expect(pageSetMock).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/career-os',
        title: 'Career OS',
        pageViewsFirstParty: expect.anything(),
      }),
      { merge: true },
    )
  })

  it('skips unknown or excluded pages', async () => {
    const { POST } = await import('./route')

    const response = await POST(
      makeRequest(
        { path: '/admin/analytics' },
        { 'x-forwarded-for': '2.2.2.2' },
      ) as any,
    )

    const payload = await response.json()
    expect(response.status).toBe(202)
    expect(payload.skipped).toBe('unknown_or_untracked_page')
    expect(articleSetMock).not.toHaveBeenCalled()
    expect(pageSetMock).not.toHaveBeenCalled()
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
    expect(articleSetMock).not.toHaveBeenCalled()
    expect(pageSetMock).not.toHaveBeenCalled()
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
    expect(articleSetMock).toHaveBeenCalledTimes(1)
  })

  it('skips requests from non-production origins', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://staituned.com')

    const { POST } = await import('./route')

    const response = await POST(
      makeRequest(
        { path: '/learn/newbie/test-article' },
        { host: 'localhost:3000' },
      ) as any,
    )

    const payload = await response.json()
    expect(response.status).toBe(202)
    expect(payload.skipped).toBe('non_production_origin')
    expect(articleSetMock).not.toHaveBeenCalled()
    expect(pageSetMock).not.toHaveBeenCalled()
  })

  it('accepts requests from custom allowed hosts configured via env', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('PAGE_VIEW_ALLOWED_HOSTS', 'staging.staituned.com')

    const { POST } = await import('./route')

    const response = await POST(
      makeRequest(
        { path: '/learn/newbie/test-article' },
        { host: 'staging.staituned.com' },
      ) as any,
    )

    const payload = await response.json()
    expect(response.status).toBe(200)
    expect(payload.ok).toBe(true)
    expect(articleSetMock).toHaveBeenCalledTimes(1)
  })
})
