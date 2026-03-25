import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth as adminAuth } from '@/lib/firebase/admin';
import {
  AUTH_SESSION_COOKIE_NAME,
  AUTH_SESSION_MAX_AGE_MS,
  AUTH_SESSION_MAX_AGE_SECONDS,
} from '@/lib/auth/session';

export const runtime = 'nodejs';

const sessionPayloadSchema = z.object({
  idToken: z.string().min(1, 'idToken is required'),
});

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      {
        status: 400,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }

  const parsed = sessionPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid session payload' },
      {
        status: 400,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }

  try {
    await adminAuth().verifyIdToken(parsed.data.idToken);
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid ID token' },
      {
        status: 401,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }

  try {
    const sessionCookie = await adminAuth().createSessionCookie(parsed.data.idToken, {
      expiresIn: AUTH_SESSION_MAX_AGE_MS,
    });

    const response = NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
      },
    );

    response.cookies.set({
      name: AUTH_SESSION_COOKIE_NAME,
      value: sessionCookie,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: AUTH_SESSION_MAX_AGE_SECONDS,
    });

    return response;
  } catch (error) {
    console.error('[API] auth/session create error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create session cookie' },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }
}
