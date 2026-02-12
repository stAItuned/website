import { NextRequest } from 'next/server';
import { App, getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { isAdmin } from '@/lib/firebase/admin-emails';

// Initialize Firebase Admin safely
function getFirebaseAdmin(): App {
    if (getApps().length > 0) {
        return getApps()[0];
    }

    const serviceAccountKey = process.env.FB_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKey || serviceAccountKey.includes('placeholder')) {
        throw new Error('Firebase Admin requires FB_SERVICE_ACCOUNT_KEY to be set.');
    }

    return initializeApp({
        credential: cert(JSON.parse(serviceAccountKey)),
    });
}

export async function verifyAuth(request: NextRequest) {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const app = getFirebaseAdmin();
        const auth = getAuth(app);
        const decodedToken = await auth.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error('Auth verification failed:', error);
        return null;
    }
}

export function getAdminDb() {
    const app = getFirebaseAdmin();
    const db = getFirestore(app);
    try {
        db.settings({ ignoreUndefinedProperties: true });
    } catch (e) {
        // Ignore setting already set error if called multiple times on same instance
    }
    return db;
}

export async function verifyAdmin(request: NextRequest) {
    const user = await verifyAuth(request);
    if (!user) {
        return { error: 'Unauthorized', status: 401 };
    }
    if (!isAdmin(user.email)) {
        return { error: 'Forbidden', status: 403 };
    }
    return { user };
}
