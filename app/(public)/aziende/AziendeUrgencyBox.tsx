'use client'

import { CallModalTrigger } from './CallModalTrigger'

/**
 * AziendeUrgencyBox - Scarcity box with dynamic date and "candidatura" CTA
 * Reason-based urgency: why limited + next availability
 */
export function AziendeUrgencyBox() {
    // Dynamic next month
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    const nextMonthName = nextMonth.toLocaleString('it-IT', { month: 'long', year: 'numeric' })
    const capitalizedMonth = nextMonthName.charAt(0).toUpperCase() + nextMonthName.slice(1)

    return (
        <section className="rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-amber-100/50 to-amber-50 p-6 sm:p-8 shadow-lg dark:border-amber-700/50 dark:from-amber-950/30 dark:via-amber-900/20 dark:to-amber-950/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Left: Scarcity message */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                            Disponibilità limitata
                        </span>
                    </div>

                    <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 leading-relaxed">
                        Apriamo <strong className="text-slate-900 dark:text-white">2 slot Pilot/mese</strong> per garantire qualità{' '}
                        <span className="text-slate-600 dark:text-slate-400">(review + iterazioni)</span>.
                    </p>

                    <p className="text-lg font-semibold text-amber-700 dark:text-amber-300">
                        📅 Prossimo avvio disponibile: <span className="underline underline-offset-2">{capitalizedMonth}</span>
                    </p>
                </div>

                {/* Right: CTA */}
                <div className="flex-shrink-0 text-center sm:text-right">
                    <CallModalTrigger className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white font-bold text-base shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all dark:from-white dark:via-slate-100 dark:to-white dark:text-slate-900">
                        <span>Assicurati uno slot Pilot</span>
                        <span>→</span>
                    </CallModalTrigger>
                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                        Ti diciamo in 48 ore se c&apos;è fit.
                    </p>
                </div>
            </div>
        </section>
    )
}
