import { dbDefault, storage } from '@/lib/firebase/admin'
import {
  WriterDocument,
  PublicWriterDocument,
  writerDocumentSchema,
  publicWriterSchema,
  writerSlugDocumentSchema,
  normalizeSlug,
  WriterProfileFields,
} from '@/lib/validation/writerProfile'
import { unstable_cache, revalidatePath, revalidateTag } from 'next/cache'
import { randomUUID } from 'crypto'
import { shouldSkipFirestoreDuringBuild } from '@/lib/next-phase'

const WRITERS_COLLECTION = 'writers'
const WRITER_SLUGS_COLLECTION = 'writer_slugs'

const PUBLIC_WRITER_CACHE_SECONDS = 300
const REVALIDATE_PROFILE = 'default'
const MAX_SLUG_SUFFIX_ATTEMPTS = 200

function toTrimmedString(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function coercePublicWriter(data: unknown, fallbackSlug?: string): PublicWriterDocument | null {
  if (!data || typeof data !== 'object') return null
  const asRecord = data as Record<string, unknown>
  if (asRecord.published === false) return null

  const parsed = publicWriterSchema.safeParse({ ...asRecord, published: true })
  if (parsed.success) return parsed.data

  const slug = toTrimmedString(asRecord.slug) ?? fallbackSlug ?? null
  const nameParts = [toTrimmedString(asRecord.name), toTrimmedString(asRecord.surname)].filter(
    (part): part is string => Boolean(part)
  )
  const fallbackDisplayName = nameParts.join(' ').trim()
  const displayName = toTrimmedString(asRecord.displayName) ?? (fallbackDisplayName || null)

  if (!slug || !displayName) return null

  const imageSource =
    asRecord.image && typeof asRecord.image === 'object'
      ? (asRecord.image as Record<string, unknown>)
      : null

  const bucket = toTrimmedString(imageSource?.bucket)
  const path = toTrimmedString(imageSource?.path)
  const publicUrl = toTrimmedString(imageSource?.publicUrl) ?? undefined

  return {
    slug,
    displayName,
    name: toTrimmedString(asRecord.name) ?? displayName,
    surname: toTrimmedString(asRecord.surname) ?? '',
    title: toTrimmedString(asRecord.title) ?? '',
    bio: toTrimmedString(asRecord.bio) ?? '',
    linkedin: toTrimmedString(asRecord.linkedin) ?? undefined,
    website: toTrimmedString(asRecord.website) ?? undefined,
    image: bucket && path ? { bucket, path, publicUrl } : undefined,
    published: true,
    createdAt: toTrimmedString(asRecord.createdAt) ?? new Date(0).toISOString(),
    updatedAt: toTrimmedString(asRecord.updatedAt) ?? new Date(0).toISOString(),
  }
}

function extractPublicAvatarUrl(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null
  const asRecord = data as Record<string, unknown>
  if (asRecord.published === false) return null

  const image = asRecord.image
  if (!image || typeof image !== 'object') return null
  const imageRecord = image as Record<string, unknown>
  const publicUrl = imageRecord.publicUrl

  if (typeof publicUrl !== 'string') return null
  const trimmed = publicUrl.trim()
  return trimmed.length > 0 ? trimmed : null
}

/**
 * Get a public writer profile by slug.
 */
async function fetchPublicWriter(slug: string): Promise<PublicWriterDocument | null> {
  if (shouldSkipFirestoreDuringBuild()) return null

  const normalizedSlug = normalizeSlug(slug)
  const snap = await dbDefault().collection(WRITERS_COLLECTION).doc(normalizedSlug).get()
  if (!snap.exists) return null

  const data = snap.data()
  if (!data) return null

  return coercePublicWriter(data, normalizedSlug)
}

/**
 * Get a public writer profile by slug.
 * Cached (best-effort) via Next Data Cache.
 */
export async function getPublicWriter(slug: string): Promise<PublicWriterDocument | null> {
  const normalizedSlug = normalizeSlug(slug)
  return unstable_cache(
    async () => fetchPublicWriter(normalizedSlug),
    ['public-writer', normalizedSlug],
    {
      revalidate: PUBLIC_WRITER_CACHE_SECONDS,
      tags: [`writer:${normalizedSlug}`],
    }
  )()
}

/**
 * Get a writer avatar URL by slug.
 * Tolerates legacy/incomplete writer docs (no strict schema parsing).
 */
export async function getPublicWriterAvatarUrl(slug: string): Promise<string | null> {
  const normalizedSlug = normalizeSlug(slug)
  return unstable_cache(
    async () => {
      if (shouldSkipFirestoreDuringBuild()) return null
      const snap = await dbDefault().collection(WRITERS_COLLECTION).doc(normalizedSlug).get()
      if (!snap.exists) return null
      return extractPublicAvatarUrl(snap.data())
    },
    ['public-writer-avatar', normalizedSlug],
    {
      revalidate: PUBLIC_WRITER_CACHE_SECONDS,
      tags: [`writer:${normalizedSlug}`],
    }
  )()
}

/**
 * Get a writer avatar URL by display name.
 * Useful when slug normalization from content does not match the canonical writer slug.
 */
export async function getPublicWriterAvatarUrlByDisplayName(displayName: string): Promise<string | null> {
  const normalizedDisplayName = displayName.trim().toLowerCase().replace(/\s+/g, ' ')
  return unstable_cache(
    async () => {
      if (shouldSkipFirestoreDuringBuild()) return null
      if (!normalizedDisplayName) return null

      const snap = await dbDefault()
        .collection(WRITERS_COLLECTION)
        .where('displayName', '==', displayName.trim())
        .limit(3)
        .get()

      for (const doc of snap.docs) {
        const avatarUrl = extractPublicAvatarUrl(doc.data())
        if (avatarUrl) return avatarUrl
      }

      return null
    },
    ['public-writer-avatar-by-name', normalizedDisplayName],
    {
      revalidate: PUBLIC_WRITER_CACHE_SECONDS,
      tags: ['writers:list'],
    }
  )()
}

/**
 * Get all public writers.
 * Cached (best-effort) via Next Data Cache.
 */
export const getPublicWritersList = unstable_cache(
  async (): Promise<PublicWriterDocument[]> => {
    if (shouldSkipFirestoreDuringBuild()) return []

    const snap = await dbDefault().collection(WRITERS_COLLECTION).get()

    return snap.docs
      .map((d) => {
        return coercePublicWriter(d.data(), d.id)
      })
      .filter((w): w is PublicWriterDocument => w !== null)
  },
  ['public-writers-list'],
  {
    revalidate: PUBLIC_WRITER_CACHE_SECONDS,
    tags: ['writers:list'],
  }
)


/**
 * Private: Get writer profile by UID.
 * Checks writer_slugs first.
 */
export async function getWriterByUid(uid: string): Promise<WriterDocument | null> {
  const slugSnap = await dbDefault().collection(WRITER_SLUGS_COLLECTION).doc(uid).get()

  if (!slugSnap.exists) return null

  const { slug } = writerSlugDocumentSchema.parse(slugSnap.data())

  // Direct fetch by slug from writers collection (doc ID = slug)
  const docSnap = await dbDefault().collection(WRITERS_COLLECTION).doc(slug).get()

  if (!docSnap.exists) return null

  return writerDocumentSchema.parse(docSnap.data())
}

/**
 * Private: Create/Update writer profile.
 * - Updates/Creates 'writers/<slug>'
 * - Updates/Creates 'writer_slugs/<uid>'
 * - Revalidates cache
 */
export async function upsertWriterProfile(
  uid: string,
  data: WriterProfileFields,
  email: string,
  currentImage?: WriterDocument['image'],
  resolvedSlug?: string
) {
  const db = dbDefault()
  const derivedSlug = normalizeSlug(`${data.name}-${data.surname}`)

  // Keep slug stable once assigned (important for public URLs and slug-based image paths).
  let existingUserSlug: string | null = null
  const userSlugRef = db.collection(WRITER_SLUGS_COLLECTION).doc(uid)
  const userSlugSnap = await userSlugRef.get()

  if (userSlugSnap.exists) {
    existingUserSlug = userSlugSnap.data()?.slug || null
  }

  const finalSlug = existingUserSlug ?? resolvedSlug ?? derivedSlug

  // Check if the final slug is taken by another UID
  const existingSlugDoc = await db.collection(WRITERS_COLLECTION).doc(finalSlug).get()
  if (existingSlugDoc.exists) {
    const existingData = existingSlugDoc.data()
    if (existingData && existingData.uid && existingData.uid !== uid) {
      throw new Error('Slug already taken by another user')
    }
  }

  const batch = db.batch()

  const writerDocRef = db.collection(WRITERS_COLLECTION).doc(finalSlug)
  const now = new Date().toISOString()

  const writerData: WriterDocument = {
    slug: finalSlug,
    displayName: `${data.name} ${data.surname}`,
    name: data.name,
    surname: data.surname,
    title: data.title,
    bio: data.bio,
    linkedin: data.linkedin || undefined,
    website: data.website || undefined,
    image: currentImage,
    published: true,
    createdAt: existingSlugDoc.exists ? (existingSlugDoc.data()?.createdAt ?? now) : now,
    updatedAt: now,
    uid,
    email,
  }

  batch.set(writerDocRef, writerData, { merge: true })

  batch.set(userSlugRef, {
    slug: finalSlug,
    updatedAt: now,
  })

  await batch.commit()

  revalidateTag('writers:list', REVALIDATE_PROFILE)
  revalidateTag(`writer:${finalSlug}`, REVALIDATE_PROFILE)
  revalidatePath('/author')
  revalidatePath('/meet')
  // Learn article routes are statically generated and embed authorData.
  // Invalidate the learn tree so avatar/title updates propagate quickly.
  revalidatePath('/learn', 'layout')
  revalidatePath(`/author/${finalSlug}`)

  return writerData
}

/**
 * Resolves the slug to use for a writer.
 * - Keeps existing slug stable for users who already have one.
 * - Creates a unique slug for new users when there are collisions.
 */
export async function resolveWriterSlug(uid: string, baseSlug: string): Promise<string> {
  const db = dbDefault()
  const normalizedBase = normalizeSlug(baseSlug)
  const userSlugRef = db.collection(WRITER_SLUGS_COLLECTION).doc(uid)
  const userSlugSnap = await userSlugRef.get()

  if (userSlugSnap.exists) {
    const currentSlug = userSlugSnap.data()?.slug
    if (typeof currentSlug === 'string' && currentSlug.length > 0) {
      return currentSlug
    }
  }

  const fallbackBase = normalizedBase || `writer-${uid.slice(0, 8)}`

  const baseDoc = await db.collection(WRITERS_COLLECTION).doc(fallbackBase).get()
  if (!baseDoc.exists) return fallbackBase

  for (let suffix = 2; suffix <= MAX_SLUG_SUFFIX_ATTEMPTS; suffix += 1) {
    const candidate = `${fallbackBase}-${suffix}`
    const candidateDoc = await db.collection(WRITERS_COLLECTION).doc(candidate).get()
    if (!candidateDoc.exists) return candidate
  }

  return `${fallbackBase}-${randomUUID().slice(0, 8)}`
}

/**
 * Upload image to Storage
 */
export async function uploadWriterImage(
  slug: string,
  fileBuffer: Buffer,
  mimeType: string
): Promise<WriterDocument['image']> {
  const bucketName =
    process.env.GCS_BUCKET_NAME ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    storage().app.options.storageBucket

  if (!bucketName || String(bucketName).trim().length === 0) {
    throw new Error(
      'Missing storage bucket configuration. Set GCS_BUCKET_NAME or NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET.'
    )
  }

  const bucket = storage().bucket(String(bucketName))
  const normalizedSlug = normalizeSlug(slug)
  const path = `writer_profiles_by_slug/${normalizedSlug}/propic.jpg`
  const file = bucket.file(path)

  const token = randomUUID()
  await file.save(fileBuffer, {
    metadata: {
      contentType: mimeType,
      cacheControl: 'public, max-age=86400',
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  })

  return {
    bucket: bucket.name,
    path,
    publicUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media&token=${token}`,
  }
}

/**
 * Admin: Get full writer profile by slug (including email/private fields).
 * Not cached to ensure fresh data for admin operations.
 */
export async function getAdminWriter(slug: string): Promise<WriterDocument | null> {
  if (shouldSkipFirestoreDuringBuild()) return null

  const normalizedSlug = normalizeSlug(slug)
  const snap = await dbDefault().collection(WRITERS_COLLECTION).doc(normalizedSlug).get()
  if (!snap.exists) return null

  const data = snap.data()
  if (!data) return null

  try {
    return writerDocumentSchema.parse(data)
  } catch (error) {
    console.error('[getAdminWriter] Invalid writer doc:', normalizedSlug, error)
    return null
  }
}
