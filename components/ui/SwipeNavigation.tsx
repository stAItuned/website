'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { event } from '@/lib/gtag'
import { useHaptics } from '@/lib/hooks/useHaptics'

interface SwipeNavigationProps {
    prevArticle?: { slug: string; title: string; target: string } | null
    nextArticle?: { slug: string; title: string; target: string } | null
    children: React.ReactNode
}

const SWIPE_THRESHOLD = 80 // Minimum distance to trigger navigation
const SWIPE_VELOCITY_THRESHOLD = 0.3 // Minimum velocity (px/ms)

/**
 * SwipeNavigation - Enables swipe left/right to navigate between articles
 */
export function SwipeNavigation({
    prevArticle,
    nextArticle,
    children
}: SwipeNavigationProps) {
    const router = useRouter()
    const haptics = useHaptics()
    const containerRef = useRef<HTMLDivElement>(null)

    const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null)
    const [swipeOffset, setSwipeOffset] = useState(0)
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
    const [isNavigating, setIsNavigating] = useState(false)

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        // Only track horizontal swipes that start near edges or with clear horizontal intent
        const touch = e.touches[0]
        setTouchStart({ x: touch.clientX, y: touch.clientY, time: Date.now() })
        setSwipeOffset(0)
        setSwipeDirection(null)
    }, [])

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!touchStart || isNavigating) return

        const touch = e.touches[0]
        const deltaX = touch.clientX - touchStart.x
        const deltaY = touch.clientY - touchStart.y

        // Only handle horizontal swipes (ignore if vertical movement is greater)
        if (Math.abs(deltaY) > Math.abs(deltaX) * 0.5) {
            return
        }

        // Check if swiping to a valid direction
        const canSwipeRight = deltaX > 0 && prevArticle
        const canSwipeLeft = deltaX < 0 && nextArticle

        if (!canSwipeRight && !canSwipeLeft) {
            setSwipeOffset(0)
            return
        }

        // Apply resistance at the edges
        const resistance = 0.4
        const offset = deltaX * resistance
        setSwipeOffset(offset)
        setSwipeDirection(deltaX > 0 ? 'right' : 'left')

        // Provide haptic feedback at threshold
        if (Math.abs(offset) >= SWIPE_THRESHOLD * resistance && Math.abs(swipeOffset) < SWIPE_THRESHOLD * resistance) {
            haptics.light()
        }
    }, [touchStart, isNavigating, prevArticle, nextArticle, haptics, swipeOffset])

    const handleTouchEnd = useCallback(() => {
        if (!touchStart || isNavigating) {
            setTouchStart(null)
            setSwipeOffset(0)
            return
        }

        const elapsedTime = Date.now() - touchStart.time
        const velocity = Math.abs(swipeOffset) / elapsedTime

        const shouldNavigate =
            Math.abs(swipeOffset) >= SWIPE_THRESHOLD * 0.4 ||
            velocity >= SWIPE_VELOCITY_THRESHOLD

        if (shouldNavigate && swipeDirection) {
            if (swipeDirection === 'right' && prevArticle) {
                setIsNavigating(true)
                haptics.success()

                event({
                    action: 'swipe_navigation',
                    category: 'navigation',
                    label: 'previous',
                    value: 1
                })

                // Navigate to previous article
                router.push(`/learn/${prevArticle.target}/${prevArticle.slug}`)
            } else if (swipeDirection === 'left' && nextArticle) {
                setIsNavigating(true)
                haptics.success()

                event({
                    action: 'swipe_navigation',
                    category: 'navigation',
                    label: 'next',
                    value: 1
                })

                // Navigate to next article
                router.push(`/learn/${nextArticle.target}/${nextArticle.slug}`)
            }
        }

        // Reset
        setTouchStart(null)
        setSwipeOffset(0)
        setSwipeDirection(null)
    }, [touchStart, swipeOffset, swipeDirection, prevArticle, nextArticle, router, haptics, isNavigating])

    // Reset navigating state on route change
    useEffect(() => {
        setIsNavigating(false)
    }, [])

    const showLeftHint = swipeDirection === 'left' && nextArticle && Math.abs(swipeOffset) > 20
    const showRightHint = swipeDirection === 'right' && prevArticle && Math.abs(swipeOffset) > 20

    return (
        <div
            ref={containerRef}
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Left swipe hint (next article) */}
            {showLeftHint && (
                <div
                    className="fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-150"
                    style={{
                        opacity: Math.min(Math.abs(swipeOffset) / 40, 1),
                        transform: `translateY(-50%) translateX(${Math.max(100 - Math.abs(swipeOffset) * 2, 0)}%)`
                    }}
                >
                    <div className="bg-primary-600 text-white px-4 py-3 rounded-l-2xl shadow-xl max-w-[200px]">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium truncate">{nextArticle?.title}</span>
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {/* Right swipe hint (previous article) */}
            {showRightHint && (
                <div
                    className="fixed left-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-150"
                    style={{
                        opacity: Math.min(Math.abs(swipeOffset) / 40, 1),
                        transform: `translateY(-50%) translateX(${Math.min(-100 + Math.abs(swipeOffset) * 2, 0)}%)`
                    }}
                >
                    <div className="bg-primary-600 text-white px-4 py-3 rounded-r-2xl shadow-xl max-w-[200px]">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-xs font-medium truncate">{prevArticle?.title}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Content with transform */}
            <div
                className="transition-transform duration-150"
                style={{
                    transform: isNavigating ? 'none' : `translateX(${swipeOffset}px)`
                }}
            >
                {children}
            </div>

            {/* Navigation overlay */}
            {isNavigating && (
                <div className="fixed inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="animate-pulse text-primary-600 dark:text-primary-400">
                        <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    )
}
