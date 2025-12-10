'use client'

import { useEffect, useCallback, useRef, useState } from 'react'

interface ReadingProgressData {
    scrollPercent: number
    lastRead: number // timestamp
    articleSlug: string
}

const STORAGE_KEY_PREFIX = 'reading_progress_'
const DEBOUNCE_MS = 500
const MIN_SCROLL_TO_SAVE = 5 // Don't save if user barely scrolled

/**
 * useReadingProgress - Persist and restore reading position
 * Saves scroll position to localStorage and shows "Continue Reading" prompt
 */
export function useReadingProgress(articleSlug: string) {
    const [savedProgress, setSavedProgress] = useState<ReadingProgressData | null>(null)
    const [showContinuePrompt, setShowContinuePrompt] = useState(false)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)
    const hasRestoredRef = useRef(false)

    const storageKey = `${STORAGE_KEY_PREFIX}${articleSlug}`

    // Load saved progress on mount
    useEffect(() => {
        if (typeof window === 'undefined') return

        try {
            const stored = localStorage.getItem(storageKey)
            if (stored) {
                const data: ReadingProgressData = JSON.parse(stored)
                // Only show prompt if progress was significant (>10%) and not too old (< 30 days)
                const isRecent = Date.now() - data.lastRead < 30 * 24 * 60 * 60 * 1000
                const isSignificant = data.scrollPercent > 10 && data.scrollPercent < 95

                if (isRecent && isSignificant) {
                    setSavedProgress(data)
                    setShowContinuePrompt(true)
                }
            }
        } catch (e) {
            // localStorage not available or corrupted data
        }
    }, [storageKey])

    // Save progress (debounced)
    const saveProgress = useCallback((scrollPercent: number) => {
        if (typeof window === 'undefined') return
        if (scrollPercent < MIN_SCROLL_TO_SAVE) return

        if (debounceRef.current) {
            clearTimeout(debounceRef.current)
        }

        debounceRef.current = setTimeout(() => {
            try {
                const data: ReadingProgressData = {
                    scrollPercent,
                    lastRead: Date.now(),
                    articleSlug
                }
                localStorage.setItem(storageKey, JSON.stringify(data))
            } catch (e) {
                // localStorage full or not available
            }
        }, DEBOUNCE_MS)
    }, [articleSlug, storageKey])

    // Restore scroll position
    const restorePosition = useCallback(() => {
        if (!savedProgress || hasRestoredRef.current) return

        hasRestoredRef.current = true
        setShowContinuePrompt(false)

        // Calculate scroll position from percentage
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const targetScroll = (savedProgress.scrollPercent / 100) * docHeight

        // Smooth scroll to saved position
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        })
    }, [savedProgress])

    // Dismiss the prompt without scrolling
    const dismissPrompt = useCallback(() => {
        setShowContinuePrompt(false)
    }, [])

    // Clear saved progress (when article is completed)
    const clearProgress = useCallback(() => {
        if (typeof window === 'undefined') return
        try {
            localStorage.removeItem(storageKey)
            setSavedProgress(null)
        } catch (e) {
            // Ignore
        }
    }, [storageKey])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
        }
    }, [])

    return {
        savedProgress,
        showContinuePrompt,
        saveProgress,
        restorePosition,
        dismissPrompt,
        clearProgress
    }
}
