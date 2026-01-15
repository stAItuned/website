'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'staituned-reading-history'
const MAX_HISTORY = 10

interface ReadingHistoryItem {
    slug: string
    title: string
    target?: string
    readAt: number
}

interface ReadingHistory {
    items: ReadingHistoryItem[]
    lastRead?: ReadingHistoryItem
}

/**
 * Hook to track reading history for PWA features
 * 
 * Features:
 * - Tracks last 10 articles read
 * - Persists to localStorage
 * - Provides quick access to last read article
 * - Used by PWA shortcuts and offline list
 */
export function useReadingHistory() {
    const [history, setHistory] = useState<ReadingHistory>({ items: [] })
    const [isLoaded, setIsLoaded] = useState(false)

    // Load history from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored) as ReadingHistory
                setHistory(parsed)
            }
        } catch (error) {
            console.error('[ReadingHistory] Failed to load:', error)
        }
        setIsLoaded(true)
    }, [])

    // Save history to localStorage whenever it changes
    useEffect(() => {
        if (!isLoaded) return
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
        } catch (error) {
            console.error('[ReadingHistory] Failed to save:', error)
        }
    }, [history, isLoaded])

    // Add an article to reading history
    const addToHistory = useCallback((article: {
        slug: string
        title: string
        target?: string
    }) => {
        setHistory(prev => {
            // Remove if already exists (will be re-added at top)
            const filtered = prev.items.filter(item => item.slug !== article.slug)

            const newItem: ReadingHistoryItem = {
                ...article,
                readAt: Date.now()
            }

            // Add to beginning, limit to MAX_HISTORY
            const newItems = [newItem, ...filtered].slice(0, MAX_HISTORY)

            return {
                items: newItems,
                lastRead: newItem
            }
        })
    }, [])

    // Clear all history
    const clearHistory = useCallback(() => {
        setHistory({ items: [] })
        try {
            localStorage.removeItem(STORAGE_KEY)
        } catch {
            // Ignore
        }
    }, [])

    return {
        history: history.items,
        lastRead: history.lastRead,
        addToHistory,
        clearHistory,
        isLoaded
    }
}

/**
 * Get reading history from localStorage (sync, for server components)
 * Returns null if not available
 */
export function getReadingHistorySync(): ReadingHistory | null {
    if (typeof window === 'undefined') return null
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? JSON.parse(stored) : null
    } catch {
        return null
    }
}

export default useReadingHistory
