'use client'

import { useState, useRef } from 'react'
import { ArticleTicker, type ArticleTickerRef, type TickerArticle } from '@/components/ui/ArticleTicker'

interface BusinessTickerProps {
    articles: TickerArticle[]
}

/**
 * BusinessTicker - Client wrapper for the ArticleTicker on the business page
 * Shows business-focused articles with play/pause and navigation controls
 */
export function BusinessTicker({ articles }: BusinessTickerProps) {
    const [isPaused, setIsPaused] = useState(false)
    const tickerRef = useRef<ArticleTickerRef>(null)

    return (
        <div className="space-y-3">
            {/* Ticker Header with Controls */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Articoli Business
                    </span>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1.5">
                    {/* Play/Pause */}
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all shadow-sm ${isPaused
                                ? 'bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400'
                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600'
                            }`}
                        aria-label={isPaused ? 'Play ticker' : 'Pause ticker'}
                    >
                        {isPaused ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        )}
                    </button>

                    {/* Navigation Arrows */}
                    <button
                        onClick={() => {
                            setIsPaused(true)
                            tickerRef.current?.scrollPrev()
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600"
                        aria-label="Articolo precedente"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => {
                            setIsPaused(true)
                            tickerRef.current?.scrollNext()
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-all shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600"
                        aria-label="Articolo successivo"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Ticker Component */}
            <div className="-mx-4">
                <ArticleTicker
                    ref={tickerRef}
                    articles={articles}
                    speed="normal"
                    pauseOnHover={true}
                    showCover={true}
                    showDate={true}
                    showStats={true}
                    externalPaused={isPaused}
                    className="py-2"
                />
            </div>
        </div>
    )
}
