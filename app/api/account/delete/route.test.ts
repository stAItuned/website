import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { NextRequest } from 'next/server'
import { POST } from './route'
import { verifyAuth, getAdminDb } from '@/lib/firebase/server-auth'
import { auth as adminAuth } from '@/lib/firebase/admin'

vi.mock('@/lib/firebase/server-auth', () => ({
  verifyAuth: vi.fn(),
  getAdminDb: vi.fn(),
}))

vi.mock('@/lib/firebase/admin', () => ({
  auth: vi.fn(),
}))

function createReq(body: unknown): NextRequest {
  return {
    json: vi.fn(async () => body),
    headers: new Headers({ Authorization: 'Bearer token' }),
  } as unknown as NextRequest
}

function createEmptyDbMock() {
  const makeDocRef = () => ({
    get: vi.fn(async () => ({ exists: false, data: () => ({}) })),
    delete: vi.fn(async () => undefined),
    set: vi.fn(async () => undefined),
    collection: vi.fn(() => ({
      get: vi.fn(async () => ({ docs: [] })),
    })),
  })

  return {
    collection: vi.fn(() => ({
      doc: vi.fn(() => makeDocRef()),
      where: vi.fn(() => ({
        get: vi.fn(async () => ({ docs: [] })),
      })),
    })),
  }
}

function createDbMockWithUsersDeleteError() {
  const usersDocRef = {
    get: vi.fn(async () => ({ exists: true, data: () => ({}) })),
    delete: vi.fn(async () => {
      throw new Error('delete failed')
    }),
    set: vi.fn(async () => undefined),
    collection: vi.fn(() => ({
      get: vi.fn(async () => ({ docs: [] })),
    })),
  }

  const genericDocRef = {
    get: vi.fn(async () => ({ exists: false, data: () => ({}) })),
    delete: vi.fn(async () => undefined),
    set: vi.fn(async () => undefined),
    collection: vi.fn(() => ({
      get: vi.fn(async () => ({ docs: [] })),
    })),
  }

  return {
    collection: vi.fn((name: string) => ({
      doc: vi.fn(() => (name === 'users' ? usersDocRef : genericDocRef)),
      where: vi.fn(() => ({
        get: vi.fn(async () => ({ docs: [] })),
      })),
    })),
  }
}

describe('api/account/delete route', () => {
  const deleteUser = vi.fn(async () => undefined)

  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(adminAuth).mockReturnValue({ deleteUser } as unknown as ReturnType<typeof adminAuth>)
    vi.mocked(getAdminDb).mockReturnValue(createEmptyDbMock() as unknown as ReturnType<typeof getAdminDb>)
  })

  it('returns unauthorized when token is missing/invalid', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(null)

    const response = await POST(createReq({}))

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ success: false, error: 'Unauthorized' })
  })

  it('returns machine-readable dataset coverage summary', async () => {
    vi.mocked(verifyAuth).mockResolvedValue({
      uid: 'user_123',
      email: 'user@example.com',
    } as never)

    const response = await POST(createReq({ mode: 'data' }))
    expect(response.status).toBe(200)

    const payload = await response.json() as {
      success: boolean
      mode: string
      summary: { datasetCoverage: Record<string, unknown> }
      deletionCoverageVersion: string
    }

    expect(payload.success).toBe(true)
    expect(payload.mode).toBe('data')
    expect(payload.deletionCoverageVersion).toBe('2026-03-23')
    expect(payload.summary.datasetCoverage).toHaveProperty('fcm_tokens')
    expect(payload.summary.datasetCoverage).toHaveProperty('leads_ai_act_tools')
    expect(payload.summary.datasetCoverage).toHaveProperty('career_os_applications')
    expect(deleteUser).not.toHaveBeenCalled()
  })

  it('reports dataset-specific error status on partial cleanup failures', async () => {
    vi.mocked(verifyAuth).mockResolvedValue({
      uid: 'user_123',
      email: 'user@example.com',
    } as never)
    vi.mocked(getAdminDb).mockReturnValue(
      createDbMockWithUsersDeleteError() as unknown as ReturnType<typeof getAdminDb>,
    )

    const response = await POST(createReq({ mode: 'data' }))
    expect(response.status).toBe(200)
    const payload = await response.json() as {
      summary: {
        errors: string[]
        datasetCoverage: Record<string, { status: string; notes: string[] }>
      }
    }

    expect(payload.summary.errors.some((entry) => entry.startsWith('users:'))).toBe(true)
    expect(payload.summary.datasetCoverage.users.status).toBe('error')
    expect(payload.summary.datasetCoverage.users.notes.join(' ')).toContain('delete failed')
  })
})
