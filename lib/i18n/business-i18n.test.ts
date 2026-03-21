import { describe, expect, it } from 'vitest'
import { businessTranslations } from '@/lib/i18n/business-translations'

describe('Business i18n parity', () => {
  it('keeps top-level translation sections aligned between it and en', () => {
    expect(Object.keys(businessTranslations.it)).toEqual(Object.keys(businessTranslations.en))
  })

  it('keeps repeated content block counts aligned between it and en', () => {
    expect(businessTranslations.it.hero.trustSignals).toHaveLength(businessTranslations.en.hero.trustSignals.length)
    expect(businessTranslations.it.painPoints.items).toHaveLength(businessTranslations.en.painPoints.items.length)
    expect(businessTranslations.it.currentState.fragmentedTools).toHaveLength(
      businessTranslations.en.currentState.fragmentedTools.length,
    )
    expect(businessTranslations.it.currentState.lanes).toHaveLength(businessTranslations.en.currentState.lanes.length)
    expect(businessTranslations.it.currentState.centralizedPoints).toHaveLength(
      businessTranslations.en.currentState.centralizedPoints.length,
    )
    expect(businessTranslations.it.metrics.items).toHaveLength(businessTranslations.en.metrics.items.length)
    expect(businessTranslations.it.comparison.before.bullets).toHaveLength(
      businessTranslations.en.comparison.before.bullets.length,
    )
    expect(businessTranslations.it.comparison.after.bullets).toHaveLength(
      businessTranslations.en.comparison.after.bullets.length,
    )
    expect(businessTranslations.it.flow.steps).toHaveLength(businessTranslations.en.flow.steps.length)
    expect(businessTranslations.it.useCases.items).toHaveLength(businessTranslations.en.useCases.items.length)
    expect(businessTranslations.it.benefits.items).toHaveLength(businessTranslations.en.benefits.items.length)
    expect(businessTranslations.it.faq.items).toHaveLength(businessTranslations.en.faq.items.length)
  })
})
