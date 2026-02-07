import { describe, expect, it } from 'vitest'
import { feedbackPayloadSchema } from './feedback'

describe('feedbackPayloadSchema', () => {
    it('accepts a valid payload', () => {
        const result = feedbackPayloadSchema.safeParse({
            category: 'comment',
            message: 'Messaggio valido per il feedback.',
            email: 'test@example.com',
            page: 'https://staituned.com/contribute',
            userAgent: 'test-agent',
            consent: true,
            website: '',
        })

        expect(result.success).toBe(true)
    })

    it('rejects payloads without consent', () => {
        const result = feedbackPayloadSchema.safeParse({
            category: 'bug',
            message: 'Testo sufficiente per il feedback.',
            email: 'test@example.com',
            page: 'https://staituned.com/contribute',
            userAgent: 'test-agent',
            consent: false,
            website: '',
        })

        expect(result.success).toBe(false)
    })

    it('rejects payloads with short message', () => {
        const result = feedbackPayloadSchema.safeParse({
            category: 'idea',
            message: 'Ciao',
            email: 'test@example.com',
            page: 'https://staituned.com/contribute',
            userAgent: 'test-agent',
            consent: true,
            website: '',
        })

        expect(result.success).toBe(false)
    })

    it('rejects invalid emails when provided', () => {
        const result = feedbackPayloadSchema.safeParse({
            category: 'comment',
            message: 'Messaggio valido per il feedback.',
            email: 'invalid-email',
            page: 'https://staituned.com/contribute',
            userAgent: 'test-agent',
            consent: true,
            website: '',
        })

        expect(result.success).toBe(false)
    })
})
