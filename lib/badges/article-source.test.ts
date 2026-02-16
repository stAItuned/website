import { describe, expect, it } from 'vitest'

import {
  buildWriterSlugLookup,
  mapFirestoreArticleToBadgeSource,
  mergeBadgeArticleSources,
  resolveAuthorSlug,
} from '@/lib/badges/article-source'

describe('badge article source helpers', () => {
  it('merges local and firestore sources preferring firestore on slug collisions', () => {
    const local = [
      {
        slug: 'shared-slug',
        title: 'Local title',
        author: 'Mario Rossi',
        url: '/learn/general/shared-slug',
        publishedAt: '2025-01-01',
      },
    ]
    const firestore = [
      {
        slug: 'shared-slug',
        title: 'Firestore title',
        author: 'Mario Rossi',
        url: '/learn/general/shared-slug',
        publishedAt: '2025-02-01',
      },
    ]

    const merged = mergeBadgeArticleSources(local, firestore)
    expect(merged).toHaveLength(1)
    expect(merged[0]?.title).toBe('Firestore title')
    expect(merged[0]?.publishedAt).toBe('2025-02-01')
  })

  it('maps firestore article docs to badge source and builds fallback url', () => {
    const article = mapFirestoreArticleToBadgeSource('local-first-rag', {
      title: 'Local-First RAG',
      author: 'Nuovo Scrittore',
      target: 'Expert',
      datePublished: '2026-02-01T10:00:00.000Z',
    })

    expect(article).toEqual({
      slug: 'local-first-rag',
      title: 'Local-First RAG',
      author: 'Nuovo Scrittore',
      url: '/learn/expert/local-first-rag',
      publishedAt: '2026-02-01T10:00:00.000Z',
      topic: undefined,
    })
  })

  it('ignores firestore docs without minimum article fields', () => {
    const analyticsOnly = mapFirestoreArticleToBadgeSource('some-slug', {
      pageViews: 1200,
      avgTimeOnPage: 47,
      updatedAt: '2026-02-10T00:00:00.000Z',
    })

    expect(analyticsOnly).toBeNull()
  })

  it('resolves author slug from writer profile map before generic normalization', () => {
    const writerLookup = buildWriterSlugLookup([
      {
        displayName: 'Giò Rossi',
        slug: 'gio-rossi',
      },
    ])

    expect(resolveAuthorSlug('Giò Rossi', writerLookup)).toBe('gio-rossi')
    expect(resolveAuthorSlug('Mario Bianchi', writerLookup)).toBe('mario-bianchi')
  })
})
