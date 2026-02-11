import { Contribution } from '@/lib/types/contributor'

interface ResolveAgreementAcceptedInput {
  /**
   * Firestore source-of-truth. `null` means "not checked yet".
   */
  hasAgreement: boolean | null
  /**
   * Local (possibly stale) agreement snapshot.
   */
  agreement?: Contribution['agreement'] | unknown
}

/**
 * Resolves whether the contributor agreement should be treated as accepted.
 *
 * Rules:
 * - If Firestore explicitly says `false`, return `false` (override any local state).
 * - If Firestore says `true`, return `true`.
 * - If Firestore hasn't been checked yet, fall back to local agreement markers.
 */
export function resolveAgreementAccepted({ hasAgreement, agreement }: ResolveAgreementAcceptedInput): boolean {
  if (hasAgreement === false) return false
  if (hasAgreement === true) return true
  if (!agreement || typeof agreement !== 'object') return false

  const record = agreement as Record<string, unknown>
  return record.checkbox_general === true || record.agreed === true
}

