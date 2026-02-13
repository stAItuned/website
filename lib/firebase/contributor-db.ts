import { getAdminDb } from './server-auth';
import { Contribution } from '../types/contributor';
import { sanitizeFirestoreDate } from './utils';

const COLLECTION = 'contributions';
const DEFAULT_AGREEMENT_VERSION = '1.1';

export interface SignedAgreementRecord {
    contributionId: string;
    version: string;
    acceptedAt: string;
}

function isAgreementSigned(agreement?: Contribution['agreement']): boolean {
    return agreement?.checkbox_general === true || agreement?.agreed === true;
}

function normalizeAgreementVersion(agreement?: Contribution['agreement']): string {
    const value = agreement?.agreement_version || agreement?.version || DEFAULT_AGREEMENT_VERSION;
    return String(value).trim() || DEFAULT_AGREEMENT_VERSION;
}

function normalizeAgreementAcceptedAt(agreement?: Contribution['agreement']): string {
    return agreement?.accepted_at || agreement?.agreedAt || '';
}

export async function createContribution(data: Omit<Contribution, 'id'>): Promise<string> {
    const db = getAdminDb();
    const docRef = db.collection(COLLECTION).doc();
    const id = docRef.id;

    const contribution: Contribution = {
        ...data,
        id,
        statusHistory: data.statusHistory ?? (data.status && data.currentStep ? [{
            status: data.status,
            currentStep: data.currentStep,
            changedAt: data.createdAt || new Date().toISOString(),
        }] : undefined),
    };

    await docRef.set(contribution);
    return id;
}

export async function updateContribution(id: string, data: Partial<Contribution>): Promise<void> {
    const db = getAdminDb();
    await db.collection(COLLECTION).doc(id).update({
        ...data,
        updatedAt: new Date().toISOString()
    });
}

export async function getContribution(id: string): Promise<Contribution | null> {
    const db = getAdminDb();
    const doc = await db.collection(COLLECTION).doc(id).get();

    if (!doc.exists) return null;
    return doc.data() as Contribution;
}

export async function getUserContributions(userId: string): Promise<Contribution[]> {
    console.log('[DB] Fetching contributions for user:', userId);
    try {
        const db = getAdminDb();
        const snapshot = await db.collection(COLLECTION)
            .where('contributorId', '==', userId)
            .get();

        console.log(`[DB] Found ${snapshot.docs.length} contributions`);
        const contributions = snapshot.docs.map(doc => {
            const data = doc.data();
            // Convert Firestore Timestamps to ISO strings if needed
            return {
                ...data,
                id: doc.id,
                createdAt: sanitizeFirestoreDate(data.createdAt),
                updatedAt: sanitizeFirestoreDate(data.updatedAt),
                lastSavedAt: sanitizeFirestoreDate(data.lastSavedAt),
            } as Contribution;
        });

        return contributions.sort((a, b) => {
            const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
            const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
            return dateB - dateA;
        });
    } catch (error) {
        console.error('[DB] Error in getUserContributions:', error);
        throw error;
    }
}

export async function getAllContributions(status?: string): Promise<Contribution[]> {
    const db = getAdminDb();
    let query: FirebaseFirestore.Query = db.collection(COLLECTION);

    if (status) {
        query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    const contributions = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            ...data,
            id: doc.id,
            createdAt: sanitizeFirestoreDate(data.createdAt),
            updatedAt: sanitizeFirestoreDate(data.updatedAt),
            lastSavedAt: sanitizeFirestoreDate(data.lastSavedAt),
        } as Contribution;
    });

    return contributions.sort((a, b) => {
        const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return dateB - dateA;
    });
}

export async function checkUserHasAgreement(userId: string): Promise<boolean> {
    const agreements = await getUserSignedAgreements(userId);
    return agreements.length > 0;
}

export async function getUserSignedAgreements(userId: string): Promise<SignedAgreementRecord[]> {
    const db = getAdminDb();
    const snapshot = await db.collection(COLLECTION)
        .where('contributorId', '==', userId)
        .get();

    const agreements = snapshot.docs
        .map((doc) => {
        const data = doc.data() as Contribution;
            if (!isAgreementSigned(data.agreement)) return null;

            return {
                contributionId: doc.id,
                version: normalizeAgreementVersion(data.agreement),
                acceptedAt: normalizeAgreementAcceptedAt(data.agreement),
            } as SignedAgreementRecord;
        })
        .filter((value): value is SignedAgreementRecord => value !== null)
        .sort((a, b) => {
            const aTime = Date.parse(a.acceptedAt || '');
            const bTime = Date.parse(b.acceptedAt || '');
            return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
        });

    return agreements;
}
