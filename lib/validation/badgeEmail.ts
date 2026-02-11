import { z } from 'zod'

/**
 * Payload for sending a badge award email via admin approval.
 */
export const badgeEmailSendSchema = z.object({
  authorSlug: z.string().trim().min(1),
  badgeId: z.string().trim().min(1),
})

export type BadgeEmailSendPayload = z.infer<typeof badgeEmailSendSchema>
