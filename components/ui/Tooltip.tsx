'use client'

import { useState, useRef, useCallback, ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

/**
 * Tooltip Component
 * 
 * A lightweight tooltip that shows on hover (desktop) or click (mobile).
 * Uses React Portal to ensure it's never clipped by parent containers.
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
    const [coords, setCoords] = useState({ top: 0, left: 0 })
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const triggerRef = useRef<HTMLDivElement>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const updateCoords = useCallback(() => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            setCoords({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
            })
        }
    }, [])

    const handleMouseEnter = useCallback(() => {
        updateCoords()
        timeoutRef.current = setTimeout(() => {
            setIsOpen(true)
        }, delayDuration)
    }, [delayDuration, updateCoords])

    const handleMouseLeave = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsOpen(false)
    }, [])

    const handleClick = useCallback(() => {
        if ('ontouchstart' in window) {
            updateCoords()
            setIsOpen(prev => !prev)
        }
    }, [updateCoords])

    // Positioning logic simplified for Portal
    const getTooltipStyle = () => {
        if (!triggerRef.current) return {}
        const rect = triggerRef.current.getBoundingClientRect()

        let top = coords.top
        let left = coords.left

        // Adjust based on side
        if (side === 'top') {
            top -= 8 // Gap
            left += rect.width / 2
        } else if (side === 'bottom') {
            top += rect.height + 8
            left += rect.width / 2
        } else if (side === 'left') {
            top += rect.height / 2
            left -= 8
        } else if (side === 'right') {
            top += rect.height / 2
            left += rect.width + 8
        }

        return {
            position: 'absolute' as const,
            top: `${top}px`,
            left: `${left}px`,
            maxWidth: `${maxWidth}px`,
            transform: side === 'top' || side === 'bottom' ? 'translateX(-50%)' : 'translateY(-50%)',
            zIndex: 9999,
        }
    }

    if (!content) return <>{children}</>

    return (
        <>
            <div
                ref={triggerRef}
                className="inline-block"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
            >
                {children}
            </div>

            {mounted && isOpen && createPortal(
                <div
                    role="tooltip"
                    style={getTooltipStyle()}
                    className={`
                        pointer-events-none animate-fadeIn
                        px-3 py-2 text-xs rounded-lg
                        bg-slate-900 dark:bg-slate-100
                        text-white dark:text-slate-900
                        shadow-2xl
                        ${contentClassName}
                    `}
                >
                    {content}
                    {/* Simplified arrow for portal version */}
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
                </div>,
                document.body
            )}
        </>
    )
}

export default Tooltip
