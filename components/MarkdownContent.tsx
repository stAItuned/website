'use client'

import { useMemo } from 'react'
import { marked } from 'marked'
import { addHeadingIdsToMarkdown } from '@/lib/markdown-headings'

interface MarkdownContentProps {
  content: string
  className?: string
  articleSlug?: string // Add article slug to resolve image paths
}

export function MarkdownContent({ content, className = '', articleSlug }: MarkdownContentProps) {
  const processedContent = useMemo(() => {
    // Configure marked with table support and better options
    marked.setOptions({
      gfm: true, // GitHub flavored markdown (includes tables)
      breaks: true,
    })

    // Inject heading IDs into h2/h3
    const contentWithIds = addHeadingIdsToMarkdown(content)

    // Convert markdown (with heading IDs) to HTML
    let htmlContent = marked(contentWithIds) as string

    // Process image paths if articleSlug is provided
    if (articleSlug) {
      // Replace relative image paths with absolute paths
      htmlContent = htmlContent.replace(
        /<img([^>]*)\ssrc=["']([^"']+)["']([^>]*)>/g,
        (match: string, before: string, src: string, after: string) => {
          // Skip if it's already an absolute URL
          if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
            return match
          }

          // Clean relative path indicators
          const cleanSrc = src.replace(/^\.\//, '')

          // Convert to absolute path
          const absoluteSrc = `/content/articles/${articleSlug}/${cleanSrc}`

          return `<img${before} src="${absoluteSrc}"${after}>`
        }
      )
    }

    return htmlContent
  }, [content, articleSlug])

  return (
    <div
      className={`prose prose-lg max-w-none stai-markdown
        prose-table:border-collapse
        prose-th:border
        prose-th:border-[color:var(--stai-border)]
        prose-th:px-4
        prose-th:py-2
        prose-td:border
        prose-td:border-[color:var(--stai-border)]
        prose-td:px-4
        prose-td:py-2
        prose-img:rounded-lg
        prose-img:shadow-lg
        prose-img:w-full
        prose-img:h-auto
        ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}
