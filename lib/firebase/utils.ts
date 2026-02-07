/**
 * Helper to sanitize Firestore dates to ISO strings.
 * Handles Firestore Timestamps, Date objects, and ISO strings.
 */
export function sanitizeFirestoreDate(val: any): string | null {
    if (!val) return null;
    if (typeof val.toDate === 'function') return val.toDate().toISOString();
    if (val instanceof Date) return val.toISOString();
    return val; // Assume it's already a string or primitive
}
