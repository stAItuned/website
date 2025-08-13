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
    }
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
  disableImportAliasWarning: true,
  onUnknownDocuments: 'skip-warn',
  // Add file filtering to exclude problematic files
  onExtraFieldData: 'ignore'
})
