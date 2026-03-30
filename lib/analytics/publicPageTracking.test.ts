import { describe, expect, it } from 'vitest'
import {
  getTrackedArticlePageBySlug,
  getTrackedPublicPage,
  listKnownTrackedPublicPages,
} from './publicPageTracking'

describe('publicPageTracking', () => {
  it('resolves known public marketing pages', () => {
    const page = getTrackedPublicPage('/career-os')

    expect(page).toMatchObject({
      path: '/career-os',
      title: 'Career OS',
      pageType: 'landing',
      articleSlug: null,
    })
  })

  it('resolves learn article pages from content metadata', () => {
    const page = getTrackedPublicPage('/learn/midway/vibe-coding-saas')

    expect(page).toMatchObject({
      path: '/learn/midway/vibe-coding-saas',
      pageType: 'article',
      articleSlug: 'vibe-coding-saas',
    })
  })

  it('resolves article pages from legacy slug fallback', () => {
    const page = getTrackedArticlePageBySlug('vibe-coding-saas')

    expect(page).toMatchObject({
      path: '/learn/midway/vibe-coding-saas',
      articleSlug: 'vibe-coding-saas',
    })
  })

  it('excludes admin routes from tracking', () => {
    expect(getTrackedPublicPage('/admin/analytics')).toBeNull()
  })

  it('lists known tracked pages without duplicate paths', () => {
    const pages = listKnownTrackedPublicPages()
    const uniquePaths = new Set(pages.map((page) => page.path))

    expect(uniquePaths.size).toBe(pages.length)
    expect(uniquePaths.has('/career-os')).toBe(true)
    expect(uniquePaths.has('/learn/midway/vibe-coding-saas')).toBe(true)
  })
})
