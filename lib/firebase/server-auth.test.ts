import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import {
  verifySessionCookie,
  verifySessionCookieValue,
  verifyAdminSession,
} from './server-auth';
import { AUTH_SESSION_COOKIE_NAME } from '@/lib/auth/session';

const verifySessionCookieMock = vi.fn();
const isAdminMock = vi.fn();

vi.mock('@/lib/firebase/admin', () => ({
  auth: () => ({
    verifySessionCookie: (...args: unknown[]) => verifySessionCookieMock(...args),
  }),
  dbDefault: vi.fn(),
}));

vi.mock('@/lib/firebase/admin-emails', () => ({
  isAdmin: (...args: unknown[]) => isAdminMock(...args),
}));

describe('server auth session helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('verifies session cookie value', async () => {
    verifySessionCookieMock.mockResolvedValue({ email: 'admin@example.com' });

    await expect(verifySessionCookieValue('cookie-value')).resolves.toEqual({
      email: 'admin@example.com',
    });
    expect(verifySessionCookieMock).toHaveBeenCalledWith('cookie-value', true);
  });

  it('returns null when session cookie is missing', async () => {
    const request = new NextRequest('http://localhost/admin');

    await expect(verifySessionCookie(request)).resolves.toBeNull();
  });

  it('returns 403 for authenticated non-admin session', async () => {
    verifySessionCookieMock.mockResolvedValue({ email: 'user@example.com' });
    isAdminMock.mockReturnValue(false);

    const request = new NextRequest('http://localhost/admin', {
      headers: {
        cookie: `${AUTH_SESSION_COOKIE_NAME}=cookie-value`,
      },
    });

    await expect(verifyAdminSession(request)).resolves.toEqual({
      error: 'Forbidden',
      status: 403,
    });
  });

  it('returns user for authenticated admin session', async () => {
    verifySessionCookieMock.mockResolvedValue({ email: 'admin@example.com' });
    isAdminMock.mockReturnValue(true);

    const request = new NextRequest('http://localhost/admin', {
      headers: {
        cookie: `${AUTH_SESSION_COOKIE_NAME}=cookie-value`,
      },
    });

    await expect(verifyAdminSession(request)).resolves.toEqual({
      user: { email: 'admin@example.com' },
    });
  });
});
