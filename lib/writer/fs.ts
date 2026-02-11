import { promises as fs } from 'fs'
import path from 'path'

export interface WriterProfile {
  slug: string
  name?: string
  email?: string
  profilePath: string
}

const FRONTMATTER_RE = /^\s*---\s*[\r\n]+([\s\S]*?)[\r\n]+---/m

function unquote(value: string): string {
  return value.replace(/^['"]|['"]$/g, '').trim()
}

function parseFrontmatter(markdown: string): Record<string, string> {
  const match = markdown.match(FRONTMATTER_RE)
  if (!match) return {}

  const lines = match[1].split(/\r?\n/)
  const out: Record<string, string> = {}
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf(':')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    if (key) out[key] = unquote(value)
  }
  return out
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

/**
 * Locates a writer profile in `public/content/team/<slug>/meta.md` by exact email match.
 */
export async function findWriterProfileByEmail(email: string): Promise<WriterProfile | null> {
  const normalizedEmail = email.trim().toLowerCase()
  const teamDir = path.join(process.cwd(), 'public/content/team')

  try {
    const entries = await fs.readdir(teamDir, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const slug = entry.name
      const metaPath = path.join(teamDir, slug, 'meta.md')
      if (!(await fileExists(metaPath))) continue

      const content = await fs.readFile(metaPath, 'utf8')
      const fm = parseFrontmatter(content)
      const fmEmail = (fm.email || '').trim().toLowerCase()
      if (fmEmail && fmEmail === normalizedEmail) {
        return {
          slug,
          name: fm.name,
          email: fmEmail,
          profilePath: `/content/team/${slug}`,
        }
      }
    }
  } catch {
    // Directory missing or unreadable -> no profile
  }

  return null
}
