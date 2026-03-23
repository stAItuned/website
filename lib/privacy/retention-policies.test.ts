import { describe, expect, it } from 'vitest'
import {
  RETENTION_DATASETS,
  RETENTION_POLICIES,
  getRetentionPolicy,
  isRetentionDataset,
} from '@/lib/privacy/retention-policies'

describe('retention policies', () => {
  it('defines policies for all MVP datasets', () => {
    expect(RETENTION_DATASETS).toEqual(
      expect.arrayContaining([
        'role_fit_audit_submissions',
        'career_os_waitlist',
        'business_demo_requests',
        'contact_requests',
        'feedback_submissions',
        'contributor_applications',
      ]),
    )
  })

  it('uses hard_delete default action for all datasets', () => {
    for (const dataset of RETENTION_DATASETS) {
      expect(RETENTION_POLICIES[dataset].action).toBe('hard_delete')
      expect(RETENTION_POLICIES[dataset].ttlDays).toBeGreaterThan(0)
    }
  })

  it('validates dataset keys', () => {
    expect(isRetentionDataset('career_os_waitlist')).toBe(true)
    expect(isRetentionDataset('unknown_collection')).toBe(false)
  })

  it('returns policy by dataset key', () => {
    const policy = getRetentionPolicy('career_os_waitlist')
    expect(policy.ttlDays).toBe(365)
  })
})
