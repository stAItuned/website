// Utility to sanitize article slugs for Firestore keys
export function sanitizeSlug(slug: string): string {
  return slug
    .replace(/[/\\]/g, '-')
    .replace(/[^a-zA-Z0-9\-_]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
