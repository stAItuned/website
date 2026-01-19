import { defineDocumentType, defineNestedType, makeSource } from 'contentlayer/source-files'

const FAQItem = defineNestedType(() => ({
  name: 'FAQItem',
  fields: {
    question: { type: 'string', required: true },
    answer: { type: 'string', required: true },
    questionEn: { type: 'string', required: false },
    answerEn: { type: 'string', required: false },
  }
}))

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `articles/**/*.md`,
  contentType: 'markdown',
  fields: {
    title: { type: 'string', required: true },
    author: { type: 'string', required: false },
    date: { type: 'date', required: false },
    primaryTopic: { type: 'string', required: false },
    topics: { type: 'list', of: { type: 'string' }, required: false }, // These are now secondary TAGS
    meta: { type: 'string', required: false },
    seoTitle: { type: 'string', required: false },
    seoDescription: { type: 'string', required: false },
    target: { type: 'string', required: false },
    business: { type: 'boolean', required: false },
    language: { type: 'string', required: false },
    cover: { type: 'string', required: false },
    published: { type: 'boolean', required: false },
    updatedAt: { type: 'date', required: false },
    faq: {
      type: 'list',
      of: FAQItem,
      required: false
    },
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
    },

    structuredData: {
      type: 'json',
      resolve: (doc: any) => {
        // Generate FAQPage schema if FAQs exist
        if (!doc.faq || !Array.isArray(doc.faq) || doc.faq.length === 0) return null;

        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': doc.faq.map((item: any) => ({
            '@type': 'Question',
            'name': item.questionEn || item.question, // Default to English for schema optimization as requested
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': item.answerEn || item.answer
            }
          }))
        }
      }
    }
  },
}))




export const Team = defineDocumentType(() => ({
  name: 'Team',
  filePathPattern: `team/**/meta.md`,
  contentType: 'markdown',
  // Trigger rebuild for email field schema update
  fields: {
    name: { type: 'string', required: false },
    role: { type: 'string', required: false },
    team: { type: 'list', of: { type: 'string' }, required: false },
    bio: { type: 'string', required: false },
    linkedin: { type: 'string', required: false },
    github: { type: 'string', required: false },
    website: { type: 'string', required: false },
    email: { type: 'string', required: false },
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

export const Topic = defineDocumentType(() => ({
  name: 'Topic',
  filePathPattern: `topics/**/*.md`,
  contentType: 'markdown',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    icon: { type: 'string', required: false },
    seoTitle: { type: 'string', required: false },
    seoDescription: { type: 'string', required: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => {
        // Return filename without extension
        return doc._raw.sourceFileName.replace(/\.md$/, '')
      }
    },
    url: {
      type: 'string',
      resolve: (doc) => {
        const slug = doc._raw.sourceFileName.replace(/\.md$/, '')
        return `/topics/${slug}`
      }
    }
  },
}))

export default makeSource({
  contentDirPath: 'public/content',
  documentTypes: [Post, Team, Topic],
  disableImportAliasWarning: true,
  onUnknownDocuments: 'skip-ignore',
  onExtraFieldData: 'ignore',
})
