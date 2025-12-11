'use client'

import { useState } from 'react'
import { useOfflineArticle } from '@/hooks/useOfflineArticle'
import { usePWADetection } from '@/hooks/usePWADetection'

// Inline SVG Icons
function DownloadIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
    )
}

function CheckIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    )
}

function LoadingSpinner({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    )
}

interface SaveForOfflineButtonProps {
    articleSlug: string
    className?: string
    /** Compact version for toolbars */
    compact?: boolean
}

/**
 * Save for Offline Button
 * 
 * Allows users to explicitly save an article for offline reading.
 * Shows different states: ready, loading, saved.
 * 
 * ONLY VISIBLE when running as an installed PWA (standalone mode).
 * This avoids confusion with the bookmark/favorite button in browser mode.
 */
export function SaveForOfflineButton({
    articleSlug,
    className = '',
    compact = false
}: SaveForOfflineButtonProps) {
    const { isPWA } = usePWADetection()
    const { isCached, isLoading, saveForOffline } = useOfflineArticle(articleSlug)
    const [justSaved, setJustSaved] = useState(false)

    // Only show in PWA mode - not in regular browser
    if (!isPWA) {
        return null
    }

    const handleClick = async () => {
        if (isCached) {
            // Already cached - just show saved state
            return
        }

        const success = await saveForOffline()
        if (success) {
            setJustSaved(true)
            setTimeout(() => setJustSaved(false), 3000)
        }
    }

    const showSaved = isCached || justSaved

    // Compact version for action bars
    if (compact) {
        return (
            <button
                onClick={handleClick}
                disabled={isLoading || isCached}
                className={`
                    flex items-center justify-center gap-1.5 p-2
                    rounded-lg transition-all
                    ${showSaved
                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }
                    ${isLoading ? 'opacity-75' : ''}
                    ${className}
                `}
                title={showSaved ? 'Available offline' : 'Make available offline'}
            >
                {isLoading ? (
                    <LoadingSpinner className="w-4 h-4" />
                ) : showSaved ? (
                    <CheckIcon className="w-4 h-4" />
                ) : (
                    <DownloadIcon className="w-4 h-4" />
                )}
            </button>
        )
    }

    // Full version with text
    return (
        <button
            onClick={handleClick}
            disabled={isLoading || isCached}
            className={`
                flex items-center gap-2 px-4 py-2.5
                rounded-xl font-medium text-sm
                transition-all
                ${showSaved
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }
                ${isLoading ? 'opacity-75 cursor-wait' : ''}
                ${className}
            `}
        >
            {isLoading ? (
                <>
                    <LoadingSpinner className="w-4 h-4" />
                    <span>Saving...</span>
                </>
            ) : showSaved ? (
                <>
                    <CheckIcon className="w-4 h-4" />
                    <span>Available offline</span>
                </>
            ) : (
                <>
                    <DownloadIcon className="w-4 h-4" />
                    <span>Read offline</span>
                </>
            )}
        </button>
    )
}

export default SaveForOfflineButton
