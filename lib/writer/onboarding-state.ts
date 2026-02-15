export const writerOnboardingStates = [
  'profile_missing',
  'profile_completed',
  'agreement_signed',
] as const

export type WriterOnboardingState = (typeof writerOnboardingStates)[number]

export function resolveWriterOnboardingState(params: {
  hasProfile: boolean
  hasAgreement: boolean
}): WriterOnboardingState {
  if (!params.hasProfile) return 'profile_missing'
  if (!params.hasAgreement) return 'profile_completed'
  return 'agreement_signed'
}

export function isWriterPublishEnabled(state: WriterOnboardingState): boolean {
  return state === 'agreement_signed'
}
