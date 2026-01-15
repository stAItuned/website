'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePWADetection } from '@/hooks/usePWADetection'

interface CachedArticle {
    url: string
    slug: string
    title: string
    coverImage?: string
    cachedAt: number
}

// Inline SVG Icons
function TrashIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
    )
}

function OfflineIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
    )
}

function EmptyStateIcon({ className = "w-16 h-16" }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
    )
}

/**
 * Offline Articles List Component
 * 
 * Shows all articles that have been saved for offline reading.
 * Only visible in PWA standalone mode.
 * 
 * Features:
 * - Lists cached articles with title and timestamp
 * - Allows removing individual articles from cache
 * - Shows empty state when no articles are cached
 */
export function OfflineArticlesList() {
    const { isPWA } = usePWADetection()
    const [articles, setArticles] = useState<CachedArticle[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Load cached articles from service worker
    useEffect(() => {
        if (!isPWA) {
            setIsLoading(false)
            return
        }

        const loadCachedArticles = async () => {
            try {
                // Get list of cached URLs from service worker via cache API
                if ('caches' in window) {
                    const cache = await caches.open('staituned-learn-articles-v2.1.0')
                    const keys = await cache.keys()

                    const cachedArticles: CachedArticle[] = keys
                        .filter(req => req.url.includes('/learn/') && req.url.includes('/articles/'))
                        .map(req => {
                            const url = new URL(req.url)
                            const pathParts = url.pathname.split('/')
                            const slug = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2]

                            return {
                                url: url.pathname,
                                slug,
                                title: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                                cachedAt: Date.now() // We can't get actual cache time easily
                            }
                        })

                    setArticles(cachedArticles)
                }
            } catch (error) {
                console.error('[OfflineArticles] Failed to load cached articles:', error)
            } finally {
                setIsLoading(false)
            }
        }

        loadCachedArticles()
    }, [isPWA])

    const handleRemove = async (url: string) => {
        try {
            if ('caches' in window) {
                const cache = await caches.open('staituned-learn-articles-v2.1.0')
                await cache.delete(url)
                setArticles(prev => prev.filter(a => a.url !== url))
            }
        } catch (error) {
            console.error('[OfflineArticles] Failed to remove article:', error)
        }
    }

    // Only show in PWA mode
    if (!isPWA) return null

    if (isLoading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-pulse flex flex-col gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                    ))}
                </div>
            </div>
        )
    }

    if (articles.length === 0) {
        return (
            <div className="p-8 text-center">
                <EmptyStateIcon className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Nessun articolo salvato
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    Salva articoli per leggerli offline. Tocca l'icona
                    <OfflineIcon className="inline w-4 h-4 mx-1" />
                    su qualsiasi articolo.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-3 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <OfflineIcon className="w-4 h-4" />
                    Articoli Salvati ({articles.length})
                </h3>
            </div>

            {articles.map((article) => (
                <div
                    key={article.url}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                    {/* Thumbnail placeholder */}
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center shrink-0">
                        <OfflineIcon className="w-5 h-5 text-slate-400" />
                    </div>

                    {/* Article info */}
                    <Link
                        href={article.url}
                        className="flex-1 min-w-0"
                    >
                        <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            {article.title}
                        </h4>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                            Disponibile offline
                        </p>
                    </Link>

                    {/* Remove button */}
                    <button
                        onClick={() => handleRemove(article.url)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Rimuovi dai salvati"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    )
}

export default OfflineArticlesList
