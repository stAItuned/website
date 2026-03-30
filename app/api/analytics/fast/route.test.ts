import { beforeEach, describe, expect, it, vi } from 'vitest'

const fetchArticleAnalyticsMock = vi.fn()
const fetchMultipleArticlesAnalyticsMock = vi.fn()
const fetchGlobalAnalyticsMock = vi.fn()

vi.mock('@/lib/analytics-server', () => ({
  fetchArticleAnalytics: (...args: unknown[]) => fetchArticleAnalyticsMock(...args),
  fetchMultipleArticlesAnalytics: (...args: unknown[]) => fetchMultipleArticlesAnalyticsMock(...args),
  fetchGlobalAnalytics: (...args: unknown[]) => fetchGlobalAnalyticsMock(...args),
}))

describe('GET /api/analytics/fast', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns canonical article analytics for a single slug', async () => {
    fetchArticleAnalyticsMock.mockResolvedValue({
      pageViews: 47,
      users: 14,
      sessions: 26,
      avgTimeOnPage: 331.43,
      bounceRate: 0.11,
      likes: 0,
      updatedAt: '2026-03-30T04:00:16.501Z',
    })

    const { GET } = await import('./route')
    const response = await GET(new Request('http://localhost/api/analytics/fast?slug=vibe-coding-saas'))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: {
        pageViews: 47,
        users: 14,
        sessions: 26,
        avgTimeOnPage: 331.43,
        bounceRate: 0.11,
        likes: 0,
        updatedAt: '2026-03-30T04:00:16.501Z',
      },
      source: 'firestore-canonical',
    })
    expect(fetchArticleAnalyticsMock).toHaveBeenCalledWith('vibe-coding-saas')
  })

  it('returns canonical analytics for a slug batch', async () => {
    fetchMultipleArticlesAnalyticsMock.mockResolvedValue({
      'vibe-coding-saas': {
        pageViews: 47,
        users: 14,
        sessions: 26,
        avgTimeOnPage: 331.43,
        bounceRate: 0.11,
        likes: 0,
        updatedAt: '2026-03-30T04:00:16.501Z',
      },
    })

    const { GET } = await import('./route')
    const response = await GET(new Request('http://localhost/api/analytics/fast?slugs=vibe-coding-saas'))

    expect(response.status).toBe(200)
    const json = await response.json()
    expect(json.success).toBe(true)
    expect(json.source).toBe('firestore-canonical-batch')
    expect(json.data['vibe-coding-saas'].users).toBe(14)
    expect(fetchMultipleArticlesAnalyticsMock).toHaveBeenCalledWith(['vibe-coding-saas'])
  })
})
