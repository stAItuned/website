'use client'

import { useState, useCallback, useRef, useEffect, ReactNode } from 'react'

interface PullToRefreshProps {
    /** Content to wrap with pull-to-refresh behavior */
    children: ReactNode
    /** Callback when refresh is triggered */
    onRefresh: () => Promise<void>
    /** Pull distance required to trigger refresh (default: 80px) */
    pullThreshold?: number
    /** Only enable in PWA mode */
    pwaOnly?: boolean
    /** Custom loading indicator */
    loadingIndicator?: ReactNode
}

/**
 * Pull-to-Refresh Component
 * 
 * Wraps content with native-like pull-to-refresh behavior.
 * Best used at the top of scrollable lists.
 * 
 * ONLY works in PWA standalone mode by default to avoid
 * conflicts with browser's native refresh behavior.
 */
export function PullToRefresh({
    children,
    onRefresh,
    pullThreshold = 80,
    pwaOnly = true,
    loadingIndicator
}: PullToRefreshProps) {
    const [pullDistance, setPullDistance] = useState(0)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [isPulling, setIsPulling] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const startY = useRef(0)
    const isPWA = useRef(false)

    // Check if running as PWA
    useEffect(() => {
        if (typeof window !== 'undefined') {
            isPWA.current = window.matchMedia('(display-mode: standalone)').matches
                || (window.navigator as Navigator & { standalone?: boolean }).standalone === true
        }
    }, [])

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        // Only enable if at top of scroll and (not pwaOnly or is PWA)
        if (containerRef.current?.scrollTop === 0 && (!pwaOnly || isPWA.current)) {
            startY.current = e.touches[0].clientY
            setIsPulling(true)
        }
    }, [pwaOnly])

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isPulling || isRefreshing) return

        const currentY = e.touches[0].clientY
        const diff = currentY - startY.current

        if (diff > 0) {
            // Apply resistance - the further you pull, the harder it gets
            const resistance = 0.5
            const distance = Math.min(diff * resistance, pullThreshold * 1.5)
            setPullDistance(distance)

            // Prevent default scroll when pulling down
            if (distance > 10) {
                e.preventDefault()
            }
        }
    }, [isPulling, isRefreshing, pullThreshold])

    const handleTouchEnd = useCallback(async () => {
        if (!isPulling) return
        setIsPulling(false)

        if (pullDistance >= pullThreshold && !isRefreshing) {
            setIsRefreshing(true)
            setPullDistance(pullThreshold) // Keep at threshold while refreshing

            try {
                await onRefresh()
            } catch (error) {
                console.error('[PullToRefresh] Refresh failed:', error)
            } finally {
                setIsRefreshing(false)
                setPullDistance(0)
            }
        } else {
            // Spring back
            setPullDistance(0)
        }
    }, [isPulling, pullDistance, pullThreshold, isRefreshing, onRefresh])

    // Calculate progress (0 to 1)
    const progress = Math.min(pullDistance / pullThreshold, 1)
    const shouldTrigger = progress >= 1

    return (
        <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative overflow-auto"
            style={{ touchAction: isPulling ? 'none' : 'auto' }}
        >
            {/* Pull indicator */}
            <div
                className={`
                    absolute left-0 right-0 flex items-center justify-center
                    transition-opacity duration-200
                    ${pullDistance > 10 || isRefreshing ? 'opacity-100' : 'opacity-0'}
                `}
                style={{
                    height: pullDistance,
                    top: 0,
                    transform: 'translateZ(0)', // Force GPU
                }}
            >
                {loadingIndicator || (
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        {isRefreshing ? (
                            <svg
                                className="w-5 h-5 animate-spin"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        ) : (
                            <svg
                                className={`w-5 h-5 transition-transform duration-200 ${shouldTrigger ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                            </svg>
                        )}
                        <span className="text-xs font-medium">
                            {isRefreshing
                                ? 'Aggiornamento...'
                                : shouldTrigger
                                    ? 'Rilascia per aggiornare'
                                    : 'Tira per aggiornare'}
                        </span>
                    </div>
                )}
            </div>

            {/* Content with transform for pull effect */}
            <div
                style={{
                    transform: `translateY(${pullDistance}px)`,
                    transition: isPulling ? 'none' : 'transform 0.2s ease-out',
                }}
            >
                {children}
            </div>
        </div>
    )
}

export default PullToRefresh
