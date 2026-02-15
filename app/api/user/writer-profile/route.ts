import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/firebase/server-auth'
import { dbDefault } from '@/lib/firebase/admin'
import { checkUserHasAgreement } from '@/lib/firebase/contributor-db'
import {
  getWriterByUid,
  resolveWriterSlug,
  upsertWriterProfile,
  uploadWriterImage,
} from '@/lib/writer/firestore'
import { normalizeSlug, writerProfileFieldsSchema } from '@/lib/validation/writerProfile'
import { isWriterPublishEnabled, resolveWriterOnboardingState } from '@/lib/writer/onboarding-state'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function jsonNoStore<T>(data: T, init?: ResponseInit) {
  const response = NextResponse.json(data, init)
  response.headers.set('Cache-Control', 'no-store')
  return response
}

// Shared logic for creating/updating profile
async function handleUpsert(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user?.email || !user.uid) {
      return jsonNoStore(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const currentProfile = await getWriterByUid(user.uid)

    const formData = await request.formData()
    const imageFile = formData.get('image')

    const parsed = writerProfileFieldsSchema.safeParse({
      name: String(formData.get('name') ?? ''),
      surname: String(formData.get('surname') ?? ''),
      title: String(formData.get('title') ?? ''),
      bio: String(formData.get('bio') ?? ''),
      linkedin: String(formData.get('linkedin') ?? ''),
      website: String(formData.get('website') ?? ''),
      consent: formData.get('consent') === 'true',
    })

    if (!parsed.success) {
      return jsonNoStore(
        {
          success: false,
          error: 'Invalid fields',
          details: parsed.error.flatten(),
        },
        { status: 400 }
      )
    }

    let uploadedImage = undefined
    const derivedSlug = normalizeSlug(`${parsed.data.name}-${parsed.data.surname}`)
    const finalSlug = await resolveWriterSlug(user.uid, currentProfile?.slug ?? derivedSlug)

    // Handle Image Upload
    if (imageFile instanceof File) {
      const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
      if (!allowedTypes.has(imageFile.type)) {
        return jsonNoStore(
          {
            success: false,
            error: 'Invalid image type. Allowed: JPEG, PNG, WebP',
          },
          { status: 400 }
        )
      }

      const maxSizeBytes = 5 * 1024 * 1024
      if (imageFile.size > maxSizeBytes) {
        return jsonNoStore(
          { success: false, error: 'Image too large (max 5MB)' },
          { status: 400 }
        )
      }

      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const { default: sharp } = await import('sharp')

      // Resize to 500x500 cover
      const processedBuffer = await sharp(buffer)
        .resize(500, 500, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 85 })
        .toBuffer()

      // Upload to Storage
      // We explicitly treat it as image/jpeg after conversion
      uploadedImage = await uploadWriterImage(finalSlug, processedBuffer, 'image/jpeg')
    } else {
      // If no new image, we might need to preserve the old one.
      // `upsertWriterProfile` takes `currentImage`. 
      // If we pass undefined, it might overwrite? 
      // Actually `upsertWriterProfile` implementation replaces the whole doc or merges?
      // It does `batch.set(..., { merge: true })`.
      // But if I pass `image: undefined` in the object, it might be ignored by `set` with merge if key is missing, 
      // OR it might not update it. 
      // However, looking at my implementation of `upsertWriterProfile`:
      /* 
         const writerData: WriterDocument = {
           ...
           image: currentImage,
           ...
         }
         batch.set(writerDocRef, writerData, { merge: true })
      */
      // If `currentImage` is undefined, `image` key is undefined. Firestore `set` with merge: true will NOT delete specific fields if they are undefined in JS (they are skipped).
      // BUT `writerData` has explicit keys. If I pass `image: undefined`, it might clear it?
      // Wait, generic `WriterDocument` has optional `image`.
      // If I want to PRESERVE existing image if not provided, I should fetch it first?
      // `upsertWriterProfile` is designed to take `currentImage`.

      // Strategy: Fetch existing profile to get current image if not replacing.
      if (currentProfile?.image) {
        uploadedImage = currentProfile.image
      }
    }

    const updatedProfile = await upsertWriterProfile(
      user.uid,
      parsed.data,
      user.email,
      uploadedImage,
      finalSlug
    )

    const writerActivatedAt = new Date().toISOString()
    const hasAgreement = await checkUserHasAgreement(user.uid)
    const onboardingState = resolveWriterOnboardingState({
      hasProfile: true,
      hasAgreement,
    })

    await dbDefault().collection('users').doc(user.uid).set(
      {
        writerIntent: 'yes',
        writerProfileStatus: 'completed',
        writerActivatedAt,
        writerOnboardingCompleted: true,
        writerOnboardingVersion: 'v1',
        writerOnboardingState: onboardingState,
        writerPublishEnabled: isWriterPublishEnabled(onboardingState),
        updatedAt: writerActivatedAt,
      },
      { merge: true }
    )

    return jsonNoStore({
      success: true,
      profile: updatedProfile, // Returning full profile including slug
      writerActivatedAt,
      // Legacy fields for compatibility if needed immediately
      slug: updatedProfile.slug,
      profilePath: `/author/${updatedProfile.slug}`,
    })
  } catch (error) {
    console.error('[API] writer-profile upsert error:', error)
    return jsonNoStore(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user?.email || !user.uid) {
      return jsonNoStore(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const profile = await getWriterByUid(user.uid)
    if (!profile) {
      return jsonNoStore(
        { success: false, error: 'Writer profile not found' },
        { status: 404 }
      )
    }

    return jsonNoStore({
      success: true,
      profile: {
        slug: profile.slug,
        profilePath: `/author/${profile.slug}`,
        // Use publicUrl if available, otherwise fallback or empty
        imageUrl: profile.image?.publicUrl || '',
        name: profile.name,
        surname: profile.surname,
        title: profile.title,
        bio: profile.bio,
        linkedin: profile.linkedin || '',
        website: profile.website || '',
      },
    })
  } catch (error) {
    console.error('[API] writer-profile GET error:', error)
    return jsonNoStore(
      { success: false, error: 'Failed to load profile' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return handleUpsert(request)
}

export async function PUT(request: NextRequest) {
  return handleUpsert(request)
}
