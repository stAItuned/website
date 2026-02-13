import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { NextRequest } from 'next/server'
import { POST } from './route'
import { sendTelegramFeedback } from '@/lib/telegram'

vi.mock('@/lib/telegram', () => ({
  sendTelegramFeedback: vi.fn(),
}))

function createReq(body: unknown): NextRequest {
  return {
    json: vi.fn(async () => body),
  } as unknown as NextRequest
}

describe('api/feedbacks route', () => {
  const hadSlackWebhook = Object.prototype.hasOwnProperty.call(
    process.env,
    'SLACK_WEBHOOK_FEEDBACK'
  )
  const originalSlackWebhook = process.env.SLACK_WEBHOOK_FEEDBACK

  function restoreSlackWebhookEnv() {
    if (!hadSlackWebhook) {
      delete process.env.SLACK_WEBHOOK_FEEDBACK
      return
    }

    if (typeof originalSlackWebhook === 'string') {
      process.env.SLACK_WEBHOOK_FEEDBACK = originalSlackWebhook
      return
    }

    delete process.env.SLACK_WEBHOOK_FEEDBACK
  }

  beforeEach(() => {
    vi.resetAllMocks()
    restoreSlackWebhookEnv()
  })

  afterEach(() => {
    restoreSlackWebhookEnv()
    vi.unstubAllGlobals()
  })

  it('returns ok on POST when honeypot is filled (bot)', async () => {
    const response = await POST(
      createReq({
        category: 'bug',
        message: 'This should be ignored',
        page: '/en',
        consent: true,
        website: 'https://spam.example',
      })
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(sendTelegramFeedback).not.toHaveBeenCalled()
  })

  it('returns 400 on POST when payload is invalid', async () => {
    const response = await POST(
      createReq({
        category: 'bug',
        message: 'short',
        page: '/en',
        consent: true,
      })
    )
    const payload = (await response.json()) as { error: string; details?: unknown }

    expect(response.status).toBe(400)
    expect(payload.error).toBe('Invalid payload')
    expect(payload.details).toBeDefined()
    expect(sendTelegramFeedback).not.toHaveBeenCalled()
  })

  it('sends Telegram feedback and returns ok for valid payload', async () => {
    const response = await POST(
      createReq({
        category: 'bug',
        message: 'Something is not working on mobile.',
        email: 'mario@example.com',
        page: '/en/learn',
        userAgent: 'UA',
        consent: true,
        website: '',
      })
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })

    expect(sendTelegramFeedback).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'bug',
        message: 'Something is not working on mobile.',
        email: 'mario@example.com',
        page: '/en/learn',
        userAgent: 'UA',
      })
    )
  })

  it('forwards feedback to Slack when webhook is configured', async () => {
    process.env.SLACK_WEBHOOK_FEEDBACK = 'https://hooks.slack.test'

    const fetchMock = vi.fn(async () => ({ ok: true }))
    vi.stubGlobal('fetch', fetchMock)

    const response = await POST(
      createReq({
        category: 'idea',
        message: 'Add a dark mode toggle.',
        page: '/it',
        consent: true,
        website: '',
      })
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://hooks.slack.test',
      expect.objectContaining({ method: 'POST' })
    )
  })
})
