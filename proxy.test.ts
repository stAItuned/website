import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from './proxy';

const verifyProxyAdminSessionMock = vi.fn();

vi.mock('@/lib/auth/proxy-admin-session', () => ({
  verifyProxyAdminSession: (...args: unknown[]) => verifyProxyAdminSessionMock(...args),
}));

describe('proxy admin auth enforcement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects anonymous users to sign-in with original path', async () => {
    verifyProxyAdminSessionMock.mockResolvedValue('unauthenticated');

    const response = await proxy(new NextRequest('http://localhost/admin/compliance?tab=docs'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost/signin?redirect=%2Fadmin%2Fcompliance%3Ftab%3Ddocs',
    );
  });

  it('redirects non-admin users to 403', async () => {
    verifyProxyAdminSessionMock.mockResolvedValue('non_admin');

    const response = await proxy(new NextRequest('http://localhost/admin'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/403');
  });

  it('allows admin users through', async () => {
    verifyProxyAdminSessionMock.mockResolvedValue('admin');

    const response = await proxy(new NextRequest('http://localhost/admin/compliance'));

    expect(response.status).toBe(200);
  });
});
