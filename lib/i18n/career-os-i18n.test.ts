import { describe, expect, it } from 'vitest'
import { careerOSTranslations } from '@/lib/i18n/career-os-translations'
import { verifyCareerOSI18nParity } from '../../scripts/verify-career-os-i18n'

describe('Career OS i18n parity', () => {
  it('keeps the same section structure in it/en', () => {
    expect(Object.keys(careerOSTranslations.it)).toEqual(Object.keys(careerOSTranslations.en))
  })

  it('passes i18n parity validator', () => {
    const result = verifyCareerOSI18nParity()
    expect(result.issues).toEqual([])
    expect(result.ok).toBe(true)
  })
})
