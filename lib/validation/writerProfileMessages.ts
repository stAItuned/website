import type { ZodIssue } from 'zod'

export type WriterProfileLocale = 'it' | 'en'

const FALLBACK_MESSAGES: Record<WriterProfileLocale, string> = {
  it: 'Dati non validi. Controlla i campi.',
  en: 'Invalid data. Please check the fields.',
}

const BIO_MIN_MESSAGES: Record<WriterProfileLocale, string> = {
  it: 'La bio deve contenere almeno 20 caratteri.',
  en: 'Bio must contain at least 20 characters.',
}

/**
 * Maps a writer profile validation issue to a localized message.
 */
export function getWriterProfileErrorMessage(
  locale: WriterProfileLocale,
  issue: ZodIssue | undefined
): string {
  if (!issue) return FALLBACK_MESSAGES[locale]

  const field = issue.path?.[0]
  if (field === 'bio' && issue.code === 'too_small') {
    return BIO_MIN_MESSAGES[locale]
  }

  return FALLBACK_MESSAGES[locale]
}
