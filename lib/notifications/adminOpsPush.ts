import { getMessaging } from 'firebase-admin/messaging'

export const ADMIN_OPS_TOPIC = 'admin-ops'

export type AdminOpsEventType =
  | 'role_fit_audit_submitted'
  | 'career_os_waitlist_submitted'
  | 'business_apply_submitted'
  | 'contact_submitted'
  | 'feedback_submitted'
  | 'contributors_apply_submitted'

export type AdminOpsPriority = 'normal' | 'high'

export interface AdminOpsEvent {
  eventType: AdminOpsEventType
  entityId: string
  source: string
  createdAt: string
  locale?: string
  environment: 'test' | 'prod'
  priority?: AdminOpsPriority
}

type AdminOpsEventConfig = {
  title: string
  relativeAdminUrl: string
}

const EVENT_CONFIG: Record<AdminOpsEventType, AdminOpsEventConfig> = {
  role_fit_audit_submitted: {
    title: 'Nuovo submit: Role Fit Audit',
    relativeAdminUrl: '/admin/role-fit',
  },
  career_os_waitlist_submitted: {
    title: 'Nuovo submit: Career OS Waitlist',
    relativeAdminUrl: '/admin',
  },
  business_apply_submitted: {
    title: 'Nuovo submit: Business Apply',
    relativeAdminUrl: '/admin',
  },
  contact_submitted: {
    title: 'Nuovo submit: Contact',
    relativeAdminUrl: '/admin',
  },
  feedback_submitted: {
    title: 'Nuovo submit: Feedback',
    relativeAdminUrl: '/admin',
  },
  contributors_apply_submitted: {
    title: 'Nuovo submit: Contributors Apply',
    relativeAdminUrl: '/admin/contributions',
  },
}

export function inferEnvironmentFromHost(host: string | null | undefined): 'test' | 'prod' {
  if (!host) return process.env.NODE_ENV === 'production' ? 'prod' : 'test'
  const normalizedHost = host.toLowerCase()
  if (normalizedHost === 'staituned.com' || normalizedHost === 'www.staituned.com') {
    return 'prod'
  }
  return 'test'
}

function getSiteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://staituned.com').replace(/\/+$/, '')
}

export function buildAdminOpsMessage(event: AdminOpsEvent) {
  const config = EVENT_CONFIG[event.eventType]
  const link = `${getSiteOrigin()}${config.relativeAdminUrl}`

  return {
    topic: ADMIN_OPS_TOPIC,
    notification: {
      title: config.title,
      body: 'Apri Admin per i dettagli.',
    },
    data: {
      eventType: event.eventType,
      entityId: event.entityId,
      source: event.source,
      createdAt: event.createdAt,
      locale: event.locale ?? 'n/a',
      environment: event.environment,
      priority: event.priority ?? 'normal',
      url: config.relativeAdminUrl,
    },
    webpush: {
      fcmOptions: {
        link,
      },
    },
  }
}

export async function sendAdminOpsNotification(event: AdminOpsEvent): Promise<void> {
  const messaging = getMessaging()
  await messaging.send(buildAdminOpsMessage(event))
}
