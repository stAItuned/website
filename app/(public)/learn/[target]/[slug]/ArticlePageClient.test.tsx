import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type React from 'react'
import ArticlePageClient from './ArticlePageClient'
import type { ContentPost } from '@/lib/contentlayer'

vi.mock('@/lib/hooks/useScreenSize', () => ({
  useScreenSize: () => true,
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string
    children: React.ReactNode
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />,
}))

vi.mock('@/components/PreviewBanner', () => ({ PreviewBanner: () => <div /> }))
vi.mock('@/components/ArticleTOC', () => ({ ArticleTOC: () => <div /> }))
vi.mock('@/components/MarkdownContent', () => ({ MarkdownContent: () => <div /> }))
vi.mock('@/components/LikeButton', () => ({ LikeButton: () => <button type="button">Like</button> }))
vi.mock('@/components/ArticleRating', () => ({ ArticleRating: () => <div /> }))
vi.mock('@/components/BookmarkButton', () => ({ BookmarkButton: () => <button type="button">Bookmark</button> }))
vi.mock('@/components/ArticleFAQ', () => ({ ArticleFAQ: () => <div /> }))
vi.mock('@/components/AuthorAvatar', () => ({ default: () => <div /> }))
vi.mock('@/components/BackToTopButton', () => ({ BackToTopButton: () => <div /> }))
vi.mock('@/components/ui/PageTransition', () => ({ PageTransition: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('@/components/RelatedArticles', () => ({ RelatedArticles: () => <div /> }))
vi.mock('@/components/ui/ReadingProgress', () => ({ ReadingProgress: () => <div /> }))
vi.mock('@/components/ui/FloatingShareBar', () => ({ FloatingShareBar: () => <div /> }))
vi.mock('@/components/ui/AuthorBioCard', () => ({ AuthorBioCard: () => <div /> }))
vi.mock('@/components/ui/ContributorCTA', () => ({ ContributorCTA: () => <div /> }))
vi.mock('@/components/pwa', () => ({ PWAInstallInline: () => <div /> }))
vi.mock('@/components/ui/MobileActionBar', () => ({ MobileActionBar: () => <div /> }))
vi.mock('@/components/ui/ReadingProgressBar', () => ({ ReadingProgressBar: () => <div /> }))
vi.mock('@/components/ui/ContinueReadingPrompt', () => ({ ContinueReadingPrompt: () => <div /> }))
vi.mock('@/components/ui/SwipeNavigation', () => ({ SwipeNavigation: ({ children }: { children: React.ReactNode }) => <>{children}</> }))
vi.mock('@/components/ui/FloatingSectionIndicator', () => ({ FloatingSectionIndicator: () => <div /> }))
vi.mock('@/components/geo/GeoPlaybookRail', () => ({ GeoPlaybookRail: () => <div /> }))
vi.mock('@/components/geo/GeoPlaybookBottomSheet', () => ({ GeoPlaybookBottomSheet: () => <div /> }))
vi.mock('@/components/geo/GeoAnswerLayer', () => ({ GeoAnswerLayer: () => <div /> }))
vi.mock('@/components/geo/GeoStrategicInsights', () => ({ GeoStrategicInsights: () => <div /> }))

vi.mock('@/lib/hooks/useReadingProgress', () => ({
  useReadingProgress: () => ({
    savedProgress: null,
    showContinuePrompt: false,
    saveProgress: () => undefined,
    restorePosition: () => undefined,
    dismissPrompt: () => undefined,
  }),
}))

vi.mock('@/hooks/useReadingHistory', () => ({
  useReadingHistory: () => ({
    addToHistory: () => undefined,
  }),
}))

vi.mock('@/lib/gtag', () => ({
  event: () => undefined,
}))

vi.mock('@/lib/analytics', () => ({
  trackArticleScrollDepth: () => undefined,
  trackArticleReadComplete: () => undefined,
  trackArticleTimeOnPage: () => undefined,
  trackQualifiedView: () => undefined,
}))

vi.mock('@/config/topics', () => ({
  getTopicHub: () => null,
}))

vi.mock('@/lib/hooks/useArticleLikes', () => ({
  useArticleLikes: () => ({
    liked: false,
    likesCount: 0,
    loading: false,
    handleLike: () => undefined,
  }),
}))

const baseProps = {
  coverImage: null,
  toc: [],
  target: 'newbie',
  targetDisplay: 'Newbie',
  relatedArticles: [],
  authorData: null,
  authorBadges: [],
  analytics: {
    pageViews: 0,
    users: 0,
    likes: 0,
    sessions: 0,
    avgTimeOnPage: 0,
    bounceRate: 0,
    updatedAt: new Date().toISOString(),
  },
}

function buildArticle(overrides: Partial<ContentPost>): ContentPost {
  return {
    _id: 'post-id',
    _raw: {},
    type: 'Post',
    slug: 'article',
    url: '/learn/newbie/article',
    title: 'Article',
    author: 'Author',
    date: '2025-01-01',
    target: 'newbie',
    language: 'English',
    topics: [],
    tags: [],
    imagePath: '',
    structuredData: {},
    body: { raw: 'Body' },
    published: true,
    readingTime: 5,
    readTime: 5,
    ...overrides,
  }
}

describe('ArticlePageClient lang semantics', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => undefined)))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders article with lang=en for English content', () => {
    render(
      <ArticlePageClient
        {...baseProps}
        article={buildArticle({
          slug: 'english-article',
          title: 'English article',
          language: 'English',
        })}
      />
    )

    const article = screen.getByRole('article')
    expect(article.getAttribute('lang')).toBe('en')
  })

  it('renders article with lang=it for Italian content', () => {
    render(
      <ArticlePageClient
        {...baseProps}
        article={buildArticle({
          slug: 'articolo-italiano',
          title: 'Articolo italiano',
          language: 'Italian',
          author: 'Autore',
          body: { raw: 'Corpo' },
        })}
      />
    )

    const article = screen.getByRole('article')
    expect(article.getAttribute('lang')).toBe('it')
  })
})
