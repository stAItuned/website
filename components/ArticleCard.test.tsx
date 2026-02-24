import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type React from 'react'
import { ArticleCard } from './ArticleCard'

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt="" {...props} />,
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

vi.mock('@/lib/hooks/useFastAnalytics', () => ({
  useFastAnalytics: () => ({
    data: { pageViews: 0 },
    loading: false,
  }),
  formatAnalyticsNumber: (value: number) => String(value),
}))

vi.mock('@/config/topics', () => ({
  getTopicHub: () => undefined,
}))

describe('ArticleCard', () => {
  it('renders a single root link with target + slug href', () => {
    render(
      <ArticleCard
        article={{
          title: 'Router first RAG',
          slug: 'router-first-rag',
          target: 'Midway',
          date: '2026-01-10',
          readingTime: 8,
        }}
      />
    )

    const link = screen.getByRole('link', { name: 'Read article: Router first RAG' })
    expect(link.getAttribute('href')).toBe('/learn/midway/router-first-rag')
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })

  it('falls back to first topic when target is missing', () => {
    render(
      <ArticleCard
        article={{
          title: 'Topic fallback',
          slug: 'topic-fallback',
          topics: ['rag'],
          date: '2026-01-10',
        }}
      />
    )

    const link = screen.getByRole('link', { name: 'Read article: Topic fallback' })
    expect(link.getAttribute('href')).toBe('/learn/rag/topic-fallback')
  })

  it('falls back to general when target and topics are missing', () => {
    render(
      <ArticleCard
        article={{
          title: 'General fallback',
          slug: 'general-fallback',
          date: '2026-01-10',
        }}
      />
    )

    const link = screen.getByRole('link', { name: 'Read article: General fallback' })
    expect(link.getAttribute('href')).toBe('/learn/general/general-fallback')
  })

  it('keeps title and CTA inside the same root link', () => {
    render(
      <ArticleCard
        article={{
          title: 'Single anchor card',
          slug: 'single-anchor-card',
          target: 'Newbie',
          date: '2026-01-10',
        }}
      />
    )

    const link = screen.getByRole('link', { name: 'Read article: Single anchor card' })
    const title = screen.getByText('Single anchor card')
    const cta = screen.getByText('Read')

    expect(title.closest('a')).toBe(link)
    expect(cta.closest('a')).toBe(link)
  })
})
