import { initializeApp, applicationDefault, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
// Initialize Firebase Admin once
if (!getApps().length) {
    initializeApp({ credential: applicationDefault() });
}
export const db = getFirestore();
//# sourceMappingURL=firebase.js.map