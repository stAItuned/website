import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider, useTheme } from './ThemeProvider'

function ThemeProbe() {
  const { theme, resolvedTheme, cycleTheme } = useTheme()

  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <button type="button" onClick={cycleTheme}>cycle</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    const storageData = new Map<string, string>()
    const localStorageMock: Storage = {
      get length() {
        return storageData.size
      },
      clear: () => {
        storageData.clear()
      },
      getItem: (key: string) => storageData.get(key) ?? null,
      key: (index: number) => Array.from(storageData.keys())[index] ?? null,
      removeItem: (key: string) => {
        storageData.delete(key)
      },
      setItem: (key: string, value: string) => {
        storageData.set(key, value)
      },
    }

    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: localStorageMock,
    })
  })

  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    document.documentElement.dataset.theme = ''
    document.documentElement.dataset.themePreference = ''
    document.documentElement.style.colorScheme = ''
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('defaults to light mode', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme').textContent).toBe('light')
    expect(screen.getByTestId('resolved-theme').textContent).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(document.documentElement.dataset.themePreference).toBe('light')
  })

  it('cycles through light -> dark and persists preference', () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'cycle' }))
    expect(screen.getByTestId('theme').textContent).toBe('dark')
    expect(screen.getByTestId('resolved-theme').textContent).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')

    fireEvent.click(screen.getByRole('button', { name: 'cycle' }))
    expect(screen.getByTestId('theme').textContent).toBe('light')
    expect(screen.getByTestId('resolved-theme').textContent).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
