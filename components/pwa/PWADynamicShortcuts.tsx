'use client'

import { useEffect } from 'react'
import { usePWADetection } from '@/hooks/usePWADetection'
import { getReadingHistorySync } from '@/hooks/useReadingHistory'

/**
 * PWA Dynamic Shortcuts Manager
 * 
 * Updates PWA shortcuts in real-time based on user behavior:
 * - Last read article (dynamic)
 * - Search
 * 
 * Note: Dynamic shortcuts require the Shortcuts API which is
 * currently only supported in Chrome on Android. This component
 * gracefully degrades on unsupported platforms.
 */
export function PWADynamicShortcuts() {
    const { isPWA } = usePWADetection()

    useEffect(() => {
        // Only run in PWA mode and if Shortcuts API is supported
        if (!isPWA) return
        if (!('shortcuts' in navigator)) return

        const updateShortcuts = async () => {
            try {
                const history = getReadingHistorySync()
                const lastRead = history?.lastRead

                // Build dynamic shortcuts
                const dynamicShortcuts: ShortcutItem[] = []

                // 1. Last read article (if exists)
                if (lastRead) {
                    dynamicShortcuts.push({
                        name: `Continua: ${lastRead.title.substring(0, 30)}...`,
                        short_name: 'Continua',
                        description: 'Riprendi la lettura',
                        url: `/learn/${lastRead.target || 'newbie'}/${lastRead.slug}`,
                        icons: [{
                            src: '/icon-192.png',
                            sizes: '192x192',
                            type: 'image/png'
                        }]
                    })
                }

                // 2. Search
                dynamicShortcuts.push({
                    name: 'Cerca Articoli',
                    short_name: 'Cerca',
                    description: 'Trova articoli AI',
                    url: '/learn/articles?focus=search',
                    icons: [{
                        src: '/icon-192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    }]
                })

                // Update shortcuts via experimental API
                // @ts-expect-error - Shortcuts API is experimental
                if (navigator.shortcuts?.set) {
                    // @ts-expect-error - Shortcuts API is experimental
                    await navigator.shortcuts.set(dynamicShortcuts)
                    console.log('[PWA Shortcuts] Updated dynamic shortcuts')
                }
            } catch (error) {
                // Silently fail - API might not be supported
                console.debug('[PWA Shortcuts] Update failed:', error)
            }
        }

        // Update on mount
        updateShortcuts()

        // Update when localStorage changes (reading history)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'staituned-reading-history') {
                updateShortcuts()
            }
        }
        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [isPWA])

    // This component doesn't render anything
    return null
}

// Type definitions for the experimental Shortcuts API
interface ShortcutItem {
    name: string
    short_name: string
    description: string
    url: string
    icons: Array<{
        src: string
        sizes: string
        type: string
    }>
}

export default PWADynamicShortcuts
