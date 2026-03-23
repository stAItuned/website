export type RetentionStatus = 'active' | 'expired' | 'deleted' | 'anonymized'

export type RetentionAction = 'hard_delete'

export interface RetentionPolicy {
  ttlDays: number
  action: RetentionAction
  rationale: string
  legalException?: string
}

export interface RetentionMetadata {
  createdAt: string
  updatedAt: string
  retentionUntil: string
  status: RetentionStatus
  deletedAt: string | null
  anonymizedAt: string | null
}

const DAY_MS = 1000 * 60 * 60 * 24

export function computeRetentionUntil(createdAtIso: string, policy: RetentionPolicy): string {
  const createdAtTs = new Date(createdAtIso).getTime()
  if (Number.isNaN(createdAtTs)) {
    throw new Error(`Invalid createdAt ISO value: ${createdAtIso}`)
  }
  return new Date(createdAtTs + (policy.ttlDays * DAY_MS)).toISOString()
}

export function isExpired(nowIso: string, retentionUntilIso: string): boolean {
  const nowTs = new Date(nowIso).getTime()
  const retentionTs = new Date(retentionUntilIso).getTime()
  if (Number.isNaN(nowTs) || Number.isNaN(retentionTs)) return false
  return retentionTs < nowTs
}

export function buildRetentionMetadata(policy: RetentionPolicy, now: Date = new Date()): RetentionMetadata {
  const createdAt = now.toISOString()
  return {
    createdAt,
    updatedAt: createdAt,
    retentionUntil: computeRetentionUntil(createdAt, policy),
    status: 'active',
    deletedAt: null,
    anonymizedAt: null,
  }
}

export function applyRetentionMetadata<T extends Record<string, unknown>>(
  payload: T,
  policy: RetentionPolicy,
  now: Date = new Date(),
): T & RetentionMetadata {
  const retention = buildRetentionMetadata(policy, now)
  const payloadStatus = typeof payload.status === 'string' ? payload.status : null
  const status = payloadStatus === 'active'
    || payloadStatus === 'expired'
    || payloadStatus === 'deleted'
    || payloadStatus === 'anonymized'
    ? payloadStatus
    : retention.status

  return {
    ...retention,
    ...payload,
    status,
    retentionUntil: retention.retentionUntil,
    createdAt: typeof payload.createdAt === 'string' ? payload.createdAt : retention.createdAt,
    updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : retention.updatedAt,
    deletedAt: payload.deletedAt === null || typeof payload.deletedAt === 'string' ? payload.deletedAt : null,
    anonymizedAt: payload.anonymizedAt === null || typeof payload.anonymizedAt === 'string' ? payload.anonymizedAt : null,
  }
}
