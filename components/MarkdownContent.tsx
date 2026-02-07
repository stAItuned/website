'use client'

import { useMemo, useEffect, useRef } from 'react'
import { marked } from 'marked'
import { addHeadingIdsToMarkdown } from '@/lib/markdown-headings'

interface MarkdownContentProps {
  content: string
  htmlContent?: string // Optional pre-rendered HTML
  className?: string
  articleSlug?: string // Add article slug to resolve image paths
}

export function MarkdownContent({ content, htmlContent, className = '', articleSlug }: MarkdownContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  const processedContent = useMemo(() => {
    // If HTML is already provided (SSR), use it directly
    if (htmlContent) {
      let finalHtml = htmlContent

      // Process image paths if articleSlug is provided (reusing same logic)
      if (articleSlug) {
        finalHtml = finalHtml.replace(
          /<img([^>]*)\ssrc=["']([^"']+)["']([^>]*)>/g,
          (match: string, before: string, src: string, after: string) => {
            if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
              return match
            }
            const cleanSrc = src.replace(/^\.\//, '')
            const absoluteSrc = `/content/articles/${articleSlug}/${cleanSrc}`
            return `<img${before} src="${absoluteSrc}"${after}>`
          }
        )
      }
      return finalHtml
    }

    // Client-side fallback (legacy behavior)
    // Configure marked with table support and better options
    marked.setOptions({
      gfm: true, // GitHub flavored markdown (includes tables)
      breaks: true,
    })

    // Inject heading IDs into h2/h3
    const contentWithIds = addHeadingIdsToMarkdown(content)

    // Convert markdown (with heading IDs) to HTML
    let renderedHtml = marked(contentWithIds) as string

    // Process image paths if articleSlug is provided
    if (articleSlug) {
      // Replace relative image paths with absolute paths
      renderedHtml = renderedHtml.replace(
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

    // Wrap tables in a responsive container
    renderedHtml = renderedHtml.replace(
      /<table>/g,
      '<div class="table-wrapper"><table>'
    )
    renderedHtml = renderedHtml.replace(
      /<\/table>/g,
      '</table></div>'
    )

    return renderedHtml
  }, [content, htmlContent, articleSlug])

  // Add scroll detection for table wrappers to hide the scroll indicator
  useEffect(() => {
    if (!contentRef.current) return

    const tableWrappers = contentRef.current.querySelectorAll('.table-wrapper')

    const handleScroll = (wrapper: Element) => {
      const scrollLeft = wrapper.scrollLeft
      const scrollWidth = wrapper.scrollWidth
      const clientWidth = wrapper.clientWidth

      // Check if scrolled to the end
      if (scrollLeft + clientWidth >= scrollWidth - 5) {
        wrapper.classList.add('scrolled-end')
      } else {
        wrapper.classList.remove('scrolled-end')
      }
    }

    const listeners: Array<[Element, () => void]> = []

    tableWrappers.forEach(wrapper => {
      const listener = () => handleScroll(wrapper)
      wrapper.addEventListener('scroll', listener)
      listeners.push([wrapper, listener])
      // Initial check
      handleScroll(wrapper)
    })

    return () => {
      listeners.forEach(([wrapper, listener]) => {
        wrapper.removeEventListener('scroll', listener)
      })
    }
  }, [processedContent])

  return (
    <div
      ref={contentRef}
      className={`${className} stai-markdown
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
        prose-img:h-auto`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}
