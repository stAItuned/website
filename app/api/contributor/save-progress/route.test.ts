import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { NextRequest } from 'next/server'
import { POST } from './route'
import { verifyAuth } from '@/lib/firebase/server-auth'
import { createContribution, getContribution, getUserSignedAgreements, updateContribution } from '@/lib/firebase/contributor-db'
import { evaluateAgreementSignaturePolicy } from '@/lib/contributor/agreementPolicy'
import { CONTRIBUTOR_AGREEMENT_LEGAL_EXCEPTION } from '@/lib/privacy/retention-policies'

vi.mock('@/lib/firebase/server-auth', () => ({
  verifyAuth: vi.fn(),
}))

vi.mock('@/lib/firebase/contributor-db', () => ({
  createContribution: vi.fn(),
  updateContribution: vi.fn(),
  getContribution: vi.fn(),
  getUserSignedAgreements: vi.fn(),
}))

vi.mock('@/lib/contributor/agreementPolicy', () => ({
  evaluateAgreementSignaturePolicy: vi.fn(),
}))

vi.mock('@/lib/firebase/admin', () => ({
  dbDefault: vi.fn(() => ({
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({
        set: vi.fn(async () => undefined),
      })),
    })),
  })),
}))

vi.mock('@/lib/writer/onboarding-state', () => ({
  resolveWriterOnboardingState: vi.fn(() => 'agreement_signed'),
  isWriterPublishEnabled: vi.fn(() => true),
}))

vi.mock('@/lib/contributor/agreement-service', () => ({
  sendAgreementWithPDF: vi.fn(async () => ({ hash: 'hash_123' })),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => ({
    get: (name: string) => {
      if (name === 'x-forwarded-for') return '127.0.0.1'
      if (name === 'user-agent') return 'vitest-agent'
      return null
    },
  })),
}))

function createReq(body: unknown): NextRequest {
  return {
    json: vi.fn(async () => body),
    headers: new Headers({ Authorization: 'Bearer token' }),
  } as unknown as NextRequest
}

describe('api/contributor/save-progress route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(verifyAuth).mockResolvedValue({
      uid: 'user_123',
      email: 'writer@example.com',
      displayName: 'Writer',
    } as never)
    vi.mocked(getUserSignedAgreements).mockResolvedValue([])
    vi.mocked(evaluateAgreementSignaturePolicy).mockReturnValue('allow_new_signature')
    vi.mocked(createContribution).mockResolvedValue('contrib_123')
    vi.mocked(getContribution).mockResolvedValue(null)
    vi.mocked(updateContribution).mockResolvedValue(undefined)
  })

  it('returns unauthorized without auth', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(null)
    const response = await POST(createReq({}))
    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ success: false, error: 'Unauthorized' })
  })

  it('stores agreement with legal exception metadata', async () => {
    const response = await POST(createReq({
      data: {
        agreement: {
          agreed: true,
          legalName: 'Mario Rossi',
          fiscal_code: 'RSSMRA80A01H501U',
          version: '1.1',
          agreedAt: '2026-03-23T10:00:00.000Z',
        },
      },
    }))

    expect(response.status).toBe(200)
    expect(createContribution).toHaveBeenCalledWith(
      expect.objectContaining({
        agreement: expect.objectContaining({
          checkbox_general: true,
          legal_retention_mode: 'legal_exception',
          legal_retention_rationale: CONTRIBUTOR_AGREEMENT_LEGAL_EXCEPTION,
          legal_retention_review_due_at: expect.any(String),
          dsar_delete_mode: 'assisted_only',
        }),
      }),
    )
  })
})
