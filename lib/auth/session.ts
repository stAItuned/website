export const AUTH_SESSION_COOKIE_NAME = 'stai_session';
export const AUTH_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;
export const AUTH_SESSION_MAX_AGE_MS = AUTH_SESSION_MAX_AGE_SECONDS * 1000;

export function getSafeInternalRedirect(
  value: string | null | undefined,
  fallback = '/profile',
): string {
  if (!value) return fallback;
  if (!value.startsWith('/')) return fallback;
  if (value.startsWith('//')) return fallback;
  return value;
}
