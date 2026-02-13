interface IdentitySource {
  displayName?: string | null
  email?: string | null
  photoURL?: string | null
}

interface ResolveProfileIdentityInput {
  user: IdentitySource
  writerDisplayName?: string
  writerImageUrl?: string
}

function normalizeText(value?: string | null): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

export interface ResolvedProfileIdentity {
  displayName: string
  shortName: string
  initials: string
  imageUrl?: string
}

/**
 * Resolves profile identity with priority:
 * 1) writer profile data (if available)
 * 2) Google/Firebase auth user data
 */
export function resolveProfileIdentity({
  user,
  writerDisplayName,
  writerImageUrl,
}: ResolveProfileIdentityInput): ResolvedProfileIdentity {
  const displayName =
    normalizeText(writerDisplayName) ??
    normalizeText(user.displayName) ??
    normalizeText(user.email) ??
    'User'

  const emailLocalPart = normalizeText(user.email)?.split('@')[0]
  const shortName = displayName.split(' ')[0] || emailLocalPart || 'User'
  const initials = (displayName.charAt(0) || emailLocalPart?.charAt(0) || 'U').toUpperCase()
  const imageUrl = normalizeText(writerImageUrl) ?? normalizeText(user.photoURL)

  return {
    displayName,
    shortName,
    initials,
    imageUrl,
  }
}

