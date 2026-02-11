'use client'

import { useTheme } from './ThemeProvider'
import { useEffect, useState } from 'react'
import { useLearnLocale } from '@/lib/i18n'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { t } = useLearnLocale()

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        type="button"
        className="stai-icon-button"
        aria-label={t.header.actions.themeToggleShort}
      >
        <svg className="w-6 h-6 text-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
        </svg>
      </button>
    )
  }

  const handleToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="stai-icon-button group relative"
      aria-label={t.header.actions.themeToggle.replace('{theme}', resolvedTheme === 'dark' ? t.header.actions.themeNames.dark : t.header.actions.themeNames.light)}
      title={t.header.actions.themeToggle.replace('{theme}', resolvedTheme === 'dark' ? t.header.actions.themeNames.dark : t.header.actions.themeNames.light)}
    >
      {/* Sun icon for light mode */}
      {resolvedTheme === 'light' && (
        <svg 
          className="w-6 h-6 text-[color:var(--stai-text)] transition-transform group-hover:rotate-45" 
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
        </svg>
      )}
      
      {/* Moon icon for dark mode */}
      {resolvedTheme === 'dark' && (
        <svg 
          className="w-6 h-6 text-[color:var(--stai-text)] transition-transform group-hover:rotate-12" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
      
    </button>
  )
}
