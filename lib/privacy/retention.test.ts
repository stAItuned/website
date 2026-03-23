import { describe, expect, it } from 'vitest'
import {
  applyRetentionMetadata,
  buildRetentionMetadata,
  computeRetentionUntil,
  isExpired,
  type RetentionPolicy,
} from '@/lib/privacy/retention'

const policy: RetentionPolicy = {
  ttlDays: 365,
  action: 'hard_delete',
  rationale: 'test',
}

describe('retention utilities', () => {
  it('computes retentionUntil from createdAt and policy ttl', () => {
    const createdAt = '2026-01-01T00:00:00.000Z'
    const retentionUntil = computeRetentionUntil(createdAt, policy)
    expect(retentionUntil).toBe('2027-01-01T00:00:00.000Z')
  })

  it('returns true when retentionUntil is in the past', () => {
    expect(isExpired('2026-01-02T00:00:00.000Z', '2026-01-01T00:00:00.000Z')).toBe(true)
    expect(isExpired('2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z')).toBe(false)
  })

  it('builds standard retention metadata', () => {
    const fixedNow = new Date('2026-03-22T10:00:00.000Z')
    const metadata = buildRetentionMetadata(policy, fixedNow)

    expect(metadata).toMatchObject({
      createdAt: '2026-03-22T10:00:00.000Z',
      updatedAt: '2026-03-22T10:00:00.000Z',
      status: 'active',
      deletedAt: null,
      anonymizedAt: null,
    })
    expect(metadata.retentionUntil).toBe('2027-03-22T10:00:00.000Z')
  })

  it('applies retention metadata to payload preserving original fields', () => {
    const fixedNow = new Date('2026-03-22T10:00:00.000Z')
    const payload = { email: 'user@example.com', source: 'test' }
    const withRetention = applyRetentionMetadata(payload, policy, fixedNow)

    expect(withRetention.email).toBe('user@example.com')
    expect(withRetention.source).toBe('test')
    expect(withRetention.status).toBe('active')
    expect(withRetention.retentionUntil).toBe('2027-03-22T10:00:00.000Z')
  })
})
