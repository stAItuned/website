'use client'

import Link from 'next/link'

/**
 * HomeRoleSelector - Role-based path selection
 * Redirects to /aziende or /learn based on user choice.
 * Cleaner for SEO, sharing, and analytics.
 */
export function HomeRoleSelector() {
    return (
        <section className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
            {/* Section header */}
            <div className="text-center mb-10 sm:mb-12">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300 mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Scegli il tuo percorso
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">
                    Cosa stai cercando?
                </h2>
            </div>

            {/* Two cards grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Card 1 - Aziende */}
                <Link
                    href="/aziende"
                    className="group relative overflow-hidden rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-50/50 p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-amber-400 dark:border-amber-800/50 dark:from-slate-900 dark:via-slate-900/80 dark:to-amber-950/30 text-left cursor-pointer block"
                >
                    {/* Decorative gradient */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity" />

                    <div className="relative space-y-6">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wide dark:bg-amber-900/50 dark:text-amber-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            PMI & Aziende
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                            Sono un&apos;azienda
                        </h3>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            Voglio ridurre tempi, errori e costi su documenti e processi con un <strong className="text-slate-900 dark:text-white">Pilot rapido</strong>.
                        </p>

                        {/* Bullets */}
                        <ul className="space-y-3">
                            {[
                                { icon: '📊', text: 'Assessment 10 giorni → use case ad alto ROI' },
                                { icon: '🚀', text: 'Pilot 4 settimane → end-to-end su dati reali' },
                                { icon: '📈', text: 'Output: dashboard + export + metriche' },
                            ].map((item) => (
                                <li key={item.text} className="flex items-start gap-3 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                                    <span className="text-lg mt-0.5">{item.icon}</span>
                                    <span className="leading-relaxed">{item.text}</span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA Arrow */}
                        <div className="flex items-center justify-end pt-2">
                            <span className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-300 font-semibold group-hover:translate-x-2 transition-transform">
                                Scopri i Pilot
                                <span className="text-xl">→</span>
                            </span>
                        </div>
                    </div>
                </Link>

                {/* Card 2 - Learn */}
                <Link
                    href="/learn"
                    className="group relative overflow-hidden rounded-3xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-50/50 p-8 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-400 dark:border-blue-800/50 dark:from-slate-900 dark:via-slate-900/80 dark:to-blue-950/30 text-left cursor-pointer block"
                >
                    {/* Decorative gradient */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity" />

                    <div className="relative space-y-6">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wide dark:bg-blue-900/50 dark:text-blue-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Blog & Lab
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                            Voglio aggiornarmi sull'AI
                        </h3>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                            Articoli pratici + lab su progetti reali: <strong className="text-slate-900 dark:text-white">dal caso d&apos;uso alla webapp</strong>.
                        </p>

                        {/* Bullets */}
                        <ul className="space-y-3">
                            {[
                                { icon: '🎯', text: 'Percorsi: Newbie → Mid → Expert' },
                                { icon: '👥', text: 'Progetti con review e mentorship' },
                                { icon: '💼', text: 'Opportunità di collaborazione' },
                            ].map((item) => (
                                <li key={item.text} className="flex items-start gap-3 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                                    <span className="text-lg mt-0.5">{item.icon}</span>
                                    <span className="leading-relaxed">{item.text}</span>
                                </li>
                            ))}
                        </ul>

                        {/* CTA Arrow */}
                        <div className="flex items-center justify-end pt-2">
                            <span className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold group-hover:translate-x-2 transition-transform">
                                Esplora gli articoli
                                <span className="text-xl">→</span>
                            </span>
                        </div>
                    </div>
                </Link>
            </div>
        </section>
    )
}
