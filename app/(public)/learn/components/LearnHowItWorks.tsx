'use client'

import { useEffect, useState, useRef } from 'react'
import { useLearnLocale } from '@/lib/i18n'

interface LearnHowItWorksProps {
    className?: string
}

/**
 * How it works section - step-by-step process for both paths
 * 
 * Card-based design with staggered animations on scroll
 */
export function LearnHowItWorks({ className = '' }: LearnHowItWorksProps) {
    const { t } = useLearnLocale()
    const [isVisible, setIsVisible] = useState(false)
    const sectionRef = useRef<HTMLDivElement>(null)

    // Intersection Observer for scroll animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.2 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const stepIcons = {
        contributor: ['💡', '📝', '🚀'],
        lab: ['📋', '⚡', '🎯']
    }

    return (
        <section ref={sectionRef} className={`${className}`}>
            {/* Section Header */}
            <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-800 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent mb-4">
                    {t.howItWorks.title}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-indigo-500 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                {/* Contributor Path */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-amber-500 flex items-center justify-center text-2xl shadow-lg shadow-primary-500/25">
                            ✍️
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            {t.howItWorks.contributor.title}
                        </h3>
                    </div>

                    <div className="relative">
                        {/* Connecting line */}
                        <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gradient-to-b from-primary-500 via-primary-300 to-primary-100 dark:from-primary-500 dark:via-primary-700 dark:to-primary-900" />

                        <div className="space-y-4">
                            {t.howItWorks.contributor.steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`relative group transition-all duration-500 ${isVisible
                                            ? 'translate-x-0 opacity-100'
                                            : '-translate-x-8 opacity-0'
                                        }`}
                                    style={{ transitionDelay: `${index * 150}ms` }}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Step indicator */}
                                        <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-primary-500 flex items-center justify-center text-xl shadow-md group-hover:scale-110 group-hover:shadow-lg group-hover:border-primary-400 transition-all duration-300">
                                            {stepIcons.contributor[index]}
                                        </div>

                                        {/* Card */}
                                        <div className="flex-1 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:shadow-md group-hover:border-primary-300 dark:group-hover:border-primary-700 transition-all duration-300">
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                {step.title}
                                            </h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Lab Path */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/25">
                            🚀
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            {t.howItWorks.lab.title}
                        </h3>
                    </div>

                    <div className="relative">
                        {/* Connecting line */}
                        <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-gradient-to-b from-indigo-500 via-indigo-300 to-indigo-100 dark:from-indigo-500 dark:via-indigo-700 dark:to-indigo-900" />

                        <div className="space-y-4">
                            {t.howItWorks.lab.steps.map((step, index) => (
                                <div
                                    key={index}
                                    className={`relative group transition-all duration-500 ${isVisible
                                            ? 'translate-x-0 opacity-100'
                                            : 'translate-x-8 opacity-0'
                                        }`}
                                    style={{ transitionDelay: `${index * 150 + 100}ms` }}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Step indicator */}
                                        <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border-2 border-indigo-500 flex items-center justify-center text-xl shadow-md group-hover:scale-110 group-hover:shadow-lg group-hover:border-indigo-400 transition-all duration-300">
                                            {stepIcons.lab[index]}
                                        </div>

                                        {/* Card */}
                                        <div className="flex-1 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 shadow-sm group-hover:shadow-md group-hover:border-indigo-300 dark:group-hover:border-indigo-700 transition-all duration-300">
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {step.title}
                                            </h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
