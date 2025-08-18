import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function initFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApps()[0]
  }
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (!key) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY env variable is required for Firebase Admin SDK.')
  }
  try {
    return initializeApp({
      credential: cert(JSON.parse(key)),
    })
  } catch (error) {
    throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY: ' + error)
  }
}

const app = initFirebaseAdmin()
export const db = getFirestore(app)
