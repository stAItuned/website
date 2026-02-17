import { describe, expect, it } from 'vitest'
import { generateArticleSchema, mapArticleLanguageToLocale } from './seo-schemas'

describe('mapArticleLanguageToLocale', () => {
  it('maps Italian to it-IT', () => {
    expect(mapArticleLanguageToLocale('Italian')).toBe('it-IT')
  })

  it('maps English to en-US', () => {
    expect(mapArticleLanguageToLocale('English')).toBe('en-US')
  })

  it('falls back to en-US when language is missing', () => {
    expect(mapArticleLanguageToLocale()).toBe('en-US')
  })

  it('falls back to en-US when language is invalid', () => {
    expect(mapArticleLanguageToLocale('IT')).toBe('en-US')
  })
})

describe('generateArticleSchema', () => {
  it('sets inLanguage to en-US for English articles', () => {
    const schema = generateArticleSchema({
      title: 'English article',
      description: 'desc',
      slug: 'english-article',
      author: 'Author',
      datePublished: '2025-01-01',
      section: 'newbie',
      language: 'English',
    })

    expect(schema.inLanguage).toBe('en-US')
  })

  it('sets inLanguage to it-IT for Italian articles', () => {
    const schema = generateArticleSchema({
      title: 'Articolo italiano',
      description: 'desc',
      slug: 'articolo-italiano',
      author: 'Autore',
      datePublished: '2025-01-01',
      section: 'newbie',
      language: 'Italian',
    })

    expect(schema.inLanguage).toBe('it-IT')
  })
})
