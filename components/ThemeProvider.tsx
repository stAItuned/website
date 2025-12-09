'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  
  // Check if theme was already set by the inline script in layout.tsx
  const root = document.documentElement
  if (root.classList.contains('dark')) return 'dark'
  
  // Fallback to localStorage or system preference
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialize from browser storage/preference to avoid logo/theme flicker after mount.
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(theme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
      root.dataset.theme = 'dark'
      root.style.colorScheme = 'dark'
      setResolvedTheme('dark')
    } else {
      root.classList.remove('dark')
      root.dataset.theme = 'light'
      root.style.colorScheme = 'light'
      setResolvedTheme('light')
    }
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
