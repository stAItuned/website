'use client'

import { useState } from 'react'
import { useToast } from './Toast'
import { trackArticleCopyCode } from '@/lib/analytics'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  maxHeight?: number
  children?: string
  /** Article slug for analytics tracking */
  articleSlug?: string
}

/**
 * Enhanced Code Block with copy, highlight, expand/collapse, and theme toggle
 */
export function CodeBlock({
  code: initialCode,
  language = 'javascript',
  filename,
  showLineNumbers = true,
  highlightLines = [],
  maxHeight = 400,
  children,
  articleSlug
}: CodeBlockProps) {
  const code = children || initialCode
  const [isCopied, setIsCopied] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredLine, setHoveredLine] = useState<number | null>(null)
  const { showToast } = useToast()

  const lines = code?.split('\n') || []
  const needsExpansion = lines.length > 15

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      showToast('Code copied to clipboard!', 'success', 2000)
      setTimeout(() => setIsCopied(false), 2000)
      // Track code copy event
      if (articleSlug) {
        trackArticleCopyCode(articleSlug, language)
      }
    } catch (err) {
      showToast('Failed to copy code', 'error', 2000)
    }
  }

  const languageColors: Record<string, string> = {
    javascript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    typescript: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    python: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    jsx: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
    tsx: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    css: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    html: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    bash: 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300',
  }

  const languageColor = languageColors[language.toLowerCase()] || languageColors.bash

  return (
    <div className="group relative my-6 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary-300 dark:hover:border-primary-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {filename && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {filename}
            </span>
          )}
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${languageColor}`}>
            {language.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {needsExpansion && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 group/expand"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 group/copy"
            title="Copy code"
          >
            {isCopied ? (
              <svg className="w-4 h-4 text-green-600 dark:text-green-400 animate-scale-in" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 transition-transform duration-200 group-hover/copy:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div
        className="relative overflow-hidden"
        style={{
          maxHeight: isExpanded ? 'none' : `${maxHeight}px`,
          transition: 'max-height 0.3s ease-out'
        }}
      >
        <pre className="overflow-x-auto p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <code
            className="block text-sm font-mono"
          >
            {lines.map((line, index) => {
              const lineNumber = index + 1
              const isHighlighted = highlightLines.includes(lineNumber)
              const isHovered = hoveredLine === lineNumber

              return (
                <div
                  key={index}
                  className={`transition-all duration-200 ${isHighlighted
                      ? 'bg-primary-100 dark:bg-primary-900/30 border-l-4 border-primary-600 pl-3'
                      : isHovered
                        ? 'bg-gray-100 dark:bg-gray-800'
                        : ''
                    }`}
                  onMouseEnter={() => setHoveredLine(lineNumber)}
                  onMouseLeave={() => setHoveredLine(null)}
                >
                  {showLineNumbers && (
                    <span className="inline-block w-8 mr-4 text-gray-400 dark:text-gray-600 text-right select-none">
                      {lineNumber}
                    </span>
                  )}
                  <span>{line}</span>
                </div>
              )
            })}
          </code>
        </pre>

        {/* Fade overlay when collapsed */}
        {needsExpansion && !isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Footer with action buttons */}
      {needsExpansion && !isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-3">
          <button
            onClick={() => setIsExpanded(true)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-primary-500 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-semibold shadow-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <span>Show more</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * Simple inline code component
 */
export function InlineCode({ children }: { children: string }) {
  return (
    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 rounded text-sm font-mono border border-gray-200 dark:border-gray-700">
      {children}
    </code>
  )
}
