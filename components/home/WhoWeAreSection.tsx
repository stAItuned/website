'use client'

import Link from 'next/link'
import { useLearnLocale, homeTranslations } from '@/lib/i18n'

/**
 * WhoWeAreSection - The 3 Pillars of stAItuned
 * 
 * Introduces the ecosystem to new visitors:
 * - Learn: Free technical articles
 * - Career OS: Mentoring programs
 * - Community: Network of contributors
 */
export function WhoWeAreSection() {
    const { locale } = useLearnLocale()
    const t = homeTranslations[locale]

    const pillars = [
        {
            key: 'learn',
            ...t.whoWeAre.pillars.learn,
            href: '/learn/articles',
            gradient: 'from-blue-500 to-cyan-500',
            iconBg: 'bg-blue-500/10 border-blue-500/20',
        },
        {
            key: 'careerOS',
            ...t.whoWeAre.pillars.careerOS,
            href: '/career-os',
            gradient: 'from-amber-500 to-orange-500',
            iconBg: 'bg-amber-500/10 border-amber-500/20',
        },
        {
            key: 'practitionerLed',
            ...t.whoWeAre.pillars.practitionerLed,
            href: '/meet',
            gradient: 'from-emerald-500 to-teal-500',
            iconBg: 'bg-emerald-500/10 border-emerald-500/20',
        },
    ]

    return (
        <section className="py-20 px-4 md:px-6 bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-14">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                        {t.whoWeAre.badge}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        {t.whoWeAre.title}
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        {t.whoWeAre.subtitle}
                    </p>
                </div>

                {/* Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pillars.map((pillar) => {
                        const isLearn = pillar.key === 'learn'
                        // Define specific border/bg colors based on pillar type for clearer distinction
                        const activeBorderClass = isLearn
                            ? 'hover:border-blue-400 dark:hover:border-blue-500'
                            : pillar.key === 'careerOS'
                                ? 'hover:border-amber-400 dark:hover:border-amber-500'
                                : 'hover:border-emerald-400 dark:hover:border-emerald-500'

                        return (
                            <Link
                                key={pillar.key}
                                href={pillar.href}
                                className={`group relative flex flex-col items-center text-center
                                ${isLearn
                                        ? 'bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-slate-800 dark:to-slate-800/50 border-blue-200 dark:border-blue-900/50'
                                        : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}
                                rounded-2xl p-6 border shadow-sm
                                transition-all duration-300 hover:shadow-xl ${activeBorderClass}
                                hover:-translate-y-1 hover:scale-[1.01] ${isLearn ? 'md:col-span-2' : ''}`}
                            >
                                {/* Gradient hover effect - stronger for Learn */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${pillar.gradient} opacity-0 group-hover:opacity-[0.07] rounded-2xl transition-opacity duration-300`}></div>

                                {/* Watermark for Learn (Subtle Background Icon) */}
                                {isLearn && (
                                    <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none overflow-hidden rounded-br-2xl">
                                        <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
                                        </svg>
                                    </div>
                                )}

                                <div className={`relative space-y-4 w-full z-10 ${isLearn ? 'max-w-2xl mx-auto' : ''}`}>
                                    {/* Title with dynamic color on hover */}
                                    <h3 className={`text-xl font-bold text-slate-900 dark:text-white transition-colors
                                        ${isLearn ? 'group-hover:text-blue-600 dark:group-hover:text-blue-400' : ''}
                                        ${pillar.key === 'careerOS' ? 'group-hover:text-amber-600 dark:group-hover:text-amber-400' : ''}
                                        ${pillar.key === 'practitionerLed' ? 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400' : ''}
                                    `}>
                                        {pillar.title}
                                    </h3>

                                    {/* Description with Markdown parsing */}
                                    <p className={`text-slate-600 dark:text-slate-400 leading-relaxed text-sm ${isLearn ? 'md:text-base' : ''}`}>
                                        {pillar.description.split(/(\*\*.*?\*\*|\*.*?\*)/).map((part, i) => {
                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                // Make bold text slightly colored in Learn card for emphasis
                                                return <strong key={i} className={`font-bold ${isLearn ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-slate-200'}`}>{part.slice(2, -2)}</strong>
                                            }
                                            if (part.startsWith('*') && part.endsWith('*')) {
                                                return <em key={i} className="italic text-slate-800 dark:text-slate-300">{part.slice(1, -1)}</em>
                                            }
                                            return part
                                        })}
                                    </p>
                                </div>

                                {/* Visual CTA Cue (Arrow) */}
                                <div className="pt-2 flex justify-center z-10">
                                    <span className={`inline-flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${pillar.gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all whitespace-nowrap`}>
                                        {pillar.cta}
                                        <svg className={`w-4 h-4 text-slate-400 transition-all ${isLearn ? 'w-5 h-5' : ''}
                                            ${pillar.key === 'learn' ? 'group-hover:text-blue-500' : ''}
                                            ${pillar.key === 'careerOS' ? 'group-hover:text-amber-500' : ''}
                                            ${pillar.key === 'practitionerLed' ? 'group-hover:text-emerald-500' : ''}
                                            group-hover:translate-x-1`}
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </span>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
