import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;

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

  cachedApp = initializeApp({
    credential: cert(JSON.parse(rawKey)),
  });
  
  return cachedApp;
}

function getDb(): Firestore {
  if (cachedDb) {
    return cachedDb;
  }
  
  cachedDb = getFirestore(getFirebaseApp());
  return cachedDb;
}

// Export a getter function instead of the instance
export function db() {
  return getDb();
}
