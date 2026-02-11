import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'
import sharp from 'sharp'
import { verifyAuth } from '@/lib/firebase/server-auth'
import { findWriterProfileByEmail } from '@/lib/writer/fs'
import { writerProfileFieldsSchema } from '@/lib/validation/writerProfile'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

function getBody(markdown: string): string {
  const match = markdown.match(FRONTMATTER_RE)
  if (!match) return markdown.trim()
  return markdown.slice(match.index! + match[0].length).trim()
}

function yamlString(value: string): string {
  const normalized = value.replace(/\r?\n/g, ' ').trim()
  const escaped = normalized.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  return `"${escaped}"`
}

function parseYamlList(value: string): string[] {
  const trimmed = value.trim()
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return []
  const inner = trimmed.slice(1, -1)
  return inner
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => unquote(s))
}

function buildYamlList(values: string[]): string {
  return `[${values.join(', ')}]`
}

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user?.email) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const profile = await findWriterProfileByEmail(user.email)
    if (!profile) return NextResponse.json({ success: false, error: 'Writer profile not found' }, { status: 404 })

    const metaPath = path.join(process.cwd(), 'public/content/team', profile.slug, 'meta.md')
    const markdown = await fs.readFile(metaPath, 'utf8')
    const fm = parseFrontmatter(markdown)
    const bio = getBody(markdown)

    const fullName = (fm.name || '').trim()
    const parts = fullName.split(/\s+/).filter(Boolean)
    const name = parts[0] || profile.slug.split('-')[0] || ''
    const surname = parts.length > 1 ? parts.slice(1).join(' ') : (profile.slug.split('-').slice(1).join(' ') || '')

    return NextResponse.json({
      success: true,
      profile: {
        slug: profile.slug,
        profilePath: profile.profilePath,
        imageUrl: `/content/team/${profile.slug}/propic.jpg`,
        name,
        surname,
        title: fm.title || '',
        bio,
        linkedin: fm.linkedin || '',
        website: fm.website || '',
      },
    })
  } catch (error) {
    console.error('[API] writer-profile GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to load profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user?.email) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const profile = await findWriterProfileByEmail(user.email)
    if (!profile) return NextResponse.json({ success: false, error: 'Writer profile not found' }, { status: 404 })

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
      return NextResponse.json(
        { success: false, error: 'Invalid fields', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const teamDir = path.join(process.cwd(), 'public/content/team', profile.slug)
    const metaPath = path.join(teamDir, 'meta.md')
    const existingMd = await fs.readFile(metaPath, 'utf8')
    const existingFm = parseFrontmatter(existingMd)
    const existingTeam = existingFm.team || '[Writers]'
    const teamList = parseYamlList(existingTeam)
    const ensuredTeam = Array.from(new Set([...teamList, 'Writers'])).filter(Boolean)

    const fields = parsed.data
    const shortDescription = fields.bio.replace(/\s+/g, ' ').trim().slice(0, 280)

    const metaContent = `---
name: ${yamlString(`${fields.name} ${fields.surname}`)}
team: ${buildYamlList(ensuredTeam)}
title: ${yamlString(fields.title)}
linkedin: ${yamlString(fields.linkedin ?? '')}
email: ${yamlString(user.email)}
website: ${yamlString(fields.website ?? '')}
description: ${yamlString(shortDescription)}
speaker: false
legal_consent: true
consent_date: ${yamlString(existingFm.consent_date || new Date().toISOString())}
---

${fields.bio}
`

    await fs.writeFile(metaPath, metaContent, 'utf8')

    if (imageFile instanceof File) {
      const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
      if (!allowedTypes.has(imageFile.type)) {
        return NextResponse.json(
          { success: false, error: 'Invalid image type. Allowed: JPEG, PNG, WebP' },
          { status: 400 }
        )
      }

      const maxSizeBytes = 5 * 1024 * 1024
      if (imageFile.size > maxSizeBytes) {
        return NextResponse.json({ success: false, error: 'Image too large (max 5MB)' }, { status: 400 })
      }

      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const processed = await sharp(buffer)
        .resize(500, 500, { fit: 'cover', position: 'center' })
        .jpeg({ quality: 85 })
        .toBuffer()

      await fs.writeFile(path.join(teamDir, 'propic.jpg'), processed)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] writer-profile PUT error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 })
  }
}

