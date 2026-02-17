'use client'

import { createContext, useContext, useState, useCallback, useSyncExternalStore, type ReactNode } from 'react'
import { translations, type LearnLocale, type LearnTranslations } from './learn-translations'

// Storage key for locale preference
const LOCALE_STORAGE_KEY = 'staituned-locale'

interface LearnLocaleContextType {
    locale: LearnLocale
    setLocale: (locale: LearnLocale) => void
    t: LearnTranslations
    toggleLocale: () => void
}

const LearnLocaleContext = createContext<LearnLocaleContextType | undefined>(undefined)

/**
 * Detect browser language preference
 */
function detectBrowserLocale(): LearnLocale {
    if (typeof window === 'undefined') return 'en'

    const browserLang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'en'
    const langCode = browserLang.split('-')[0].toLowerCase()

    return langCode === 'it' ? 'it' : 'en'
}

/**
 * Get saved locale from localStorage
 */
function getSavedLocale(): LearnLocale | null {
    if (typeof window === 'undefined') return null

    try {
        const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
        if (saved === 'it' || saved === 'en') {
            return saved
        }
    } catch {
        // localStorage not available
    }

    return null
}

/**
 * Save locale to localStorage
 */
function saveLocale(locale: LearnLocale): void {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    } catch {
        // localStorage not available
    }
}

interface LearnLocaleProviderProps {
    children: ReactNode
    defaultLocale?: LearnLocale
}

function getInitialLocale(defaultLocale: LearnLocale): LearnLocale {
    if (typeof window === 'undefined') return defaultLocale
    const saved = getSavedLocale()
    if (saved) return saved
    if (window.location.pathname.startsWith('/learn')) return detectBrowserLocale()
    return defaultLocale
}

/**
 * Provider for Learn page locale context
 * 
 * Priority:
 * 1. Saved preference (localStorage)
 * 2. Browser language (Accept-Language)
 * 3. Default to English
 */
export function LearnLocaleProvider({ children, defaultLocale = 'en' }: LearnLocaleProviderProps) {
    const [locale, setLocaleState] = useState<LearnLocale>(() => getInitialLocale(defaultLocale))
    const isClient = useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false
    )

    const setLocale = useCallback((newLocale: LearnLocale) => {
        setLocaleState(newLocale)
        saveLocale(newLocale)
    }, [])

    const toggleLocale = useCallback(() => {
        const newLocale = locale === 'en' ? 'it' : 'en'
        setLocale(newLocale)
    }, [locale, setLocale])

    // Prevent hydration mismatch by using default locale during SSR
    const effectiveLocale = isClient ? locale : defaultLocale
    const value: LearnLocaleContextType = {
        locale: effectiveLocale,
        setLocale,
        t: translations[effectiveLocale],
        toggleLocale
    }

    return (
        <LearnLocaleContext.Provider value={value}>
            {children}
        </LearnLocaleContext.Provider>
    )
}

/**
 * Hook to access Learn page locale and translations
 */
export function useLearnLocale(): LearnLocaleContextType {
    const context = useContext(LearnLocaleContext)

    if (context === undefined) {
        throw new Error('useLearnLocale must be used within a LearnLocaleProvider')
    }

    return context
}

/**
 * Simple locale toggle component for Learn page
 */
export function LearnLocaleToggle({ className = '' }: { className?: string }) {
    const { locale, toggleLocale, t } = useLearnLocale()
    const mounted = useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false
    )

    // ...existing code...
    if (!mounted) {
        // Skeleton during SSR
        return (
            <button
                className={`inline-flex items-center gap-1 p-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${className}`}
                aria-label={locale === 'en' ? t.header.localeToggle.switchToItalian : t.header.localeToggle.switchToEnglish}
            >
                <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-white dark:bg-slate-700 shadow-sm opacity-50">
                    <span>🇮🇹</span>
                    <span className="text-slate-900 dark:text-white">IT</span>
                </span>
                <span className="flex items-center gap-1 px-2 py-1 rounded-full opacity-50">
                    <span>🇬🇧</span>
                    <span>EN</span>
                </span>
            </button>
        )
    }

    return (
        <button
            onClick={toggleLocale}
            className={`group inline-flex items-center gap-0.5 p-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all hover:border-slate-300 dark:hover:border-slate-600 ${className}`}
            aria-label={locale === 'en' ? t.header.localeToggle.switchToItalian : t.header.localeToggle.switchToEnglish}
        >
            <span className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 ${locale === 'it'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                }`}>
                <span>🇮🇹</span>
                <span className="hidden sm:inline">IT</span>
            </span>
            <span className={`flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 ${locale === 'en'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/5'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                }`}>
                <span>🇬🇧</span>
                <span className="hidden sm:inline">EN</span>
            </span>
        </button>
    )
}
