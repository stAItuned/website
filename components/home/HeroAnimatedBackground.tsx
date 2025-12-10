'use client'

import { useEffect, useRef } from 'react'

interface FloatingOrb {
    id: number
    x: number
    y: number
    size: number
    color: string
    duration: number
    delay: number
}

interface HeroAnimatedBackgroundProps {
    /** Number of floating orbs */
    orbCount?: number
    /** Enable subtle grid pattern */
    showGrid?: boolean
    /** Additional CSS classes */
    className?: string
}

/**
 * HeroAnimatedBackground - Animated background with floating gradient orbs
 * 
 * Features:
 * - Floating gradient orbs with blur effect
 * - Optional subtle grid pattern overlay
 * - Respects reduced motion preferences
 * - Performance optimized with CSS animations
 */
export function HeroAnimatedBackground({
    orbCount = 4,
    showGrid = false,
    className = '',
}: HeroAnimatedBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Generate random orbs configuration
    const orbs: FloatingOrb[] = Array.from({ length: orbCount }, (_, i) => ({
        id: i,
        x: 15 + (i * 25) % 70, // Distributed across the container
        y: 10 + (i * 20) % 60,
        size: 200 + Math.random() * 300,
        color: i % 2 === 0 ? 'amber' : 'blue',
        duration: 15 + Math.random() * 10,
        delay: i * 2,
    }))

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
            aria-hidden="true"
        >
            {/* Floating Orbs */}
            {orbs.map((orb) => (
                <div
                    key={orb.id}
                    className={`
            absolute rounded-full blur-3xl
            motion-reduce:animate-none
            ${orb.color === 'amber'
                            ? 'bg-amber-400/20 dark:bg-amber-500/15'
                            : 'bg-blue-400/15 dark:bg-blue-500/10'
                        }
          `}
                    style={{
                        left: `${orb.x}%`,
                        top: `${orb.y}%`,
                        width: orb.size,
                        height: orb.size,
                        // Using separate properties instead of shorthand to avoid React warning
                        animationName: 'float-orb',
                        animationDuration: `${orb.duration}s`,
                        animationTimingFunction: 'ease-in-out',
                        animationIterationCount: 'infinite',
                        animationDelay: `${orb.delay}s`,
                    }}
                />
            ))}

            {/* Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50 dark:to-slate-950/70" />

            {/* Optional Grid Pattern */}
            {showGrid && (
                <div
                    className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
                        backgroundSize: '60px 60px',
                    }}
                />
            )}

            {/* Radial Glow at top */}
            <div
                className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-full h-full 
                   bg-gradient-radial from-amber-500/10 via-transparent to-transparent
                   dark:from-amber-400/5"
            />
        </div>
    )
}

export default HeroAnimatedBackground
