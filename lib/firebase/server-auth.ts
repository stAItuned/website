import { NextRequest } from 'next/server';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { auth as adminAuth, dbDefault } from '@/lib/firebase/admin';
import { isAdmin } from '@/lib/firebase/admin-emails';

export async function verifyAuth(request: NextRequest): Promise<DecodedIdToken | null> {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await adminAuth().verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error('Auth verification failed:', error);
        return null;
    }
}

export function getAdminDb() {
    const db = dbDefault();
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
