import type { RetentionPolicy } from '@/lib/privacy/retention'

export type RetentionDataset =
  | 'role_fit_audit_submissions'
  | 'career_os_waitlist'
  | 'career_os_applications'
  | 'career_os_audit'
  | 'leads_ai_act_tools'
  | 'business_demo_requests'
  | 'contact_requests'
  | 'feedback_submissions'
  | 'contributor_applications'
  | 'fcm_tokens'
  | 'fcm_admin_tokens'

export const CONTRIBUTOR_AGREEMENT_LEGAL_EXCEPTION =
  'Contributor agreement evidence may be retained for contractual defense and legal accountability.'

export const CONTRIBUTOR_AGREEMENT_LEGAL_EXCEPTION_RETENTION_YEARS = 10

const DAY_MS = 1000 * 60 * 60 * 24

export function computeContributorAgreementLegalReviewDueAt(fromIso: string): string {
  const baseTs = new Date(fromIso).getTime()
  if (Number.isNaN(baseTs)) return new Date(Date.now() + (CONTRIBUTOR_AGREEMENT_LEGAL_EXCEPTION_RETENTION_YEARS * 365 * DAY_MS)).toISOString()
  return new Date(baseTs + (CONTRIBUTOR_AGREEMENT_LEGAL_EXCEPTION_RETENTION_YEARS * 365 * DAY_MS)).toISOString()
}

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
  career_os_applications: {
    ttlDays: 365,
    action: 'hard_delete',
    rationale: 'Career OS applications retention baseline (12 months).',
  },
  career_os_audit: {
    ttlDays: 365,
    action: 'hard_delete',
    rationale: 'Career OS audit requests retention baseline (12 months).',
  },
  leads_ai_act_tools: {
    ttlDays: 365,
    action: 'hard_delete',
    rationale: 'AI EU Act leads retention baseline (12 months) with token lifecycle controls.',
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
  fcm_tokens: {
    ttlDays: 90,
    action: 'hard_delete',
    rationale: 'Editorial push tokens retained for a short technical window.',
  },
  fcm_admin_tokens: {
    ttlDays: 90,
    action: 'hard_delete',
    rationale: 'Admin operational push tokens retained for a short technical window.',
  },
}

export function isRetentionDataset(value: string): value is RetentionDataset {
  return value in RETENTION_POLICIES
}

export function getRetentionPolicy(dataset: RetentionDataset): RetentionPolicy {
  return RETENTION_POLICIES[dataset]
}

export const RETENTION_DATASETS = Object.keys(RETENTION_POLICIES) as RetentionDataset[]
