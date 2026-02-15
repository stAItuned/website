import { describe, expect, it } from 'vitest'
import {
  isWriterPublishEnabled,
  resolveWriterOnboardingState,
} from './onboarding-state'

describe('writer onboarding state', () => {
  it('returns profile_missing when profile is not present', () => {
    const state = resolveWriterOnboardingState({
      hasProfile: false,
      hasAgreement: false,
    })

    expect(state).toBe('profile_missing')
    expect(isWriterPublishEnabled(state)).toBe(false)
  })

  it('returns profile_completed when profile exists but agreement is missing', () => {
    const state = resolveWriterOnboardingState({
      hasProfile: true,
      hasAgreement: false,
    })

    expect(state).toBe('profile_completed')
    expect(isWriterPublishEnabled(state)).toBe(false)
  })

  it('returns agreement_signed and enables publish when both conditions are met', () => {
    const state = resolveWriterOnboardingState({
      hasProfile: true,
      hasAgreement: true,
    })

    expect(state).toBe('agreement_signed')
    expect(isWriterPublishEnabled(state)).toBe(true)
  })
})
