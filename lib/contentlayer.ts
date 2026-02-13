import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'

type UnknownRecord = Record<string, unknown>

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null

const toStringOr = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback

const toOptionalString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined

const toIsoDateString = (value: unknown): string => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? '' : value.toISOString()
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return ''
    const parsed = new Date(trimmed)
    return Number.isNaN(parsed.getTime()) ? trimmed : parsed.toISOString()
  }
  return ''
}

const toBooleanOr = (value: unknown, fallback: boolean): boolean =>
  typeof value === 'boolean' ? value : fallback

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

const toRecord = (value: unknown): UnknownRecord => (isRecord(value) ? value : {})

const readingTimeMinutes = (content: string): number => {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export type ContentPost = {
  _id: string
  _raw: UnknownRecord
  type: 'Post'
  title: string
  slug: string
  url: string
  author: string
  date: string
  target: string
  language: string
  cover?: string
  meta?: string
  seoTitle?: string
  seoDescription?: string
  primaryTopic?: string
  topics: string[]
  tags: string[]
  imagePath: string
  structuredData: UnknownRecord
  body: {
    raw: string
    [key: string]: unknown
  }
  published: boolean
  updatedAt?: string
  readingTime: number
  readTime: number
  [key: string]: unknown
}

export type ContentTeam = {
  slug: string
  name?: string
  role?: string
  bio?: string
  linkedin?: string
  website?: string
  email?: string
  [key: string]: unknown
}

export type ContentTopic = {
  _id: string
  slug: string
  title: string
  description: string
  icon?: string
  seoTitle?: string
  seoDescription?: string
  url: string
  body: {
    raw: string
    [key: string]: unknown
  }
  [key: string]: unknown
}

const contentRoot = path.join(process.cwd(), 'public', 'content')

const getPrimaryArticleMarkdownPath = (articleDir: string): string | null => {
  let files: string[] = []
  try {
    files = readdirSync(articleDir)
  } catch {
    return null
  }

  const markdownFiles = files
    .filter((file) => file.toLowerCase().endsWith('.md') || file.toLowerCase().endsWith('.mdx'))
    .sort((a, b) => a.localeCompare(b))

  if (markdownFiles.length === 0) return null

  const exactArticle = markdownFiles.find((file) => file.toLowerCase() === 'article.md')
  if (exactArticle) return path.join(articleDir, exactArticle)

  return path.join(articleDir, markdownFiles[0]!)
}

const loadPostsFromFilesystem = (): ContentPost[] => {
  const articlesRoot = path.join(contentRoot, 'articles')
  let entries: string[] = []
  try {
    entries = readdirSync(articlesRoot)
  } catch (error) {
    console.warn('[content] failed to read articles directory:', error)
    return []
  }

  const posts: ContentPost[] = []

  for (const slug of entries) {
    const articleDir = path.join(articlesRoot, slug)
    try {
      if (!statSync(articleDir).isDirectory()) continue
    } catch {
      continue
    }

    const mdPath = getPrimaryArticleMarkdownPath(articleDir)
    let rawFile = ''
    try {
      if (!mdPath) continue
      rawFile = readFileSync(mdPath, 'utf-8')
    } catch {
      continue
    }

    const parsed = matter(rawFile)
    const frontmatter = toRecord(parsed.data)
    const bodyRaw = typeof parsed.content === 'string' ? parsed.content : ''

    const title = toStringOr(frontmatter['title'])
    if (!title) continue

    const target = toStringOr(frontmatter['target'], 'general')
    const targetLower = target.toLowerCase()
    const topics = toStringArray(frontmatter['topics'])
    const primaryTopic = toOptionalString(frontmatter['primaryTopic'])
    const published = toBooleanOr(frontmatter['published'], true)

    const faq = frontmatter['faq']
    const structuredData: UnknownRecord = (() => {
      if (!Array.isArray(faq) || faq.length === 0) return {}

      const mainEntity = faq
        .map((item): UnknownRecord | null => {
          const rec = toRecord(item)
          const question = toStringOr(rec['questionEn'], toStringOr(rec['question']))
          const answer = toStringOr(rec['answerEn'], toStringOr(rec['answer']))
          if (!question || !answer) return null
          return {
            '@type': 'Question',
            name: question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: answer,
            },
          }
        })
        .filter((v): v is UnknownRecord => Boolean(v))

      if (mainEntity.length === 0) return {}

      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity,
      }
    })()

    const readingTime = readingTimeMinutes(bodyRaw)
    const imagePath = `/content/articles/${slug}`

    posts.push({
      _id: `Post:${slug}`,
      _raw: { slug },
      type: 'Post',
      title,
      slug,
      url: `/learn/${targetLower}/${slug}`,
      author: toStringOr(frontmatter['author']),
      date: toIsoDateString(frontmatter['date']),
      target,
      language: toStringOr(frontmatter['language']),
      cover: toOptionalString(frontmatter['cover']),
      meta: toOptionalString(frontmatter['meta']),
      seoTitle: toOptionalString(frontmatter['seoTitle']),
      seoDescription: toOptionalString(frontmatter['seoDescription']),
      primaryTopic,
      topics,
      tags: topics,
      imagePath,
      structuredData,
      body: { raw: bodyRaw },
      published,
      updatedAt: toIsoDateString(frontmatter['updatedAt']) || undefined,
      readingTime,
      readTime: readingTime,
      // Keep a couple of legacy aliases used around the codebase.
      description: toOptionalString(frontmatter['meta']),
      excerpt: toOptionalString(frontmatter['meta']),
    })
  }

  return posts
}

const loadTopicsFromFilesystem = (): ContentTopic[] => {
  const topicsRoot = path.join(contentRoot, 'topics')
  let entries: string[] = []
  try {
    entries = readdirSync(topicsRoot)
  } catch (error) {
    console.warn('[content] failed to read topics directory:', error)
    return []
  }

  const topics: ContentTopic[] = []

  for (const fileName of entries) {
    if (!fileName.endsWith('.md')) continue

    const fullPath = path.join(topicsRoot, fileName)
    let rawFile = ''
    try {
      rawFile = readFileSync(fullPath, 'utf-8')
    } catch {
      continue
    }

    const parsed = matter(rawFile)
    const frontmatter = toRecord(parsed.data)
    const bodyRaw = typeof parsed.content === 'string' ? parsed.content : ''
    const slug = fileName.replace(/\.md$/, '')

    const title = toStringOr(frontmatter['title'])
    const description = toStringOr(frontmatter['description'])
    if (!title || !description) continue

    topics.push({
      _id: `Topic:${slug}`,
      slug,
      title,
      description,
      icon: toOptionalString(frontmatter['icon']),
      seoTitle: toOptionalString(frontmatter['seoTitle']),
      seoDescription: toOptionalString(frontmatter['seoDescription']),
      url: `/topics/${slug}`,
      body: { raw: bodyRaw },
    })
  }

  return topics
}

const loadTeamFromFilesystem = (): ContentTeam[] => {
  const teamRoot = path.join(contentRoot, 'team')
  let entries: string[] = []
  try {
    entries = readdirSync(teamRoot)
  } catch (error) {
    console.warn('[content] failed to read team directory:', error)
    return []
  }

  const team: ContentTeam[] = []

  for (const slug of entries) {
    const memberDir = path.join(teamRoot, slug)
    try {
      if (!statSync(memberDir).isDirectory()) continue
    } catch {
      continue
    }

    const mdPath = path.join(memberDir, 'meta.md')
    let rawFile = ''
    try {
      rawFile = readFileSync(mdPath, 'utf-8')
    } catch {
      continue
    }

    const parsed = matter(rawFile)
    const frontmatter = toRecord(parsed.data)

    team.push({
      slug,
      name: toOptionalString(frontmatter['name']),
      role: toOptionalString(frontmatter['title']),
      bio: toOptionalString(frontmatter['description']),
      linkedin: toOptionalString(frontmatter['linkedin']),
      website: toOptionalString(frontmatter['website']),
      email: toOptionalString(frontmatter['email']),
    })
  }

  return team
}

export const allPosts: ContentPost[] = loadPostsFromFilesystem()
export const allTopics: ContentTopic[] = loadTopicsFromFilesystem()
export const allTeams: ContentTeam[] = loadTeamFromFilesystem()
