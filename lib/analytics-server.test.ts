import { beforeEach, describe, expect, it, vi } from 'vitest'

const mainArticleGetMock = vi.fn()
const mainDailyGetMock = vi.fn()
const legacyArticleGetMock = vi.fn()
const legacyDailyGetMock = vi.fn()

function makeSnap(data?: Record<string, unknown>) {
  return {
    exists: Boolean(data),
    data: () => data,
  }
}

vi.mock('@/lib/firebase/admin', () => ({
  dbDefault: () => ({
    collection: () => ({
      doc: () => ({
        get: mainArticleGetMock,
      }),
    }),
    doc: () => ({
      get: mainDailyGetMock,
    }),
    getAll: vi.fn(),
  }),
  dbLegacyDefault: () => ({
    collection: () => ({
      doc: () => ({
        get: legacyArticleGetMock,
      }),
    }),
    doc: () => ({
      get: legacyDailyGetMock,
    }),
    getAll: vi.fn(),
  }),
}))

vi.mock('@/lib/next-phase', () => ({
  shouldSkipFirestoreDuringBuild: () => false,
}))

describe('fetchArticleAnalytics', () => {
  beforeEach(() => {
    vi.resetModules()
    mainArticleGetMock.mockReset()
    mainDailyGetMock.mockReset()
    legacyArticleGetMock.mockReset()
    legacyDailyGetMock.mockReset()
  })

  it('prefers daily GA metrics over a stale article mirror and falls back to legacy default when needed', async () => {
    mainArticleGetMock.mockResolvedValue(makeSnap({
      pageViewsFirstParty: 47,
      users: 0,
      sessions: 0,
      likes: 2,
      updatedAt: '2026-03-30T04:00:16.501Z',
    }))
    mainDailyGetMock.mockResolvedValue(makeSnap({
      articlesStats: {},
      updatedAt: '2026-03-30T06:00:00.000Z',
    }))
    legacyArticleGetMock.mockResolvedValue(makeSnap({
      users: 14,
      sessions: 26,
    }))
    legacyDailyGetMock.mockResolvedValue(makeSnap({
      updatedAt: '2026-03-30T07:00:00.000Z',
      articlesStats: {
        'vibe-coding-saas': {
          users: 14,
          sessions: 26,
          avgTimeOnPage: 331.43,
          bounceRate: 0.11,
        },
      },
    }))

    const { fetchArticleAnalytics } = await import('./analytics-server')
    const analytics = await fetchArticleAnalytics('vibe-coding-saas')

    expect(analytics).toEqual({
      pageViews: 47,
      users: 14,
      sessions: 26,
      avgTimeOnPage: 331.43,
      bounceRate: 0.11,
      likes: 2,
      updatedAt: '2026-03-30T04:00:16.501Z',
    })
  })

  it('uses eu-primary daily stats when available', async () => {
    mainArticleGetMock.mockResolvedValue(makeSnap({
      pageViewsFirstParty: 69,
      users: 0,
      likes: 0,
    }))
    mainDailyGetMock.mockResolvedValue(makeSnap({
      updatedAt: '2026-03-30T08:00:00.000Z',
      articlesStats: {
        'vibe-coding-saas': {
          users: 21,
          sessions: 30,
          avgTimeOnPage: 120,
          bounceRate: 0.22,
        },
      },
    }))
    legacyArticleGetMock.mockResolvedValue(makeSnap())
    legacyDailyGetMock.mockResolvedValue(makeSnap())

    const { fetchArticleAnalytics } = await import('./analytics-server')
    const analytics = await fetchArticleAnalytics('vibe-coding-saas')

    expect(analytics.users).toBe(21)
    expect(analytics.sessions).toBe(30)
    expect(analytics.pageViews).toBe(69)
    expect(analytics.updatedAt).toBe('2026-03-30T08:00:00.000Z')
  })
})
