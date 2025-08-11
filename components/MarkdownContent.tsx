'use client'

import { useMemo } from 'react'
import { marked } from 'marked'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const processedContent = useMemo(() => {
    // Configure marked with table support
    marked.setOptions({
      gfm: true, // GitHub flavored markdown (includes tables)
      breaks: true,
    })

    // Convert markdown to HTML
    const htmlContent = marked(content)
    
    return htmlContent
  }, [content])

  return (
    <div 
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}
