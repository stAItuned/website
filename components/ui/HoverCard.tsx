'use client'

import { useState, useRef, useCallback, ReactNode, useEffect } from 'react'

/**
 * HoverCard Component
 * 
 * A card that appears on hover, useful for showing rich previews.
 * Desktop: shows on hover with configurable delay
 * Mobile: tap to show, tap outside to hide
 */

interface HoverCardProps {
    children: ReactNode
    content: ReactNode
    /** Delay before showing card in ms (default: 150) */
    openDelay?: number
    /** Delay before hiding card in ms (default: 300) */
    closeDelay?: number
    /** Side to show card (default: 'bottom') */
    side?: 'top' | 'bottom'
    /** Alignment (default: 'center') */
    align?: 'start' | 'center' | 'end'
    /** Width of card (default: 320) */
    width?: number
    /** Class name for content wrapper */
    contentClassName?: string
}

export function HoverCard({
    children,
    content,
    openDelay = 150,
    closeDelay = 300,
    side = 'bottom',
    align = 'center',
    width = 320,
    contentClassName = '',
}: HoverCardProps) {
    const [isOpen, setIsOpen] = useState(false)
    const openTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Clean up timeouts on unmount
    useEffect(() => {
        return () => {
            if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
        }
    }, [])

    // Handle click outside for mobile
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen && 'ontouchstart' in window) {
            document.addEventListener('click', handleClickOutside)
            return () => document.removeEventListener('click', handleClickOutside)
        }
    }, [isOpen])

    const handleMouseEnter = useCallback(() => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current)
            closeTimeoutRef.current = null
        }
        openTimeoutRef.current = setTimeout(() => {
            setIsOpen(true)
        }, openDelay)
    }, [openDelay])

    const handleMouseLeave = useCallback(() => {
        if (openTimeoutRef.current) {
            clearTimeout(openTimeoutRef.current)
            openTimeoutRef.current = null
        }
        closeTimeoutRef.current = setTimeout(() => {
            setIsOpen(false)
        }, closeDelay)
    }, [closeDelay])

    // Mobile: toggle on click
    const handleClick = useCallback((e: React.MouseEvent) => {
        if ('ontouchstart' in window) {
            e.stopPropagation()
            setIsOpen(prev => !prev)
        }
    }, [])

    // Position classes based on side and align
    const getPositionClasses = () => {
        const positions: Record<string, string> = {
            'top-start': 'bottom-full left-0 mb-3',
            'top-center': 'bottom-full left-1/2 -translate-x-1/2 mb-3',
            'top-end': 'bottom-full right-0 mb-3',
            'bottom-start': 'top-full left-0 mt-3',
            'bottom-center': 'top-full left-1/2 -translate-x-1/2 mt-3',
            'bottom-end': 'top-full right-0 mt-3',
        }
        return positions[`${side}-${align}`] || positions['bottom-center']
    }

    return (
        <div
            ref={containerRef}
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {children}

            {isOpen && (
                <div
                    className={`
                        absolute z-50 ${getPositionClasses()}
                        p-4 rounded-xl
                        bg-white dark:bg-[#1A1E3B]
                        border border-slate-200 dark:border-slate-700
                        shadow-xl animate-fadeIn
                        ${contentClassName}
                    `}
                    style={{ width }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    {content}
                </div>
            )}
        </div>
    )
}

export default HoverCard
