import { describe, expect, it } from 'vitest'
import { buildAdminOpsMessage, inferEnvironmentFromHost } from '@/lib/notifications/adminOpsPush'

describe('adminOpsPush', () => {
  it('builds metadata-only push payload without personal fields', () => {
    const message = buildAdminOpsMessage({
      eventType: 'role_fit_audit_submitted',
      entityId: 'submission_123',
      source: '/api/role-fit-audit/submit',
      createdAt: '2026-03-23T10:00:00.000Z',
      locale: 'it',
      environment: 'prod',
    })

    expect(message.topic).toBe('admin-ops')
    expect(message.notification?.title).toContain('Role Fit Audit')
    expect(message.data?.entityId).toBe('submission_123')
    expect(message.data?.url).toBe('/admin/role-fit')
    expect(message.notification?.body).toBe('Apri Admin per i dettagli.')
    expect(JSON.stringify(message)).not.toContain('@')
    expect(JSON.stringify(message)).not.toContain('linkedin')
    expect(JSON.stringify(message)).not.toContain('paypal')
  })

  it('infers prod only on staituned production host', () => {
    expect(inferEnvironmentFromHost('staituned.com')).toBe('prod')
    expect(inferEnvironmentFromHost('www.staituned.com')).toBe('prod')
    expect(inferEnvironmentFromHost('localhost:3000')).toBe('test')
    expect(inferEnvironmentFromHost('staituned-dev.web.app')).toBe('test')
  })
})
