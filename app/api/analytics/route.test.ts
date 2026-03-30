import { beforeEach, describe, expect, it, vi } from 'vitest'

const fetchArticleAnalyticsMock = vi.fn()
const fetchMultipleArticlesAnalyticsMock = vi.fn()

vi.mock('@/lib/analytics-server', () => ({
  fetchArticleAnalytics: (...args: unknown[]) => fetchArticleAnalyticsMock(...args),
  fetchMultipleArticlesAnalytics: (...args: unknown[]) => fetchMultipleArticlesAnalyticsMock(...args),
}))

vi.mock('@/lib/contentlayer', () => ({
  allPosts: [
    {
      slug: 'vibe-coding-saas',
      title: 'Vibe coding gets you a demo, not a production SaaS',
      author: 'Salvatore Arancio Febbo',
      cover: '/cover.jpg',
      date: '2026-03-26',
      language: 'English',
      target: 'Midway',
      topics: ['AI Coding Assistants & Dev Tools'],
      readingTime: 16,
      published: true,
    },
  ],
}))

describe('GET /api/analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns canonical analytics for a single article slug', async () => {
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
    const response = await GET(new Request('http://localhost/api/analytics?slug=vibe-coding-saas') as never)

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
        articleUrl: '/learn/midway/vibe-coding-saas',
      },
      source: 'firestore-canonical',
    })
  })

  it('returns article list rows built from canonical analytics', async () => {
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
    const response = await GET(new Request('http://localhost/api/analytics') as never)

    expect(response.status).toBe(200)
    const json = await response.json()

    expect(json.success).toBe(true)
    expect(json.source).toBe('firestore')
    expect(json.data).toHaveLength(1)
    expect(json.data[0]).toMatchObject({
      articleUrl: '/learn/midway/vibe-coding-saas',
      pageViews: 47,
      uniquePageViews: 14,
      users: 14,
      sessions: 26,
    })
    expect(fetchMultipleArticlesAnalyticsMock).toHaveBeenCalledWith(['vibe-coding-saas'])
  })
})
