'use client'

import { useState } from 'react'

interface CodeBlockProps {
  code: string
  language?: string
  showLineNumbers?: boolean
}

export function EnhancedCodeBlock({ code, language = 'text', showLineNumbers = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const getLanguageLabel = (lang: string): string => {
    const labels: Record<string, string> = {
      js: 'JavaScript',
      javascript: 'JavaScript',
      ts: 'TypeScript',
      typescript: 'TypeScript',
      py: 'Python',
      python: 'Python',
      jsx: 'React JSX',
      tsx: 'React TSX',
      html: 'HTML',
      css: 'CSS',
      scss: 'SCSS',
      json: 'JSON',
      md: 'Markdown',
      markdown: 'Markdown',
      bash: 'Bash',
      sh: 'Shell',
      sql: 'SQL',
      java: 'Java',
      cpp: 'C++',
      c: 'C',
      go: 'Go',
      rust: 'Rust',
      php: 'PHP',
      ruby: 'Ruby',
      swift: 'Swift',
      kotlin: 'Kotlin',
      yaml: 'YAML',
      yml: 'YAML',
      xml: 'XML',
    }
    return labels[lang.toLowerCase()] || lang.toUpperCase()
  }

  const getLanguageColor = (lang: string): string => {
    const colors: Record<string, string> = {
      javascript: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
      typescript: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      python: 'bg-green-500/10 text-green-600 dark:text-green-400',
      jsx: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      tsx: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      html: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
      css: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
      json: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
      bash: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
      sql: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    }
    return colors[lang.toLowerCase()] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
  }

  const lines = code.split('\n')

  return (
    <div className="relative group my-6 rounded-xl overflow-hidden bg-slate-900 dark:bg-slate-950 shadow-xl border border-slate-700/50">
      {/* Header bar with language and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 dark:bg-slate-900/50 border-b border-slate-700/50">
        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getLanguageColor(language)}`}>
          {getLanguageLabel(language)}
        </span>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 hover:bg-slate-700/50 text-slate-300 hover:text-white"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="p-4 m-0 text-sm leading-relaxed">
          <code className="text-slate-50">
            {showLineNumbers ? (
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((line, index) => (
                    <tr key={index}>
                      <td className="pr-4 text-right text-slate-500 select-none w-8" style={{ minWidth: '2rem' }}>
                        {index + 1}
                      </td>
                      <td className="text-slate-50">
                        {line || '\n'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              code
            )}
          </code>
        </pre>
      </div>
    </div>
  )
}
