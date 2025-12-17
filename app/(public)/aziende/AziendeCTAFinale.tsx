'use client'

import { CallModalTrigger } from './CallModalTrigger'

/**
 * AziendeCTAFinale - Final CTA section
 * Repeats urgency and availability at bottom of page
 */
export function AziendeCTAFinale() {
    // Dynamic next month
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    const nextMonthName = nextMonth.toLocaleString('it-IT', { month: 'long', year: 'numeric' })
    const capitalizedMonth = nextMonthName.charAt(0).toUpperCase() + nextMonthName.slice(1)

    return (
        <section className="rounded-2xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 via-amber-100/50 to-amber-50 p-8 sm:p-10 text-center dark:border-amber-700/50 dark:from-amber-950/30 dark:via-amber-900/20 dark:to-amber-950/30">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">
                Vuoi capire se c&apos;è un caso d&apos;uso forte nella tua PMI?
            </h2>

            <CallModalTrigger className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white font-bold text-lg shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all dark:from-white dark:via-slate-100 dark:to-white dark:text-slate-900">
                <span>Candidati per uno slot Pilot (15 min)</span>
                <span>→</span>
            </CallModalTrigger>

            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                Risposta entro 48 ore. <strong className="text-slate-900 dark:text-slate-100">2 slot/mese</strong> per garantire qualità.
            </p>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                Prossimo avvio: {capitalizedMonth}
            </p>
        </section>
    )
}
