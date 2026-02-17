'use client'

import { useState } from 'react'
import { event } from '@/lib/gtag'

interface ReaderModeProps {
  children: React.ReactNode
  articleSlug: string
  textSize?: 'small' | 'normal' | 'large' // Accept from parent
}

type ReaderModeTheme = 'default' | 'sepia' | 'highContrast' | 'dark'

function getInitialReaderMode(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('readerMode') === 'true'
}

function getInitialReaderTheme(): ReaderModeTheme {
  if (typeof window === 'undefined') return 'default'
  const storedTheme = localStorage.getItem('readerTheme')
  if (storedTheme === 'default' || storedTheme === 'sepia' || storedTheme === 'highContrast' || storedTheme === 'dark') {
    return storedTheme
  }
  return 'default'
}

export function ReaderMode({ children, articleSlug, textSize = 'normal' }: ReaderModeProps) {
  const [isReaderMode, setIsReaderMode] = useState(getInitialReaderMode)
  const [theme, setTheme] = useState<ReaderModeTheme>(getInitialReaderTheme)
  const [showSettings, setShowSettings] = useState(false)

  const toggleReaderMode = () => {
    const newMode = !isReaderMode
    setIsReaderMode(newMode)
    localStorage.setItem('readerMode', String(newMode))
    
    event({
      action: 'mobile_reader_mode_toggle',
      category: 'ux_feature',
      label: newMode ? 'enabled' : 'disabled',
      value: newMode ? 1 : 0
    })

    if (!newMode) {
      setShowSettings(false)
    }
  }

  const changeTheme = (newTheme: ReaderModeTheme) => {
    setTheme(newTheme)
    localStorage.setItem('readerTheme', newTheme)
    
    event({
      action: 'reader_mode_theme_change',
      category: 'ux_feature',
      label: newTheme,
      value: 1
    })
  }

  const getThemeClasses = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#f4ecd8] text-[#5c4b37]'
      case 'highContrast':
        return 'bg-white text-black'
      case 'dark':
        return 'bg-slate-900 text-gray-100'
      default:
        return ''
    }
  }

  return (
    <div className="relative">
      {/* Reader Mode Toggle Button */}
      <button
        onClick={toggleReaderMode}
        className="fixed top-20 right-4 z-40 lg:hidden bg-white dark:bg-slate-800 rounded-full p-3 shadow-lg border border-gray-200 dark:border-slate-700 hover:scale-110 transition-transform"
        aria-label="Toggle reader mode"
      >
        <svg 
          className={`w-6 h-6 ${isReaderMode ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300'}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </button>

      {/* Reader Mode Settings */}
      {isReaderMode && (
        <div className="fixed top-32 right-4 z-40 lg:hidden">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-white dark:bg-slate-800 rounded-full p-2.5 shadow-lg border border-gray-200 dark:border-slate-700 hover:scale-110 transition-transform mb-2"
            aria-label="Reader mode settings"
          >
            <svg 
              className="w-5 h-5 text-gray-700 dark:text-gray-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {showSettings && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-2xl border border-gray-200 dark:border-slate-700 w-64 animate-slide-down">
              {/* Theme Selection */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Theme</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => changeTheme('default')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      theme === 'default'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xs font-medium text-gray-900 dark:text-white">Default</div>
                  </button>
                  
                  <button
                    onClick={() => changeTheme('sepia')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      theme === 'sepia'
                        ? 'border-primary-500 bg-[#f4ecd8]'
                        : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xs font-medium text-[#5c4b37]">Sepia</div>
                  </button>
                  
                  <button
                    onClick={() => changeTheme('highContrast')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      theme === 'highContrast'
                        ? 'border-primary-500 bg-white'
                        : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xs font-medium text-black">High Contrast</div>
                  </button>
                  
                  <button
                    onClick={() => changeTheme('dark')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      theme === 'dark'
                        ? 'border-primary-500 bg-slate-900'
                        : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xs font-medium text-white">Dark</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content Wrapper - Only apply theme, no width constraints */}
      <div className={`transition-all duration-300 ${
        isReaderMode 
          ? `py-4 rounded-2xl ${getThemeClasses()}`
          : ''
      }`}>
        {children}
      </div>
    </div>
  )
}
