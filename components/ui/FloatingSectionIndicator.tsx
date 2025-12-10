'use client'

import { useState, useEffect, useCallback } from 'react'

interface TocItem {
    slug: string
    text: string
    level: number
}

interface FloatingSectionIndicatorProps {
    toc: TocItem[]
    className?: string
}

/**
 * FloatingSectionIndicator - Shows the current section name as user scrolls
 */
export function FloatingSectionIndicator({ toc, className = '' }: FloatingSectionIndicatorProps) {
    const [currentSection, setCurrentSection] = useState<TocItem | null>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)

    const updateCurrentSection = useCallback(() => {
        if (toc.length === 0) return

        const scrollY = window.scrollY
        const viewportHeight = window.innerHeight

        // Only show indicator after scrolling past the header area
        if (scrollY < 300) {
            setIsVisible(false)
            setLastScrollY(scrollY)
            return
        }

        // Find which section is currently in view
        let activeSection: TocItem | null = null

        for (let i = toc.length - 1; i >= 0; i--) {
            const item = toc[i]
            const element = document.getElementById(item.slug) || document.getElementsByName(item.slug)[0]

            if (element) {
                const rect = element.getBoundingClientRect()
                // Section is considered active if its top is in the upper half of viewport
                if (rect.top <= viewportHeight * 0.3) {
                    activeSection = item
                    break
                }
            }
        }

        // Fallback to first section if nothing found
        if (!activeSection && toc.length > 0) {
            activeSection = toc[0]
        }

        setCurrentSection(activeSection)

        // Only show when scrolling up or when section changes
        const isScrollingUp = scrollY < lastScrollY
        const shouldShow = scrollY > 300 && (isScrollingUp || activeSection !== currentSection)

        setIsVisible(shouldShow)
        setLastScrollY(scrollY)

        // Auto-hide after 2 seconds if not scrolling
        if (shouldShow) {
            const hideTimer = setTimeout(() => {
                setIsVisible(false)
            }, 2500)
            return () => clearTimeout(hideTimer)
        }
    }, [toc, lastScrollY, currentSection])

    useEffect(() => {
        let ticking = false

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateCurrentSection()
                    ticking = false
                })
                ticking = true
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [updateCurrentSection])

    // Don't render if no TOC or no current section
    if (toc.length === 0 || !currentSection) return null

    return (
        <div
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 lg:hidden ${isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-4 pointer-events-none'
                } ${className}`}
        >
            <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-full px-4 py-2 shadow-lg border border-gray-200/50 dark:border-slate-700/50 max-w-[85vw]">
                <div className="flex items-center gap-2">
                    {/* Section indicator icon */}
                    <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary-500 animate-pulse" />

                    {/* Section name */}
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">
                        {currentSection.text}
                    </span>
                </div>
            </div>
        </div>
    )
}
