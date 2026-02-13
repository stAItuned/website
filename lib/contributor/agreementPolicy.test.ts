import { describe, expect, it } from 'vitest'
import { evaluateAgreementSignaturePolicy } from './agreementPolicy'

describe('evaluateAgreementSignaturePolicy', () => {
  it('allows first signature', () => {
    expect(
      evaluateAgreementSignaturePolicy({
        existingVersions: [],
        requestedVersion: '1.1',
      })
    ).toBe('allow_new_signature')
  })

  it('blocks duplicate signature for same version', () => {
    expect(
      evaluateAgreementSignaturePolicy({
        existingVersions: ['1.1'],
        requestedVersion: '1.1',
      })
    ).toBe('already_signed_same_version')
  })

  it('allows second distinct version', () => {
    expect(
      evaluateAgreementSignaturePolicy({
        existingVersions: ['1.0'],
        requestedVersion: '1.1',
      })
    ).toBe('allow_new_signature')
  })

  it('blocks third distinct version when max is reached', () => {
    expect(
      evaluateAgreementSignaturePolicy({
        existingVersions: ['1.0', '1.1'],
        requestedVersion: '1.2',
      })
    ).toBe('max_versions_reached')
  })

  it('rejects empty version', () => {
    expect(
      evaluateAgreementSignaturePolicy({
        existingVersions: ['1.0'],
        requestedVersion: '   ',
      })
    ).toBe('invalid_requested_version')
  })
})

