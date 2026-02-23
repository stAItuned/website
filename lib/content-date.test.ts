import { describe, expect, it } from 'vitest'

import { getContentDateTime } from './content-date'

describe('getContentDateTime', () => {
  it('prioritizes updatedAt when both dates are valid', () => {
    const date = '2025-01-01T00:00:00.000Z'
    const updatedAt = '2026-01-01T00:00:00.000Z'

    expect(getContentDateTime(date, updatedAt)).toBe(new Date(updatedAt).getTime())
  })

  it('falls back to date when updatedAt is missing or invalid', () => {
    const date = '2025-01-01T00:00:00.000Z'

    expect(getContentDateTime(date)).toBe(new Date(date).getTime())
    expect(getContentDateTime(date, 'not-a-date')).toBe(new Date(date).getTime())
  })

  it('returns 0 when both values are missing or invalid', () => {
    expect(getContentDateTime()).toBe(0)
    expect(getContentDateTime('nope', 'still-nope')).toBe(0)
  })
})
