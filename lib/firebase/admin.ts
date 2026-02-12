import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;
let cachedDbDefault: Firestore | null = null;
let cachedStorage: Storage | null = null;

function getFirebaseApp(): App {
  if (cachedApp) {
    return cachedApp;
  }

  const existingApps = getApps();
  if (existingApps.length > 0) {
    cachedApp = existingApps[0];
    return cachedApp;
  }

  const rawKey = process.env.FB_SERVICE_ACCOUNT_KEY
    || (process.env.FB_SERVICE_ACCOUNT_KEY_B64 ? Buffer.from(process.env.FB_SERVICE_ACCOUNT_KEY_B64, 'base64').toString('utf8') : undefined);

  if (!rawKey) {
    throw new Error('FB_SERVICE_ACCOUNT_KEY env variable is required for Firebase Admin SDK.');
  }

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
