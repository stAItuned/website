'use client'

import { useState, useRef, useCallback, useMemo, useSyncExternalStore, type CSSProperties, ReactNode, useEffect } from 'react'
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
    /** Allow interaction inside tooltip (click/hover) */
    interactive?: boolean
}

export function Tooltip({
    children,
    content,
    delayDuration = 150,
    side = 'top',
    align = 'center',
    maxWidth = 200,
    contentClassName = '',
    interactive = false,
}: TooltipProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [coords, setCoords] = useState({ top: 0, left: 0 })
    const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const triggerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const hoveringContentRef = useRef(false)
    const [contentSize, setContentSize] = useState({ width: 0, height: 0 })
    const mounted = useSyncExternalStore(
        () => () => undefined,
        () => true,
        () => false
    )

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [])

    const updateCoords = useCallback(() => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect()
            setTriggerRect(rect)
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
        if (!interactive) {
            setIsOpen(false)
            return
        }
        timeoutRef.current = setTimeout(() => {
            if (!hoveringContentRef.current) setIsOpen(false)
        }, 80)
    }, [interactive])

    const handleClick = useCallback(() => {
        if ('ontouchstart' in window) {
            updateCoords()
            setIsOpen(prev => !prev)
        }
    }, [updateCoords])

    useEffect(() => {
        if (!isOpen || !contentRef.current) return
        const rect = contentRef.current.getBoundingClientRect()
        setContentSize({ width: rect.width, height: rect.height })
    }, [isOpen, content, maxWidth])

    // Positioning logic with viewport clamp + flip
    const position = useMemo(() => {
        if (!triggerRect) {
            return { style: {}, resolvedSide: side }
        }
        const rect = triggerRect
        const tooltipWidth = contentSize.width || maxWidth
        const tooltipHeight = contentSize.height || 0

        const viewportLeft = window.scrollX
        const viewportTop = window.scrollY
        const viewportRight = viewportLeft + window.innerWidth
        const viewportBottom = viewportTop + window.innerHeight
        const padding = 12
        const gap = 10

        let resolvedSide = side

        const fitsTop = rect.top + window.scrollY - gap - tooltipHeight >= viewportTop + padding
        const fitsBottom = rect.bottom + window.scrollY + gap + tooltipHeight <= viewportBottom - padding
        const fitsLeft = rect.left + window.scrollX - gap - tooltipWidth >= viewportLeft + padding
        const fitsRight = rect.right + window.scrollX + gap + tooltipWidth <= viewportRight - padding

        if (resolvedSide === 'top' && !fitsTop && fitsBottom) resolvedSide = 'bottom'
        if (resolvedSide === 'bottom' && !fitsBottom && fitsTop) resolvedSide = 'top'
        if (resolvedSide === 'left' && !fitsLeft && fitsRight) resolvedSide = 'right'
        if (resolvedSide === 'right' && !fitsRight && fitsLeft) resolvedSide = 'left'

        let top = coords.top
        let left = coords.left

        // Adjust based on side
        if (resolvedSide === 'top') {
            top = rect.top + window.scrollY - gap - tooltipHeight
            left = rect.left + window.scrollX + rect.width / 2 - tooltipWidth / 2
        } else if (resolvedSide === 'bottom') {
            top = rect.bottom + window.scrollY + gap
            left = rect.left + window.scrollX + rect.width / 2 - tooltipWidth / 2
        } else if (resolvedSide === 'left') {
            top = rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2
            left = rect.left + window.scrollX - gap - tooltipWidth
        } else if (resolvedSide === 'right') {
            top = rect.top + window.scrollY + rect.height / 2 - tooltipHeight / 2
            left = rect.right + window.scrollX + gap
        }

        // Clamp to viewport
        top = Math.min(
            Math.max(top, viewportTop + padding),
            viewportBottom - tooltipHeight - padding
        )
        left = Math.min(
            Math.max(left, viewportLeft + padding),
            viewportRight - tooltipWidth - padding
        )

        return {
            style: {
                position: 'absolute' as const,
                top: `${top}px`,
                left: `${left}px`,
                maxWidth: `${maxWidth}px`,
                transform: 'translateZ(0)',
                zIndex: 9999,
            },
            resolvedSide,
        }
    }, [contentSize.height, contentSize.width, coords.left, coords.top, maxWidth, side, triggerRect])

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
                    ref={contentRef}
                    style={position.style}
                    onMouseEnter={() => {
                        hoveringContentRef.current = true
                        if (timeoutRef.current) clearTimeout(timeoutRef.current)
                    }}
                    onMouseLeave={() => {
                        hoveringContentRef.current = false
                        setIsOpen(false)
                    }}
                    className={`
                        ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}
                        animate-fadeIn
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
                            ${position.resolvedSide === 'top' ? 'top-full -mt-1 left-1/2 -translate-x-1/2' : ''}
                            ${position.resolvedSide === 'bottom' ? 'bottom-full -mb-1 left-1/2 -translate-x-1/2' : ''}
                            ${position.resolvedSide === 'left' ? 'left-full -ml-1 top-1/2 -translate-y-1/2' : ''}
                            ${position.resolvedSide === 'right' ? 'right-full -mr-1 top-1/2 -translate-y-1/2' : ''}
                        `}
                    />
                </div>,
                document.body
            )}
        </>
    )
}

export default Tooltip
