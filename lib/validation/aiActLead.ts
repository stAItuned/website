import { z } from 'zod'

export const aiActLeadPayloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  company: z.string().trim().max(200).optional().default(''),
  role: z.string().trim().min(2).max(80),
  source: z.enum(['landing', 'email', 'direct']).optional().default('landing'),
  privacyPolicyAccepted: z.literal(true),
  dataProcessingAccepted: z.literal(true),
  marketingConsent: z.boolean().optional().default(false),
  locale: z.enum(['it', 'en']).optional().default('it'),
  website: z.string().max(200).optional().default(''),
})

export type AiActLeadPayload = z.infer<typeof aiActLeadPayloadSchema>
