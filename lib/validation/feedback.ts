import { z } from 'zod'

/**
 * Validation schema for feedback submissions across the app.
 */
export const feedbackPayloadSchema = z.object({
    category: z.string().min(1).max(80),
    message: z.string().min(6).max(2000),
    email: z.union([z.string().email(), z.literal('')]).optional(),
    page: z.string().min(1).max(500),
    userAgent: z.string().max(500).optional(),
    consent: z.literal(true),
    website: z.string().max(200).optional(),
    userId: z.string().max(200).optional(),
    userName: z.string().max(200).optional(),
})

export type FeedbackPayload = z.infer<typeof feedbackPayloadSchema>
