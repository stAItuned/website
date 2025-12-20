'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLearnLocale } from '@/lib/i18n'
import { ContributorCTA } from '@/components/ui/ContributorCTA'

interface LearnPathCardsProps {
    className?: string
}

/**
 * Two main path cards: Write and Build
 * 
 * These are the primary conversion points for the Learn page.
 */
export function LearnPathCards({ className = '' }: LearnPathCardsProps) {
    const { t } = useLearnLocale()
    const [showWriteForm, setShowWriteForm] = useState(false)

    return (
        <section className={`${className}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card A: Write */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative h-full flex flex-col rounded-2xl border-2 border-primary-200 dark:border-primary-700/50 bg-gradient-to-br from-white via-primary-50/30 to-white dark:from-slate-900 dark:via-primary-900/10 dark:to-slate-900 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
                        {/* Badge */}
                        <span className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-4">
                            {t.pathCards.write.badge}
                        </span>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                            {t.pathCards.write.title}
                        </h3>

                        {/* Description */}
                        <p className="text-slate-600 dark:text-slate-300 mb-5 flex-grow">
                            {t.pathCards.write.description}
                        </p>

                        {/* Features */}
                        <ul className="space-y-2.5 mb-6">
                            {t.pathCards.write.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                                    <svg className="w-4 h-4 text-primary-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <button
                            onClick={() => setShowWriteForm(!showWriteForm)}
                            className="group/btn inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-500 shadow-md hover:shadow-lg transition-all"
                        >
                            {t.pathCards.write.cta}
                            <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Card B: Build */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative h-full flex flex-col rounded-2xl border-2 border-indigo-200 dark:border-indigo-700/50 bg-gradient-to-br from-white via-indigo-50/30 to-white dark:from-slate-900 dark:via-indigo-900/10 dark:to-slate-900 p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
                        {/* Badge */}
                        <span className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-semibold mb-4">
                            {t.pathCards.build.badge}
                        </span>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                            {t.pathCards.build.title}
                        </h3>

                        {/* Description */}
                        <p className="text-slate-600 dark:text-slate-300 mb-5 flex-grow">
                            {t.pathCards.build.description}
                        </p>

                        {/* Features */}
                        <ul className="space-y-2.5 mb-6">
                            {t.pathCards.build.features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                                    <svg className="w-4 h-4 text-indigo-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        {/* CTA */}
                        <Link
                            href="/lab"
                            className="group/btn inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 shadow-md hover:shadow-lg transition-all"
                        >
                            {t.pathCards.build.cta}
                            <svg className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Expandable Contributor Form */}
            {showWriteForm && (
                <div className="mt-6 animate-in slide-in-from-top-4 duration-300 max-w-xl mx-auto">
                    <ContributorCTA source="learn-path-cards" />
                </div>
            )}
        </section>
    )
}
