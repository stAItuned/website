import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `articles/**/*.md`,
  contentType: 'markdown',
  fields: {
    title: { type: 'string', required: true },
    author: { type: 'string', required: false },
    date: { type: 'date', required: false },
    topics: { type: 'list', of: { type: 'string' }, required: false },
    meta: { type: 'string', required: false },
    target: { type: 'string', required: false },
  business: { type: 'boolean', required: false },
    language: { type: 'string', required: false },
    cover: { type: 'string', required: false },
    published: { type: 'boolean', required: false },
  },
  computedFields: {
    url: { 
      type: 'string', 
      resolve: (doc) => {
        const pathParts = doc._raw.flattenedPath.split('/')
        const slug = pathParts[1] // Get the article directory name
        // Get target from frontmatter, default to 'general' if not specified
        const target = doc.target ? doc.target.toLowerCase() : 'general'
        return `/learn/${target}/${slug}`
      }
    },
    slug: {
      type: 'string',
      resolve: (doc) => {
        const pathParts = doc._raw.flattenedPath.split('/')
        // Return just the directory name (first part after 'articles')
        return pathParts[1]
      }
    },
    readingTime: {
      type: 'number',
      resolve: (doc) => {
        // Calculate reading time based on content
        // Average reading speed is ~200 words per minute
        const content = doc.body.raw
        const wordsPerMinute = 200
        const wordCount = content.split(/\s+/).length
        const readingTime = Math.ceil(wordCount / wordsPerMinute)
        return readingTime
      }
    },
    imagePath: {
      type: 'string',
      resolve: (doc) => {
        const pathParts = doc._raw.flattenedPath.split('/')
        const slug = pathParts[1] // Get the article directory name
        return `/content/articles/${slug}`
      }
    }
  },
}))

export const Team = defineDocumentType(() => ({
  name: 'Team',
  filePathPattern: `team/**/meta.md`,
  contentType: 'markdown',
  fields: {
    name: { type: 'string', required: false },
    role: { type: 'string', required: false },
    team: { type: 'list', of: { type: 'string' }, required: false },
    bio: { type: 'string', required: false },
    linkedin: { type: 'string', required: false },
    github: { type: 'string', required: false },
    website: { type: 'string', required: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => {
        const pathParts = doc._raw.flattenedPath.split('/')
        return pathParts[1] // Get the team member directory name
      }
    }
  },
}))

export default makeSource({
  contentDirPath: 'public/content',
  documentTypes: [Post, Team],
  disableImportAliasWarning: true,
  onUnknownDocuments: 'skip-ignore',
  onExtraFieldData: 'ignore',
})
