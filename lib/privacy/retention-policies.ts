import type { RetentionPolicy } from '@/lib/privacy/retention'

export type RetentionDataset =
  | 'role_fit_audit_submissions'
  | 'career_os_waitlist'
  | 'business_demo_requests'
  | 'contact_requests'
  | 'feedback_submissions'
  | 'contributor_applications'

export const RETENTION_POLICIES: Record<RetentionDataset, RetentionPolicy> = {
  role_fit_audit_submissions: {
    ttlDays: 365,
    action: 'hard_delete',
    rationale: 'Role Fit submissions retention standard (12 months).',
  },
  career_os_waitlist: {
    ttlDays: 365,
    action: 'hard_delete',
    rationale: 'Career OS waitlist retention standard (12 months).',
  },
  business_demo_requests: {
    ttlDays: 365,
    action: 'hard_delete',
    rationale: 'Business lead retention baseline until WS5 full lifecycle standardization.',
  },
  contact_requests: {
    ttlDays: 365,
    action: 'hard_delete',
    rationale: 'Contact request retention baseline until WS5 full lifecycle standardization.',
  },
  feedback_submissions: {
    ttlDays: 365,
    action: 'hard_delete',
    rationale: 'Feedback retention baseline until WS5 full lifecycle standardization.',
  },
  contributor_applications: {
    ttlDays: 540,
    action: 'hard_delete',
    rationale: 'Contributor applications retained in 12-24 month policy window (set to 18 months).',
  },
}

export function isRetentionDataset(value: string): value is RetentionDataset {
  return value in RETENTION_POLICIES
}

export function getRetentionPolicy(dataset: RetentionDataset): RetentionPolicy {
  return RETENTION_POLICIES[dataset]
}

export const RETENTION_DATASETS = Object.keys(RETENTION_POLICIES) as RetentionDataset[]
