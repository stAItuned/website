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

/**
 * Image storage metadata
 */
export const writerImageSchema = z.object({
  bucket: z.string(),
  path: z.string(),
  publicUrl: z.string().optional(),
})

export type WriterImage = z.infer<typeof writerImageSchema>

/**
 * Main `writers` collection document schema
 */
export const writerDocumentSchema = z.object({
  slug: z.string().min(1),
  displayName: z.string().min(1),
  name: z.string().min(1),
  surname: z.string().min(1),
  title: z.string().min(1),
  bio: z.string().min(1),
  linkedin: z.string().optional(),
  website: z.string().optional(),
  image: writerImageSchema.optional(),
  published: z.literal(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  uid: z.string().min(1).optional(),
  email: z.string().email().optional(),
})

export type WriterDocument = z.infer<typeof writerDocumentSchema>

/**
 * Public writer profile (safe for API responses)
 */
export const publicWriterSchema = writerDocumentSchema.omit({
  email: true,
  uid: true,
})

export type PublicWriterDocument = z.infer<typeof publicWriterSchema>

/**
 * Lookup `writer_slugs` collection document schema
 */
export const writerSlugDocumentSchema = z.object({
  slug: z.string().min(1),
  updatedAt: z.string().datetime(),
})

export type WriterSlugDocument = z.infer<typeof writerSlugDocumentSchema>

/**
 * Helper to ensure slug consistency
 */
export const normalizeSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
