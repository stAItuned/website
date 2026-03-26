import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from './proxy';
describe('proxy admin auth enforcement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects anonymous users to sign-in with original path', async () => {
    const response = await proxy(new NextRequest('http://localhost/admin/compliance?tab=docs'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe(
      'http://localhost/signin?redirect=%2Fadmin%2Fcompliance%3Ftab%3Ddocs',
    );
  });

  it('allows requests with a session cookie through to server-side verification', async () => {
    const request = new NextRequest('http://localhost/admin/compliance');
    request.cookies.set('stai_session', 'cookie-value');
    const response = await proxy(request);

    expect(response.status).toBe(200);
  });
});
