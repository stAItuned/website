import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;
let cachedDbDefault: Firestore | null = null;
let cachedStorage: Storage | null = null;

type ServiceAccountLike = {
  project_id?: string;
  [key: string]: unknown;
};

function parseServiceAccount(raw: string | undefined): ServiceAccountLike | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ServiceAccountLike;
  } catch {
    return null;
  }
}

function decodeServiceAccountB64(rawB64: string | undefined): string | undefined {
  if (!rawB64) return undefined;
  try {
    return Buffer.from(rawB64, 'base64').toString('utf8');
  } catch {
    return undefined;
  }
}

function pickServiceAccountRawKey(): string {
  const rawKeyDirect = process.env.FB_SERVICE_ACCOUNT_KEY;
  const rawKeyB64Decoded = decodeServiceAccountB64(process.env.FB_SERVICE_ACCOUNT_KEY_B64);
  const directCreds = parseServiceAccount(rawKeyDirect);
  const b64Creds = parseServiceAccount(rawKeyB64Decoded);

  const expectedProjectId =
    process.env.GCP_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (expectedProjectId) {
    const directMatch = directCreds?.project_id === expectedProjectId;
    const b64Match = b64Creds?.project_id === expectedProjectId;

    if (directMatch) return rawKeyDirect as string;
    if (b64Match) return rawKeyB64Decoded as string;

    const directProjectId = directCreds?.project_id ?? 'missing';
    const b64ProjectId = b64Creds?.project_id ?? 'missing';
    throw new Error(
      `Firebase Admin service-account project mismatch: expected "${expectedProjectId}", ` +
      `got FB_SERVICE_ACCOUNT_KEY="${directProjectId}" and FB_SERVICE_ACCOUNT_KEY_B64="${b64ProjectId}".`
    );
  }

  if (rawKeyDirect) return rawKeyDirect;
  if (rawKeyB64Decoded) return rawKeyB64Decoded;

  throw new Error('FB_SERVICE_ACCOUNT_KEY / FB_SERVICE_ACCOUNT_KEY_B64 env variable is required for Firebase Admin SDK.');
}

function getFirebaseApp(): App {
  if (cachedApp) {
    return cachedApp;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    cachedApp = existingApps[0];
    return cachedApp;
  }

  const rawKey = pickServiceAccountRawKey();

  const creds = JSON.parse(rawKey);
  console.log('[Firebase Admin] Initializing with project ID:', creds.project_id);

  const storageBucket =
    process.env.GCS_BUCKET_NAME

  cachedApp = initializeApp({
    credential: cert(creds),
    storageBucket: storageBucket || undefined,
  });

  return cachedApp;
}

/**
 * Get the 'role-fit-audit' Firestore database
 * Used for: role fit audit data, user submissions
 */
function getDb(): Firestore {
  if (cachedDb) {
    return cachedDb;
  }

  cachedDb = getFirestore(getFirebaseApp(), 'role-fit-audit');
  try {
    cachedDb.settings({ ignoreUndefinedProperties: true });
  } catch (e) {
    // Ignore "Firestore has already been initialized" error
  }
  return cachedDb;
}

/**
 * Get the default Firestore database
 * Used for: analytics, articles, likes, page views
 */
function getDbDefault(): Firestore {
  if (cachedDbDefault) {
    return cachedDbDefault;
  }

  cachedDbDefault = getFirestore(getFirebaseApp());
  try {
    cachedDbDefault.settings({ ignoreUndefinedProperties: true });
  } catch (e) {
    // Ignore "Firestore has already been initialized" error
  }
  return cachedDbDefault;
}

// Export getter functions
export function db() {
  return getDb();
}

// Export default database getter for analytics
export function dbDefault() {
  return getDbDefault();
}

/**
 * Get the default Firebase Storage instance
 */
function getStorageInstance(): Storage {
  if (cachedStorage) {
    return cachedStorage;
  }

  cachedStorage = getStorage(getFirebaseApp());
  return cachedStorage;
}

export function storage() {
  return getStorageInstance();
}

/**
 * Get the default Firebase Auth instance
 */
export function auth() {
  return getAuth(getFirebaseApp());
}
