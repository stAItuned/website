import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { GET, POST, PUT } from './route'
import { dbDefault } from '@/lib/firebase/admin'
import { verifyAuth } from '@/lib/firebase/server-auth'
import {
  getWriterByUid,
  resolveWriterSlug,
  upsertWriterProfile,
} from '@/lib/writer/firestore'
import { checkUserHasAgreement } from '@/lib/firebase/contributor-db'
import type { WriterDocument } from '@/lib/validation/writerProfile'
import type { DecodedIdToken } from 'firebase-admin/auth'

vi.mock('@/lib/firebase/server-auth', () => ({
  verifyAuth: vi.fn(),
}))

vi.mock('@/lib/firebase/admin', () => ({
  dbDefault: vi.fn(),
}))

vi.mock('@/lib/writer/firestore', () => ({
  getWriterByUid: vi.fn(),
  resolveWriterSlug: vi.fn(),
  upsertWriterProfile: vi.fn(),
  uploadWriterImage: vi.fn(),
}))

vi.mock('@/lib/firebase/contributor-db', () => ({
  checkUserHasAgreement: vi.fn(),
}))

type FormDataOverrides = Partial<{
  name: string
  surname: string
  title: string
  bio: string
  linkedin: string
  website: string
  consent: string
}>

function createValidFormData(overrides?: FormDataOverrides): FormData {
  const formData = new FormData()
  formData.set('name', overrides?.name ?? 'Mario')
  formData.set('surname', overrides?.surname ?? 'Rossi')
  formData.set('title', overrides?.title ?? 'AI Engineer')
  formData.set('bio', overrides?.bio ?? 'Sono un professionista AI con esperienza.')
  formData.set('linkedin', overrides?.linkedin ?? 'https://www.linkedin.com/in/mario-rossi')
  formData.set('website', overrides?.website ?? 'https://mariorossi.dev')
  formData.set('consent', overrides?.consent ?? 'true')
  return formData
}

function createRequest(method: 'GET', body?: FormData): NextRequest {
  return new NextRequest('http://localhost/api/user/writer-profile', {
    method,
    body,
    headers: {
      Authorization: 'Bearer token',
    },
  })
}

function createPostRequest(formData: FormData): NextRequest {
  return {
    formData: vi.fn(async () => formData),
    headers: new Headers({
      Authorization: 'Bearer token',
    }),
  } as unknown as NextRequest
}

function createWriterProfile(overrides?: Partial<WriterDocument>): WriterDocument {
  return {
    slug: 'mario-rossi',
    displayName: 'Mario Rossi',
    name: 'Mario',
    surname: 'Rossi',
    title: 'AI Engineer',
    bio: 'Bio estesa del writer',
    published: true,
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
    uid: 'uid-123',
    email: 'mario@example.com',
    ...overrides,
  }
}

function createDecodedIdToken(overrides?: Partial<DecodedIdToken>): DecodedIdToken {
  const now = Math.floor(Date.now() / 1000)
  const projectId = overrides?.aud ?? 'test-project'
  const uid = overrides?.uid ?? 'uid-123'

  return {
    aud: projectId,
    auth_time: now,
    exp: now + 60 * 60,
    firebase: {
      identities: {},
      sign_in_provider: 'custom',
    },
    iat: now,
    iss: `https://securetoken.google.com/${projectId}`,
    sub: uid,
    uid,
    ...overrides,
  }
}

describe('api/user/writer-profile route', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(checkUserHasAgreement).mockResolvedValue(false)

    const set = vi.fn(async () => undefined)
    const doc = vi.fn(() => ({ set }))
    const collection = vi.fn(() => ({ doc }))

    vi.mocked(dbDefault).mockReturnValue({
      collection,
    } as unknown as ReturnType<typeof dbDefault>)
  })

  it('returns 401 on POST when user is not authenticated', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(null)

    const response = await POST(createPostRequest(createValidFormData()))
    const payload = (await response.json()) as { success: boolean; error: string }

    expect(response.status).toBe(401)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(payload).toEqual({ success: false, error: 'Unauthorized' })
  })

  it('returns 400 on POST when payload is invalid', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(createDecodedIdToken({ email: 'mario@example.com' }))
    vi.mocked(getWriterByUid).mockResolvedValue(null)

    const invalidForm = createValidFormData()
    invalidForm.set('bio', 'abc')

    const response = await POST(createPostRequest(invalidForm))
    const payload = (await response.json()) as { success: boolean; error: string; details?: unknown }

    expect(response.status).toBe(400)
    expect(payload.success).toBe(false)
    expect(payload.error).toBe('Invalid fields')
    expect(payload.details).toBeDefined()
  })

  it('returns 400 on POST when image type is unsupported', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(createDecodedIdToken({ email: 'mario@example.com' }))
    vi.mocked(getWriterByUid).mockResolvedValue(null)
    vi.mocked(resolveWriterSlug).mockResolvedValue('mario-rossi')

    const formData = createValidFormData()
    const invalidImage = new File(['fake'], 'avatar.gif', { type: 'image/gif' })
    formData.set('image', invalidImage)

    const response = await POST(createPostRequest(formData))
    const payload = (await response.json()) as { success: boolean; error: string }

    expect(response.status).toBe(400)
    expect(payload).toEqual({
      success: false,
      error: 'Invalid image type. Allowed: JPEG, PNG, WebP',
    })
  })

  it('creates writer profile and updates onboarding metadata on POST', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(createDecodedIdToken({ email: 'mario@example.com' }))

    const existingImage = {
      bucket: 'bucket-name',
      path: 'writer_profiles_by_slug/mario-rossi/propic.jpg',
      publicUrl: 'https://cdn.example.com/mario-rossi.jpg',
    }

    const existingProfile = createWriterProfile({
      image: existingImage,
    })
    const updatedProfile = createWriterProfile({
      image: existingImage,
      updatedAt: '2026-02-13T10:00:00.000Z',
    })

    vi.mocked(getWriterByUid).mockResolvedValue(existingProfile)
    vi.mocked(resolveWriterSlug).mockResolvedValue('mario-rossi')
    vi.mocked(upsertWriterProfile).mockResolvedValue(updatedProfile)

    const response = await POST(createPostRequest(createValidFormData()))
    const payload = (await response.json()) as {
      success: boolean
      profile: WriterDocument
      writerActivatedAt: string
      slug: string
      profilePath: string
    }

    expect(response.status).toBe(200)
    expect(payload.success).toBe(true)
    expect(payload.profile.slug).toBe('mario-rossi')
    expect(payload.slug).toBe('mario-rossi')
    expect(payload.profilePath).toBe('/author/mario-rossi')
    expect(payload.writerActivatedAt).toBeTruthy()
    expect(response.headers.get('Cache-Control')).toBe('no-store')

    expect(upsertWriterProfile).toHaveBeenCalledWith(
      'uid-123',
      expect.objectContaining({
        name: 'Mario',
        surname: 'Rossi',
      }),
      'mario@example.com',
      existingImage,
      'mario-rossi'
    )

    const firestore = vi.mocked(dbDefault).mock.results[0]?.value
    const collection = firestore.collection as ReturnType<typeof vi.fn>
    const usersCollection = collection.mock.results[0]?.value
    const doc = usersCollection.doc as ReturnType<typeof vi.fn>
    const userDoc = doc.mock.results[0]?.value
    const set = userDoc.set as ReturnType<typeof vi.fn>
    const setArgs = set.mock.calls[0]

    expect(collection).toHaveBeenCalledWith('users')
    expect(doc).toHaveBeenCalledWith('uid-123')
    expect(setArgs[0]).toEqual(
      expect.objectContaining({
        writerIntent: 'yes',
        writerProfileStatus: 'completed',
        writerOnboardingCompleted: true,
        writerOnboardingVersion: 'v1',
        writerOnboardingState: 'profile_completed',
        writerPublishEnabled: false,
      })
    )
    expect(setArgs[1]).toEqual({ merge: true })
  })

  it('marks publish enabled when agreement is already signed', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(createDecodedIdToken({ email: 'mario@example.com' }))
    vi.mocked(checkUserHasAgreement).mockResolvedValue(true)
    vi.mocked(getWriterByUid).mockResolvedValue(null)
    vi.mocked(resolveWriterSlug).mockResolvedValue('mario-rossi')
    vi.mocked(upsertWriterProfile).mockResolvedValue(createWriterProfile())

    const response = await POST(createPostRequest(createValidFormData()))
    const payload = (await response.json()) as { success: boolean }

    expect(response.status).toBe(200)
    expect(payload.success).toBe(true)

    const firestore = vi.mocked(dbDefault).mock.results[0]?.value
    const collection = firestore.collection as ReturnType<typeof vi.fn>
    const usersCollection = collection.mock.results[0]?.value
    const doc = usersCollection.doc as ReturnType<typeof vi.fn>
    const userDoc = doc.mock.results[0]?.value
    const set = userDoc.set as ReturnType<typeof vi.fn>
    const setArgs = set.mock.calls[0]

    expect(setArgs[0]).toEqual(
      expect.objectContaining({
        writerOnboardingState: 'agreement_signed',
        writerPublishEnabled: true,
      })
    )
  })

  it('accepts linkedin/website without protocol and forwards them as-is', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(createDecodedIdToken({ email: 'mario@example.com' }))

    vi.mocked(getWriterByUid).mockResolvedValue(null)
    vi.mocked(resolveWriterSlug).mockResolvedValue('mario-rossi')
    vi.mocked(upsertWriterProfile).mockResolvedValue(createWriterProfile())

    const response = await POST(
      createPostRequest(
        createValidFormData({
          website: 'mariorossi.dev',
          linkedin: 'linkedin.com/in/mario-rossi',
        })
      )
    )
    const payload = (await response.json()) as { success: boolean }

    expect(response.status).toBe(200)
    expect(payload.success).toBe(true)

    expect(upsertWriterProfile).toHaveBeenCalledWith(
      'uid-123',
      expect.objectContaining({
        website: 'mariorossi.dev',
        linkedin: 'linkedin.com/in/mario-rossi',
      }),
      'mario@example.com',
      undefined,
      'mario-rossi'
    )
  })

  it('returns 404 on GET when profile is missing', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(createDecodedIdToken({ email: 'mario@example.com' }))
    vi.mocked(getWriterByUid).mockResolvedValue(null)

    const response = await GET(createRequest('GET'))
    const payload = (await response.json()) as { success: boolean; error: string }

    expect(response.status).toBe(404)
    expect(payload).toEqual({ success: false, error: 'Writer profile not found' })
  })

  it('returns 401 on GET when user is not authenticated', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(null)

    const response = await GET(createRequest('GET'))
    const payload = (await response.json()) as { success: boolean; error: string }

    expect(response.status).toBe(401)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(payload).toEqual({ success: false, error: 'Unauthorized' })
  })

  it('returns profile payload on GET when profile exists', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(createDecodedIdToken({ email: 'mario@example.com' }))
    vi.mocked(getWriterByUid).mockResolvedValue(
      createWriterProfile({
        linkedin: 'https://www.linkedin.com/in/mario-rossi',
        website: 'https://mariorossi.dev',
        image: {
          bucket: 'bucket-name',
          path: 'writer_profiles_by_slug/mario-rossi/propic.jpg',
          publicUrl: 'https://cdn.example.com/mario-rossi.jpg',
        },
      })
    )

    const response = await GET(createRequest('GET'))
    const payload = (await response.json()) as {
      success: boolean
      profile: {
        slug: string
        profilePath: string
        imageUrl: string
        name: string
        surname: string
      }
    }

    expect(response.status).toBe(200)
    expect(payload.success).toBe(true)
    expect(payload.profile).toEqual({
      slug: 'mario-rossi',
      profilePath: '/author/mario-rossi',
      imageUrl: 'https://cdn.example.com/mario-rossi.jpg',
      name: 'Mario',
      surname: 'Rossi',
      title: 'AI Engineer',
      bio: 'Bio estesa del writer',
      linkedin: 'https://www.linkedin.com/in/mario-rossi',
      website: 'https://mariorossi.dev',
    })
  })

  it('returns 400 on POST when image is too large', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(createDecodedIdToken({ email: 'mario@example.com' }))
    vi.mocked(getWriterByUid).mockResolvedValue(null)
    vi.mocked(resolveWriterSlug).mockResolvedValue('mario-rossi')

    const formData = createValidFormData()
    const tooLarge = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'avatar.png', {
      type: 'image/png',
    })
    formData.set('image', tooLarge)

    const response = await POST(createPostRequest(formData))
    const payload = (await response.json()) as { success: boolean; error: string }

    expect(response.status).toBe(400)
    expect(payload).toEqual({ success: false, error: 'Image too large (max 5MB)' })
  })

  it('uses current slug when resolving writer slug', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(createDecodedIdToken({ email: 'mario@example.com' }))
    vi.mocked(getWriterByUid).mockResolvedValue(
      createWriterProfile({
        slug: 'existing-slug',
      })
    )
    vi.mocked(resolveWriterSlug).mockResolvedValue('existing-slug')
    vi.mocked(upsertWriterProfile).mockResolvedValue(createWriterProfile({ slug: 'existing-slug' }))

    const response = await POST(createPostRequest(createValidFormData()))
    expect(response.status).toBe(200)

    expect(resolveWriterSlug).toHaveBeenCalledWith('uid-123', 'existing-slug')
  })

  it('returns 500 on POST when upsert fails', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(createDecodedIdToken({ email: 'mario@example.com' }))
    vi.mocked(getWriterByUid).mockResolvedValue(null)
    vi.mocked(resolveWriterSlug).mockResolvedValue('mario-rossi')
    vi.mocked(upsertWriterProfile).mockRejectedValue(new Error('boom'))

    const response = await POST(createPostRequest(createValidFormData()))
    const payload = (await response.json()) as { success: boolean; error: string }

    expect(response.status).toBe(500)
    expect(payload).toEqual({ success: false, error: 'Failed to update profile' })
    expect(response.headers.get('Cache-Control')).toBe('no-store')
  })

  it('supports PUT as an alias of POST for upsert', async () => {
    vi.mocked(verifyAuth).mockResolvedValue(createDecodedIdToken({ email: 'mario@example.com' }))
    vi.mocked(getWriterByUid).mockResolvedValue(null)
    vi.mocked(resolveWriterSlug).mockResolvedValue('mario-rossi')
    vi.mocked(upsertWriterProfile).mockResolvedValue(createWriterProfile())

    const response = await PUT(createPostRequest(createValidFormData()))
    const payload = (await response.json()) as { success: boolean; slug: string }

    expect(response.status).toBe(200)
    expect(payload.success).toBe(true)
    expect(payload.slug).toBe('mario-rossi')
  })
})
