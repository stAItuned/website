import { describe, expect, it } from 'vitest'
import type { NextRequest } from 'next/server'
import { POST } from './route'

function createReq(): NextRequest {
  return {
    json: async () => ({}),
    headers: new Headers({ 'user-agent': 'test-agent' }),
  } as unknown as NextRequest
}

describe('POST /api/newsletter/subscribe', () => {
  it('returns 410 and newsletter_dismissed payload', async () => {
    const response = await POST(createReq())
    const payload = await response.json()

    expect(response.status).toBe(410)
    expect(payload).toEqual({
      ok: false,
      error: 'newsletter_dismissed',
      message: 'Newsletter subscriptions are no longer available.',
    })
  })
})
