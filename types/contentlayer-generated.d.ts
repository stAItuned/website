declare module 'contentlayer/generated' {
  // Minimal declarations to satisfy imports during build when generated files
  // are not available yet.
  export type Post = Record<string, unknown>
  export type Team = Record<string, unknown>
  export type Topic = Record<string, unknown>
  export type Author = Record<string, unknown>
  export const allPosts: Post[]
  export const allTeams: Team[]
  export const allTopics: Topic[]
  export const allAuthors: Author[]
  export default {
    allPosts: [] as Post[],
    allTeams: [] as Team[],
    allTopics: [] as Topic[],
    allAuthors: [] as Author[],
  }
}

declare module '../.contentlayer/generated/index.mjs' {
  export type Post = Record<string, unknown>
  export type Team = Record<string, unknown>
  export type Topic = Record<string, unknown>
  export const allPosts: Post[]
  export const allTeams: Team[]
  export const allTopics: Topic[]
}

declare module '../.contentlayer/generated/types' {
  export type Post = {
    _id: string
    title: string
    slug: string
    url: string
    body: { raw: string }
    readingTime: number
    imagePath: string
    structuredData: Record<string, unknown>
    author?: string
    date?: string
    primaryTopic?: string
    topics?: string[]
    meta?: string
    seoTitle?: string
    seoDescription?: string
    target?: string
    language?: string
    cover?: string
    published?: boolean
    updatedAt?: string
    [key: string]: unknown
  }
  export type Team = {
    name?: string
    slug: string
    [key: string]: unknown
  }
  export type Topic = {
    slug: string
    title: string
    description: string
    body: { raw: string }
    seoTitle?: string
    seoDescription?: string
    [key: string]: unknown
  }
}
