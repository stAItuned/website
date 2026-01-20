'use client'

import { useLearnLocale, homeTranslations } from '@/lib/i18n'

/**
 * DifferentiatorsSection - Why stAItuned?
 * 
 * Communicates the 3 key differentiators:
 * - Practitioner-led: Written by those who work with AI daily
 * - Zero hype: Honest about what works and what doesn't
 * - Practical first: If you can't apply it tomorrow, we don't publish it
 */
export function DifferentiatorsSection() {
    const { locale } = useLearnLocale()
    const t = homeTranslations[locale]

    const items = [
        {
            key: 'practitioner',
            ...t.differentiators.items.practitioner,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            gradient: 'from-violet-500 to-purple-500',
        },
        {
            key: 'noHype',
            ...t.differentiators.items.noHype,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
            ),
            gradient: 'from-emerald-500 to-teal-500',
        },
        {
            key: 'practical',
            ...t.differentiators.items.practical,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
            ),
            gradient: 'from-amber-500 to-orange-500',
        },
    ]

    return (
        <section className="py-16 px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider">
                        {t.differentiators.badge}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                        {t.differentiators.title}
                    </h2>
                </div>

                {/* Differentiators - Horizontal on Desktop */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {items.map((item) => (
                        <div
                            key={item.key}
                            className="text-center space-y-3"
                        >
                            {/* Icon */}
                            <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg`}>
                                {item.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {item.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
