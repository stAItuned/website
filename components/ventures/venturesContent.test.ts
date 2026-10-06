import { describe, expect, it } from 'vitest'
import { venturesContent } from './venturesContent'

describe('venturesContent', () => {
  it('keeps the same venture portfolio in Italian and English', () => {
    const englishIds = venturesContent.en.portfolio.ventures.map((venture) => venture.id)
    const italianIds = venturesContent.it.portfolio.ventures.map((venture) => venture.id)

    expect(italianIds).toEqual(englishIds)
  })

  it('keeps the same venture-engine states in both locales', () => {
    const englishStates = venturesContent.en.engine.steps.map((step) => step.status)
    const italianStates = venturesContent.it.engine.steps.map((step) => step.status)

    expect(italianStates).toEqual(englishStates)
  })

  it('contains complete conversion copy in both locales', () => {
    for (const locale of ['en', 'it'] as const) {
      expect(venturesContent[locale].hero.primaryCta.length).toBeGreaterThan(0)
      expect(venturesContent[locale].role.cta.length).toBeGreaterThan(0)
      expect(venturesContent[locale].role.ctaSubject.length).toBeGreaterThan(0)
    }
  })
})
