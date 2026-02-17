'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface AnimatedCounterProps {
    /** Target number to count up to */
    value: number
    /** Duration of animation in milliseconds */
    duration?: number
    /** Optional suffix (e.g., '+', 'K', '%') */
    suffix?: string
    /** Optional prefix (e.g., '€', '$') */
    prefix?: string
    /** Decimal places to show */
    decimals?: number
    /** Additional CSS classes */
    className?: string
    /** Format large numbers (e.g., 1000 -> 1K) */
    formatLarge?: boolean
}

/**
 * AnimatedCounter - Displays a number with a count-up animation
 * 
 * Triggers animation when the element comes into view.
 * Respects reduced motion preferences.
 * 
 * @example
 * <AnimatedCounter value={127} suffix="+" />
 * <AnimatedCounter value={15000} formatLarge suffix=" users" />
 */
export function AnimatedCounter({
    value,
    duration = 2000,
    suffix = '',
    prefix = '',
    decimals = 0,
    className = '',
    formatLarge = false,
}: AnimatedCounterProps) {
    const [displayValue, setDisplayValue] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)
    const ref = useRef<HTMLSpanElement>(null)

    // Check for reduced motion preference
    const prefersReducedMotion = useMemo(
        () =>
        typeof window !== 'undefined'
            ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
            : false,
        []
    )

    const animateValue = useCallback((start: number, end: number, animDuration: number) => {
        const startTime = performance.now()

        const updateValue = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / animDuration, 1)

            // Easing function (ease-out-cubic)
            const easeOut = 1 - Math.pow(1 - progress, 3)

            const currentValue = start + (end - start) * easeOut
            setDisplayValue(currentValue)

            if (progress < 1) {
                requestAnimationFrame(updateValue)
            } else {
                setDisplayValue(end)
            }
        }

        requestAnimationFrame(updateValue)
    }, [])

    useEffect(() => {
        const element = ref.current
        if (!element) return

        // Skip animation for reduced motion
        if (prefersReducedMotion) {
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !hasAnimated) {
                        setHasAnimated(true)
                        animateValue(0, value, duration)
                    }
                })
            },
            { threshold: 0.3 }
        )

        observer.observe(element)

        return () => observer.disconnect()
    }, [animateValue, value, duration, hasAnimated, prefersReducedMotion])

    const formatNumber = (num: number): string => {
        if (formatLarge) {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M'
            }
            if (num >= 1000) {
                return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K'
            }
        }
        return num.toFixed(decimals)
    }

    return (
        <span ref={ref} className={className}>
            {prefix}
            {formatNumber(prefersReducedMotion ? value : displayValue)}
            {suffix}
        </span>
    )
}

export default AnimatedCounter
