import { createRemoteJWKSet, jwtVerify } from 'jose';
import { isAdmin } from '@/lib/firebase/admin-emails';

export type ProxyAdminSessionState = 'admin' | 'non_admin' | 'unauthenticated';

const FIREBASE_SESSION_ISSUER = 'https://session.firebase.google.com';
const FIREBASE_JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
);

function getFirebaseProjectId(): string | null {
  return process.env.GCP_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || null;
}

/**
 * Edge-safe verification for Firebase session cookies inside `proxy.ts`.
 *
 * This validates signature and claims so proxy can reject anonymous users before
 * routing into `/admin/*`. Revocation is still enforced server-side via
 * `firebase-admin` when admin pages render.
 */
export async function verifyProxyAdminSession(
  sessionCookie: string | null | undefined,
): Promise<ProxyAdminSessionState> {
  const projectId = getFirebaseProjectId();
  if (!sessionCookie || !projectId) {
    return 'unauthenticated';
  }

  try {
    const { payload } = await jwtVerify(sessionCookie, FIREBASE_JWKS, {
      algorithms: ['RS256'],
      audience: projectId,
      issuer: `${FIREBASE_SESSION_ISSUER}/${projectId}`,
    });

    const email = typeof payload.email === 'string' ? payload.email : null;
    return isAdmin(email) ? 'admin' : 'non_admin';
  } catch {
    return 'unauthenticated';
  }
}
