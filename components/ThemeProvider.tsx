'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  cycleTheme: () => void
  resolvedTheme: Theme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
const THEME_STORAGE_KEY = 'theme'
const THEME_CYCLE_ORDER: Theme[] = ['light', 'dark']

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'

  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const resolvedTheme: Theme = theme

  useEffect(() => {
    const root = document.documentElement

    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
      root.dataset.theme = resolvedTheme
      root.dataset.themePreference = theme
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.dataset.theme = resolvedTheme
      root.dataset.themePreference = theme
      root.style.colorScheme = 'light'
    }
  }, [resolvedTheme, theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  const cycleTheme = () => {
    const currentIndex = THEME_CYCLE_ORDER.indexOf(theme)
    const nextIndex = (currentIndex + 1) % THEME_CYCLE_ORDER.length
    const nextTheme = THEME_CYCLE_ORDER[nextIndex]
    setTheme(nextTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, resolvedTheme }}>
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
