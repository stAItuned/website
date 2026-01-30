import fs from 'fs'
import path from 'path'

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
}

export async function getAuthorData(authorName: string): Promise<AuthorData | null> {
  try {
    // Convert author name to slug format (replace spaces with hyphens)
    // Use trim() to avoid issues with trailing/leading spaces in markdown frontmatter
    const authorSlug = authorName.trim().replaceAll(' ', '-')

    // Try both possible locations for the metadata file
    const possiblePaths = [
      path.join(process.cwd(), 'cms', 'team', authorSlug, 'meta.md'),
      path.join(process.cwd(), 'content', 'team', authorSlug, 'meta.md'),
      path.join(process.cwd(), 'public', 'content', 'team', authorSlug, 'meta.md'),
    ]


    let metadataText = null
    for (const metadataPath of possiblePaths) {
      if (fs.existsSync(metadataPath)) {
        metadataText = fs.readFileSync(metadataPath, 'utf-8')
        break
      }
    }
    if (!metadataText) {
      return null
    }

    // Parse the frontmatter from the markdown file - handle both Unix and Windows line endings
    const frontmatterRegex = /^\s*---[\r\n]+([\s\S]*?)[\r\n]+---/
    const match = metadataText.match(frontmatterRegex)

    if (!match) {
      return null
    }

    // Simple YAML parsing for the author metadata
    const frontmatter = match[1]
    const lines = frontmatter.split(/[\r\n]+/)
    const metadata: Record<string, any> = {}

    for (const line of lines) {
      if (line.includes(':')) {
        const [key, ...valueParts] = line.split(':')
        const value = valueParts.join(':').trim()

        // Handle arrays (team field)
        if (value.startsWith('[') && value.endsWith(']')) {
          metadata[key.trim()] = value
            .slice(1, -1) // Remove brackets
            .split(',')
            .map(item => item.trim().replace(/['"]/g, ''))
        } else if (value.toLowerCase() === 'true') {
          metadata[key.trim()] = true
        } else if (value.toLowerCase() === 'false') {
          metadata[key.trim()] = false
        } else {
          metadata[key.trim()] = value.replace(/['"]/g, '')
        }
      }
    }

    return {
      name: Array.isArray(metadata.name) ? metadata.name[0] : metadata.name || authorName,
      team: Array.isArray(metadata.team) ? metadata.team : [],
      title: Array.isArray(metadata.title) ? metadata.title[0] : metadata.title || '',
      linkedin: Array.isArray(metadata.linkedin) ? metadata.linkedin[0] : metadata.linkedin || '',
      email: Array.isArray(metadata.email) ? metadata.email[0] : metadata.email || '',
      website: Array.isArray(metadata.website) ? metadata.website[0] : metadata.website || '',
      description: Array.isArray(metadata.description) ? metadata.description[0] : metadata.description || '',
      speaker: typeof metadata.speaker === 'boolean' ? metadata.speaker : (typeof metadata.speaker === 'string' ? metadata.speaker.trim().toLowerCase() === 'true' : false),
      avatar: `/content/team/${authorSlug}/propic.jpg`
    }
  } catch (error) {
    console.error('Error reading author data:', error)
    return null
  }
}
