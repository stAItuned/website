import { describe, expect, it, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from './route';
import { AUTH_SESSION_COOKIE_NAME } from '@/lib/auth/session';

const verifyIdTokenMock = vi.fn();
const createSessionCookieMock = vi.fn();

vi.mock('@/lib/firebase/admin', () => ({
  auth: () => ({
    verifyIdToken: (...args: unknown[]) => verifyIdTokenMock(...args),
    createSessionCookie: (...args: unknown[]) => createSessionCookieMock(...args),
  }),
}));

describe('POST /api/auth/session', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when payload is missing idToken', async () => {
    const request = new NextRequest('http://localhost/api/auth/session', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: 'Invalid session payload',
    });
  });

  it('returns 401 when id token is invalid', async () => {
    verifyIdTokenMock.mockRejectedValue(new Error('invalid token'));

    const request = new NextRequest('http://localhost/api/auth/session', {
      method: 'POST',
      body: JSON.stringify({ idToken: 'bad-token' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: 'Invalid ID token',
    });
  });

  it('creates a secure session cookie for valid token', async () => {
    verifyIdTokenMock.mockResolvedValue({ uid: 'uid-123' });
    createSessionCookieMock.mockResolvedValue('session-cookie');

    const request = new NextRequest('http://localhost/api/auth/session', {
      method: 'POST',
      body: JSON.stringify({ idToken: 'good-token' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(response.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value).toBe('session-cookie');
    expect(createSessionCookieMock).toHaveBeenCalledWith('good-token', expect.objectContaining({
      expiresIn: expect.any(Number),
    }));
  });
});
