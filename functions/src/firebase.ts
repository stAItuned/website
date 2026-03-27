import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const LEGACY_FIRESTORE_DATABASE_ID = "(default)";
const MAIN_FIRESTORE_DATABASE_ID = process.env.FIRESTORE_MAIN_DATABASE_ID || "eu-primary";

// Initialize Firebase Admin once
if (!getApps().length) {
  initializeApp({ credential: applicationDefault() });
}

if (MAIN_FIRESTORE_DATABASE_ID === LEGACY_FIRESTORE_DATABASE_ID) {
  throw new Error(
    'FIRESTORE_MAIN_DATABASE_ID cannot be "(default)". Cloud Functions must use the EU main database "eu-primary".'
  );
}

export const db = getFirestore(getApps()[0], MAIN_FIRESTORE_DATABASE_ID);
