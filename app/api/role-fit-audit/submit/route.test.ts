import { beforeEach, describe, expect, it, vi } from 'vitest'
import { POST } from './route'

const addMock = vi.fn()
const sendTelegramFeedbackMock = vi.fn()
const sendRoleFitAuditReportEmailMock = vi.fn()
const generateAIAuditResultMock = vi.fn()
const sendAdminOpsNotificationMock = vi.fn()

vi.mock('@/lib/firebase/admin', () => ({
  db: () => ({
    collection: () => ({
      add: (...args: unknown[]) => addMock(...args),
    }),
  }),
}))

vi.mock('@/lib/telegram', () => ({
  sendTelegramFeedback: (...args: unknown[]) => sendTelegramFeedbackMock(...args),
}))

vi.mock('@/lib/notifications/adminOpsPush', () => ({
  inferEnvironmentFromHost: () => 'test',
  sendAdminOpsNotification: (...args: unknown[]) => sendAdminOpsNotificationMock(...args),
}))

vi.mock('@/lib/email/roleFitAuditEmail', () => ({
  sendRoleFitAuditReportEmail: (...args: unknown[]) => sendRoleFitAuditReportEmailMock(...args),
}))

vi.mock('@/lib/ai/roleFitAuditAI', () => ({
  generateAIAuditResult: (...args: unknown[]) => generateAIAuditResultMock(...args),
}))

vi.mock('@/app/(public)/role-fit-audit/lib/questions', () => ({
  getAnswerLabelByQuestionId: () => 'Sample answer label',
}))

function makeRequest(body: unknown): Request {
  return new Request('http://localhost/api/role-fit-audit/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'user-agent': 'test-agent' },
    body: JSON.stringify(body),
  })
}

type SubmitRequest = Parameters<typeof POST>[0]

describe('POST /api/role-fit-audit/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    addMock.mockResolvedValue({ id: 'submission_123' })
    generateAIAuditResultMock.mockResolvedValue({
      generatedBy: 'ai',
      scores: { code: 6, data: 5, product: 4, genai: 7 },
      normalizedScores: { code: 60, data: 50, product: 40, genai: 70, readiness: 55 },
      archetype: { id: 'builder', name: 'Builder' },
      readinessLabel: 'Intermediate',
      roleRecommendation: { now: 'AI Builder', next: 'GenAI Engineer' },
      topGaps: [{ id: 'gap_1', title: 'Evaluation design' }],
      aiEnhancements: { coachingNote: 'Sample note' },
    })
    sendRoleFitAuditReportEmailMock.mockResolvedValue(true)
    sendTelegramFeedbackMock.mockResolvedValue(undefined)
  })

  it('returns 400 when acceptedPrivacy is missing', async () => {
    const response = await POST(
      makeRequest({
        answers: { Q1: 2 },
        email: 'user@example.com',
        locale: 'en',
      }) as unknown as SubmitRequest,
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'You must accept privacy consent to submit the Role Fit Audit.',
    })
  })

  it('returns 400 when acceptedPrivacy is false', async () => {
    const response = await POST(
      makeRequest({
        answers: { Q1: 2 },
        email: 'user@example.com',
        locale: 'it',
        acceptedPrivacy: false,
      }) as unknown as SubmitRequest,
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      error: 'Devi accettare la privacy per inviare il Role Fit Audit.',
    })
  })

  it('stores compliance fields and sends metadata-only telegram alert', async () => {
    const response = await POST(
      makeRequest({
        answers: { Q1: 2 },
        email: 'user@example.com',
        name: 'Mario Rossi',
        linkedinUrl: 'https://linkedin.com/in/mario',
        paypalOrderId: 'PAYPAL-123',
        marketingConsent: true,
        acceptedPrivacy: true,
        locale: 'it',
      }) as unknown as SubmitRequest,
    )

    expect(response.status).toBe(200)
    expect(addMock).toHaveBeenCalledTimes(1)
    expect(addMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'active',
        privacyVersion: '2026-03-22',
        dataMinimizationVersion: 'v1',
        consent: expect.objectContaining({
          privacy: expect.objectContaining({
            accepted: true,
            version: '2026-03-22',
          }),
          marketing: expect.objectContaining({
            requested: true,
          }),
        }),
        retentionUntil: expect.any(String),
      }),
    )

    const telegramCallArg = sendTelegramFeedbackMock.mock.calls[0]?.[0]
    expect(telegramCallArg).toBeDefined()
    expect(telegramCallArg.message).toContain('Submission: submission_123')
    expect(telegramCallArg.message).not.toContain('user@example.com')
    expect(telegramCallArg.message).not.toContain('Mario Rossi')
    expect(telegramCallArg.message).not.toContain('linkedin.com')
    expect(telegramCallArg.message).not.toContain('PAYPAL-123')

    expect(sendRoleFitAuditReportEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        internalAlert: expect.objectContaining({
          submissionId: 'submission_123',
        }),
      }),
    )
    expect(sendAdminOpsNotificationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        eventType: 'role_fit_audit_submitted',
        entityId: 'submission_123',
      }),
    )
  })
})
