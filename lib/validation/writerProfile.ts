import { z } from 'zod'

const urlOrEmpty = z.union([z.string().url(), z.literal('')])

/**
 * Writer profile payload (fields come from multipart/form-data).
 */
export const writerProfileFieldsSchema = z.object({
  name: z.string().trim().min(1).max(80),
  surname: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(120),
  bio: z
    .string()
    .trim()
    .min(20, { message: 'Bio must contain at least 20 characters.' })
    .max(6000),
  linkedin: urlOrEmpty.optional(),
  website: urlOrEmpty.optional(),
  consent: z.literal(true),
})

export type WriterProfileFields = z.infer<typeof writerProfileFieldsSchema>
