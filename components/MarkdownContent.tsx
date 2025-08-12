'use client'

import { useMemo } from 'react'
import { marked } from 'marked'

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

    // Convert markdown to HTML
    let htmlContent = marked(content) as string
    
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
      className={`prose prose-lg max-w-none 
        prose-headings:text-gray-900 
        prose-p:text-gray-700 
        prose-strong:text-gray-900 
        prose-table:text-gray-700
        prose-table:border-collapse
        prose-th:border
        prose-th:border-gray-300
        prose-th:bg-gray-100
        prose-th:px-4
        prose-th:py-2
        prose-td:border
        prose-td:border-gray-300
        prose-td:px-4
        prose-td:py-2
        prose-img:rounded-lg
        prose-img:shadow-md
        ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}
