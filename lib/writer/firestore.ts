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
import { unstable_cache, revalidateTag } from 'next/cache'
import { randomUUID } from 'crypto'

const WRITERS_COLLECTION = 'writers'
const WRITER_SLUGS_COLLECTION = 'writer_slugs'

const PUBLIC_WRITER_CACHE_SECONDS = 300
const REVALIDATE_PROFILE = 'default'

/**
 * Get a public writer profile by slug.
 */
async function fetchPublicWriter(slug: string): Promise<PublicWriterDocument | null> {
  const normalizedSlug = normalizeSlug(slug)
  const snap = await dbDefault().collection(WRITERS_COLLECTION).doc(normalizedSlug).get()
  if (!snap.exists) return null

  const data = snap.data()
  if (!data) return null

  // Ensure profile is public
  if (data.published !== true) return null

  // Strip private fields
  try {
    return publicWriterSchema.parse(data)
  } catch (error) {
    console.error('[writers] Invalid public writer doc:', normalizedSlug, error)
    return null
  }
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
 * Get all public writers.
 * Cached (best-effort) via Next Data Cache.
 */
export const getPublicWritersList = unstable_cache(
  async (): Promise<PublicWriterDocument[]> => {
    const snap = await dbDefault()
      .collection(WRITERS_COLLECTION)
      .where('published', '==', true)
      .get()

    return snap.docs
      .map((d) => {
        try {
          return publicWriterSchema.parse(d.data())
        } catch (e) {
          console.error('Invalid writer doc:', d.id, e)
          return null
        }
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
  currentImage?: WriterDocument['image']
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

  const finalSlug = existingUserSlug ?? derivedSlug

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

  return writerData
}

/**
 * Upload image to Storage
 */
export async function uploadWriterImage(
  slug: string,
  fileBuffer: Buffer,
  mimeType: string
): Promise<WriterDocument['image']> {
  const bucketName = process.env.GCS_BUCKET_NAME
  const bucket = bucketName ? storage().bucket(bucketName) : storage().bucket()
  const normalizedSlug = normalizeSlug(slug)
  const path = `writer_profiles_by_slug/${normalizedSlug}/propic.jpg`
  const file = bucket.file(path)

  const token = randomUUID()
  await file.save(fileBuffer, {
    metadata: {
      contentType: mimeType,
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
