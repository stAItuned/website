import { getAdminDb } from './server-auth';
import { AuthorBadge, BadgeEvidence } from '@/lib/types/badge';
import { nanoid } from 'nanoid';

const BADGES_COLLECTION = 'badges';
const CREDENTIALS_COLLECTION = 'credentials';
const EVIDENCE_COLLECTION = 'badge_evidence';

/**
 * Generate a unique credential ID in format STA-YY-XXXXXX
 * @param year Two digit year (e.g. 26)
 */
export function generateCredentialId(year: number = new Date().getFullYear() % 100): string {
    const suffix = nanoid(6).toUpperCase();
    return `STA-${year}-${suffix}`;
}

/**
 * Get all badges earned by an author
 */
export async function getAuthorBadges(authorSlug: string): Promise<AuthorBadge[]> {
    try {
        const db = getAdminDb();
        const snapshot = await db
            .collection(BADGES_COLLECTION)
            .doc(authorSlug)
            .collection('earned')
            .get();

        return snapshot.docs.map(doc => doc.data() as AuthorBadge);
    } catch (error) {
        console.error(`Error fetching badges for ${authorSlug}:`, error);
        return [];
    }
}

/**
 * Award a badge to an author
 */
export async function awardBadge(authorSlug: string, badge: AuthorBadge, evidence: BadgeEvidence[]): Promise<void> {
    const db = getAdminDb();
    const batch = db.batch();

    // 1. Save badge to author's collection
    const badgeRef = db
        .collection(BADGES_COLLECTION)
        .doc(authorSlug)
        .collection('earned')
        .doc(badge.badgeId);

    batch.set(badgeRef, badge);

    // 2. Save public credential for verification
    const credentialRef = db.collection(CREDENTIALS_COLLECTION).doc(badge.credentialId);
    batch.set(credentialRef, {
        ...badge,
        authorSlug // distinct field for querying
    });

    // 3. Save evidence
    for (const item of evidence) {
        const evidenceRef = db.collection(EVIDENCE_COLLECTION).doc();
        batch.set(evidenceRef, {
            ...item,
            credentialId: badge.credentialId
        });
    }

    await batch.commit();
}

/**
 * Verify a credential by ID
 */
export async function verifyCredential(credentialId: string): Promise<AuthorBadge | null> {
    try {
        const db = getAdminDb();
        const doc = await db.collection(CREDENTIALS_COLLECTION).doc(credentialId).get();

        if (!doc.exists) return null;
        return doc.data() as AuthorBadge;
    } catch (error) {
        console.error(`Error verifying credential ${credentialId}:`, error);
        return null;
    }
}

/**
 * Check if author already has a specific badge
 */
export async function hasBadge(authorSlug: string, badgeId: string): Promise<boolean> {
    const db = getAdminDb();
    const doc = await db
        .collection(BADGES_COLLECTION)
        .doc(authorSlug)
        .collection('earned')
        .doc(badgeId)
        .get();

    return doc.exists;
}
