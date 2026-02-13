export const MAX_DISTINCT_AGREEMENT_VERSIONS = 2

export type AgreementPolicyDecision =
  | 'allow_new_signature'
  | 'already_signed_same_version'
  | 'max_versions_reached'
  | 'invalid_requested_version'

interface EvaluateAgreementSignaturePolicyInput {
  existingVersions: string[]
  requestedVersion: string
  maxDistinctVersions?: number
}

function normalizeVersion(version: string): string {
  return version.trim()
}

/**
 * Enforces contributor-agreement signature policy:
 * - one signature per version
 * - at most N distinct versions per user (default: 2)
 */
export function evaluateAgreementSignaturePolicy({
  existingVersions,
  requestedVersion,
  maxDistinctVersions = MAX_DISTINCT_AGREEMENT_VERSIONS,
}: EvaluateAgreementSignaturePolicyInput): AgreementPolicyDecision {
  const normalizedRequestedVersion = normalizeVersion(requestedVersion)
  if (!normalizedRequestedVersion) {
    return 'invalid_requested_version'
  }

  const distinctVersions = Array.from(
    new Set(existingVersions.map(normalizeVersion).filter(Boolean))
  )

  if (distinctVersions.includes(normalizedRequestedVersion)) {
    return 'already_signed_same_version'
  }

  if (distinctVersions.length >= maxDistinctVersions) {
    return 'max_versions_reached'
  }

  return 'allow_new_signature'
}

