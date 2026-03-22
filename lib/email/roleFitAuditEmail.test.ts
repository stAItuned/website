import { beforeEach, describe, expect, it, vi } from 'vitest'

const resendSendMock = vi.fn()
const sendTelegramFeedbackMock = vi.fn()
const generateRoleFitAuditPDFMock = vi.fn()

vi.mock('resend', () => ({
  Resend: class {
    emails = {
      send: (...args: unknown[]) => resendSendMock(...args),
    }
  },
}))

vi.mock('@/lib/telegram', () => ({
  sendTelegramFeedback: (...args: unknown[]) => sendTelegramFeedbackMock(...args),
}))

vi.mock('../pdf/generatePDF', () => ({
  generateRoleFitAuditPDF: (...args: unknown[]) => generateRoleFitAuditPDFMock(...args),
}))

import { sendRoleFitAuditReportEmail } from './roleFitAuditEmail'
import type { AuditResult } from '@/app/(public)/role-fit-audit/lib/scoring'

const auditResult: AuditResult = {
  scores: { code: 6, data: 5, product: 4, genai: 7, readiness: 6, proof: 5 },
  normalizedScores: { code: 60, data: 50, product: 40, genai: 70, readiness: 60, proof: 50 },
  archetype: {
    id: 'BUILDER',
    name: 'Builder Pragmatico',
    tagline: 'Spedisci cose che funzionano.',
    superpower: 'Execution',
    risk: 'Rischio',
    lever: 'Leva',
  },
  roleRecommendation: {
    now: 'AI Builder',
    next: 'GenAI Engineer',
    nowReasons: ['Reason'],
    requirements: ['Requirement'],
  },
  topGaps: [
    {
      id: 'GAP_QUALITY',
      title: 'Test gap',
      whyBlocks: 'Why',
      fix7Days: 'Fix',
      output: 'Output',
    },
  ],
  readinessLabel: 'Intermediate',
  oneLineDiagnosis: 'Diagnosi',
  nextSteps: ['Step 1'],
  generatedBy: 'ai',
}

describe('sendRoleFitAuditReportEmail', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = {
      ...originalEnv,
      RESEND_API_KEY: 'test-resend-key',
      RESEND_FROM_EMAIL: 'stAItuned <noreply@staituned.com>',
    }

    resendSendMock.mockResolvedValue({ error: null })
    sendTelegramFeedbackMock.mockResolvedValue(undefined)
    generateRoleFitAuditPDFMock.mockResolvedValue(Buffer.from('pdf'))
  })

  it('sends user email without internal cc and sends separate metadata-only internal alert', async () => {
    const success = await sendRoleFitAuditReportEmail({
      email: 'user@example.com',
      name: 'Mario',
      result: auditResult,
      locale: 'it',
      internalAlert: {
        submissionId: 'submission_123',
        generatedBy: 'ai',
        readinessLabel: 'Intermediate',
        archetypeId: 'BUILDER',
        createdAt: '2026-03-22T10:00:00.000Z',
      },
    })

    expect(success).toBe(true)
    expect(resendSendMock).toHaveBeenCalledTimes(1)
    const sentPayload = resendSendMock.mock.calls[0]?.[0] as Record<string, unknown>
    expect(sentPayload.to).toBe('user@example.com')
    expect('cc' in sentPayload).toBe(false)

    expect(sendTelegramFeedbackMock).toHaveBeenCalledTimes(1)
    expect(sendTelegramFeedbackMock).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'role_fit_audit_internal',
        message: expect.stringContaining('Submission: submission_123'),
      }),
    )

    const internalMessage = sendTelegramFeedbackMock.mock.calls[0]?.[0]?.message as string
    expect(internalMessage).not.toContain('user@example.com')
    expect(internalMessage).not.toContain('Mario')
  })
})
