import { describe, expect, it } from 'vitest'
import { resolveAgreementAccepted } from './agreementAcceptance'

describe('resolveAgreementAccepted', () => {
  it('returns false when Firestore says missing (even if local looks accepted)', () => {
    expect(
      resolveAgreementAccepted({
        hasAgreement: false,
        agreement: { checkbox_general: true },
      })
    ).toBe(false)
  })

  it('returns true when Firestore says accepted (even if local is empty)', () => {
    expect(resolveAgreementAccepted({ hasAgreement: true, agreement: undefined })).toBe(true)
  })

  it('falls back to local checkbox_general when Firestore is unknown', () => {
    expect(
      resolveAgreementAccepted({
        hasAgreement: null,
        agreement: { checkbox_general: true },
      })
    ).toBe(true)
  })

  it('falls back to local legacy agreed when Firestore is unknown', () => {
    expect(resolveAgreementAccepted({ hasAgreement: null, agreement: { agreed: true } })).toBe(true)
  })

  it('returns false when neither Firestore nor local indicates acceptance', () => {
    expect(resolveAgreementAccepted({ hasAgreement: null, agreement: { checkbox_general: false } })).toBe(false)
  })

  it('returns false for non-object agreement values', () => {
    expect(resolveAgreementAccepted({ hasAgreement: null, agreement: 'yes' })).toBe(false)
  })
})

