import { describe, expect, it } from 'vitest';
import { POST } from './route';
import { AUTH_SESSION_COOKIE_NAME } from '@/lib/auth/session';

describe('POST /api/auth/session/logout', () => {
  it('clears the session cookie', async () => {
    const response = await POST();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(response.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value).toBe('');
  });
});
