import { getPublicWriter } from '@/lib/writer/firestore'
import { normalizeSlug } from '@/lib/validation/writerProfile'

// Utility function to load author data from team metadata
export interface AuthorData {
  name: string
  team: string[]
  title: string
  linkedin: string
  email: string
  website?: string
  description: string
  speaker?: boolean
  avatar?: string
  badges?: import('@/lib/types/badge').AuthorBadge[] // Optional: populated at runtime via firestore
}

export async function getAuthorData(authorName: string): Promise<AuthorData | null> {
  try {
    // Normalize user name to slug
    const slug = normalizeSlug(authorName)
    const writer = await getPublicWriter(slug)

    if (!writer) {
      return null
    }

    return {
      name: writer.displayName,
      team: ['Writers'], // Default team
      title: writer.title,
      linkedin: writer.linkedin || '',
      email: '', // Intentionally hidden for public profile
      website: writer.website || '',
      description: writer.bio,
      speaker: false, // Default false until added to schema
      avatar: writer.image?.publicUrl
    }
  } catch (error) {
    console.error('Error reading author data:', error)
    return null
  }
}
