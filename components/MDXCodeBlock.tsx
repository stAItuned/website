'use client'

import { CodeBlock } from '@/components/ui/CodeBlock'

interface MDXCodeBlockProps {
  children: string
  className?: string
  filename?: string
  highlight?: string
  showLineNumbers?: boolean
  maxHeight?: number
}

/**
 * MDX-compatible code block component
 * 
 * Usage in MDX:
 * ```typescript filename="example.ts" highlight="1,2,3"
 * const hello = "world"
 * console.log(hello)
 * ```
 * 
 * Or with line ranges:
 * ```python highlight="1-5,8"
 * def greet():
 *     print("Hello")
 * ```
 */
export function MDXCodeBlock({ 
  children, 
  className, 
  filename,
  highlight,
  showLineNumbers = true,
  maxHeight = 400
}: MDXCodeBlockProps) {
  // Extract language from className (e.g., "language-typescript")
  const language = className?.replace(/language-/, '') || 'text'
  
  // Parse highlight prop (e.g., "1,2,3" or "1-3,5")
  const highlightLines = highlight
    ?.split(',')
    .flatMap(part => {
      const trimmed = part.trim()
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(Number)
        if (!isNaN(start) && !isNaN(end)) {
          return Array.from({ length: end - start + 1 }, (_, i) => start + i)
        }
      }
      const num = Number(trimmed)
      return isNaN(num) ? [] : [num]
    })
    .filter(n => !isNaN(n)) || []

  return (
    <CodeBlock
      code={children.trim()}
      language={language}
      filename={filename}
      showLineNumbers={showLineNumbers}
      highlightLines={highlightLines}
      maxHeight={maxHeight}
    />
  )
}

/**
 * Inline code component for MDX
 * 
 * Usage in MDX:
 * Use `inline code` like this
 */
export function MDXInlineCode({ children }: { children: string }) {
  return (
    <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm font-mono text-primary-600 dark:text-primary-400 border border-gray-200 dark:border-gray-700">
      {children}
    </code>
  )
}

/**
 * Pre wrapper for MDX - ensures proper spacing
 */
export function MDXPre({ children }: { children: React.ReactNode }) {
  return <div className="my-6">{children}</div>
}
