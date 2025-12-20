'use client'

import { useEffect, useState, useRef } from 'react'
import { useLearnLocale } from '@/lib/i18n'

interface LearnStatsProps {
    articleCount?: number
    className?: string
}

/**
 * Statistics/Social Proof section
 * 
 * Shows key metrics with animated counters on scroll-into-view
 */
export function LearnStats({ articleCount = 30, className = '' }: LearnStatsProps) {
    const { t } = useLearnLocale()
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    // Intersection Observer for scroll-into-view animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.3 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const stats = [
        {
            value: articleCount,
            label: t.common.articles,
            suffix: '+',
            icon: '📚',
            color: 'from-primary-500 to-amber-500'
        },
        {
            value: 100,
            label: t.common.free,
            suffix: '%',
            icon: '🎁',
            color: 'from-emerald-500 to-teal-500'
        },
        {
            value: 10,
            label: 'Contributors',
            suffix: '+',
            icon: '✍️',
            color: 'from-indigo-500 to-purple-500'
        },
        {
            value: 0,
            label: 'Paywalls',
            suffix: '',
            icon: '🔓',
            color: 'from-rose-500 to-pink-500'
        }
    ]

    return (
        <section ref={sectionRef} className={`relative ${className}`}>
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900/50 dark:via-slate-800/50 dark:to-slate-900/50 rounded-3xl -z-10" />

            <div className="py-12 px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`text-center transform transition-all duration-700 ${isVisible
                                    ? 'translate-y-0 opacity-100'
                                    : 'translate-y-8 opacity-0'
                                }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            {/* Icon */}
                            <div className="text-3xl mb-3">{stat.icon}</div>

                            {/* Animated counter */}
                            <div className={`text-4xl md:text-5xl font-extrabold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-2`}>
                                <AnimatedCounter
                                    target={stat.value}
                                    suffix={stat.suffix}
                                    isActive={isVisible}
                                    delay={index * 100}
                                />
                            </div>

                            {/* Label */}
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

/**
 * Animated counter component
 */
function AnimatedCounter({
    target,
    suffix = '',
    isActive,
    delay = 0
}: {
    target: number
    suffix?: string
    isActive: boolean
    delay?: number
}) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!isActive) return

        const timer = setTimeout(() => {
            const duration = 1500 // ms
            const steps = 30
            const stepValue = target / steps
            const stepDuration = duration / steps

            let current = 0
            const interval = setInterval(() => {
                current += stepValue
                if (current >= target) {
                    setCount(target)
                    clearInterval(interval)
                } else {
                    setCount(Math.floor(current))
                }
            }, stepDuration)

            return () => clearInterval(interval)
        }, delay)

        return () => clearTimeout(timer)
    }, [isActive, target, delay])

    return <span>{count}{suffix}</span>
}
