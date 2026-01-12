'use client'

import { useState, useRef, useCallback, ReactNode, useEffect } from 'react'

/**
 * Tooltip Component
 * 
 * A lightweight tooltip that shows on hover (desktop) or click (mobile).
 * Supports configurable delay and positioning.
 */

interface TooltipProps {
    children: ReactNode
    content: ReactNode
    /** Delay before showing tooltip in ms (default: 150) */
    delayDuration?: number
    /** Side to show tooltip (default: 'top') */
    side?: 'top' | 'bottom' | 'left' | 'right'
    /** Alignment (default: 'center') */
    align?: 'start' | 'center' | 'end'
    /** Max width of tooltip content (default: 200) */
    maxWidth?: number
    /** Class name for content wrapper */
    contentClassName?: string
}

export function Tooltip({
    children,
    content,
    delayDuration = 150,
    side = 'top',
    align = 'center',
    maxWidth = 200,
    contentClassName = '',
}: TooltipProps) {
    const [isOpen, setIsOpen] = useState(false)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const triggerRef = useRef<HTMLDivElement>(null)

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    const handleMouseEnter = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(true)
        }, delayDuration)
    }, [delayDuration])

    const handleMouseLeave = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setIsOpen(false)
    }, [])

    // Mobile: toggle on click
    const handleClick = useCallback(() => {
        // Only toggle on touch devices
        if ('ontouchstart' in window) {
            setIsOpen(prev => !prev)
        }
    }, [])

    // Position classes based on side and align
    const getPositionClasses = () => {
        const positions: Record<string, string> = {
            'top-start': 'bottom-full left-0 mb-2',
            'top-center': 'bottom-full left-1/2 -translate-x-1/2 mb-2',
            'top-end': 'bottom-full right-0 mb-2',
            'bottom-start': 'top-full left-0 mt-2',
            'bottom-center': 'top-full left-1/2 -translate-x-1/2 mt-2',
            'bottom-end': 'top-full right-0 mt-2',
            'left-start': 'right-full top-0 mr-2',
            'left-center': 'right-full top-1/2 -translate-y-1/2 mr-2',
            'left-end': 'right-full bottom-0 mr-2',
            'right-start': 'left-full top-0 ml-2',
            'right-center': 'left-full top-1/2 -translate-y-1/2 ml-2',
            'right-end': 'left-full bottom-0 ml-2',
        }
        return positions[`${side}-${align}`] || positions['top-center']
    }

    if (!content) return <>{children}</>

    return (
        <div
            ref={triggerRef}
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {children}

            {isOpen && (
                <div
                    role="tooltip"
                    className={`
                        absolute z-50 ${getPositionClasses()}
                        px-3 py-2 text-xs rounded-lg
                        bg-slate-900 dark:bg-slate-100
                        text-white dark:text-slate-900
                        shadow-lg animate-fadeIn
                        pointer-events-none
                        ${contentClassName}
                    `}
                    style={{ maxWidth }}
                >
                    {content}
                    {/* Arrow indicator */}
                    <div
                        className={`
                            absolute w-2 h-2 rotate-45
                            bg-slate-900 dark:bg-slate-100
                            ${side === 'top' ? 'top-full -mt-1 left-1/2 -translate-x-1/2' : ''}
                            ${side === 'bottom' ? 'bottom-full -mb-1 left-1/2 -translate-x-1/2' : ''}
                            ${side === 'left' ? 'left-full -ml-1 top-1/2 -translate-y-1/2' : ''}
                            ${side === 'right' ? 'right-full -mr-1 top-1/2 -translate-y-1/2' : ''}
                        `}
                    />
                </div>
            )}
        </div>
    )
}

export default Tooltip
