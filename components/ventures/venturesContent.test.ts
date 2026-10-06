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
      expect(venturesContent[locale].role.fitItems).toHaveLength(3)
      expect(venturesContent[locale].role.form.title.length).toBeGreaterThan(0)
      expect(venturesContent[locale].role.form.experience.length).toBeGreaterThan(0)
      expect(venturesContent[locale].role.form.privacyPolicy.length).toBeGreaterThan(0)
    }
  })

  it('keeps portfolio media and zoom labels aligned across locales', () => {
    for (const locale of ['en', 'it'] as const) {
      const closedroom = venturesContent[locale].portfolio.ventures.find((v) => v.id === 'closedroom')
      expect(closedroom?.imageSrc).toBe('/assets/ventures/closedroom.png')

      const harnex = venturesContent[locale].portfolio.ventures.find((v) => v.id === 'harnex')
      expect(harnex?.imageSrc).toBe('/assets/ventures/harnex.png')

      const auraFinance = venturesContent[locale].portfolio.ventures.find((v) => v.id === 'aura-finance')
      expect(auraFinance?.imageSrc).toBe('/assets/ventures/aura-finance.png')

      expect(venturesContent[locale].portfolio.zoomLabel).toBeDefined()
      expect(venturesContent[locale].portfolio.closeLabel).toBeDefined()
    }
  })
})




