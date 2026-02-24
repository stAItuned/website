import { describe, expect, it } from 'vitest'
import { getLocalizedQuestions } from '@/app/(public)/role-fit-audit/lib/questions'
import { calculateAuditResult } from '@/app/(public)/role-fit-audit/lib/scoring'
import { verifyRoleFitI18nParity } from '../../scripts/verify-role-fit-i18n'

describe('Role Fit i18n parity', () => {
  it('returns same question IDs and counts in it/en', () => {
    const itQuestions = getLocalizedQuestions('it')
    const enQuestions = getLocalizedQuestions('en')

    expect(itQuestions).toHaveLength(enQuestions.length)
    expect(itQuestions.map((q) => q.id)).toEqual(enQuestions.map((q) => q.id))
  })

  it('keeps score/archetype invariant across locales', () => {
    const answers: Record<string, number> = {
      Q1: 3,
      Q2: 2,
      Q3: 3,
      Q4: 3,
      Q5: 2,
      Q6: 3,
      Q7: 3,
      Q8: 2,
      Q9: 2,
      Q10: 3,
      Q11: 2,
      Q12: 3,
      Q13: 2,
      Q14: 2,
      Q15: 2,
      Q16: 1,
      Q17: 2,
      Q18: 2,
      Q19: 2,
      Q20: 2,
    }

    const itResult = calculateAuditResult(answers, 'it')
    const enResult = calculateAuditResult(answers, 'en')

    expect(itResult.normalizedScores).toEqual(enResult.normalizedScores)
    expect(itResult.archetype.id).toEqual(enResult.archetype.id)
    expect(itResult.topGaps.map((gap) => gap.id)).toEqual(enResult.topGaps.map((gap) => gap.id))
  })

  it('passes i18n parity validator', () => {
    const result = verifyRoleFitI18nParity()
    expect(result.ok).toBe(true)
    expect(result.issues).toHaveLength(0)
  })
})
