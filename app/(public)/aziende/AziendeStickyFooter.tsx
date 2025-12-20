'use client'

import { CallModalTrigger } from './CallModalTrigger'

/**
 * AziendeStickyFooter - Sticky CTA footer
 * Single CTA that stays visible, with clear messaging
 */
export function AziendeStickyFooter() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-slate-200 py-3 px-4 dark:bg-slate-900/95 dark:border-slate-700">
            <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                <div className="hidden sm:block text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-semibold text-slate-900 dark:text-white">Assessment parte subito</span>. Se c&apos;è fit, blocchi il prossimo slot Pilot.
                </div>
                <CallModalTrigger className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white font-semibold text-sm shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all dark:from-white dark:via-slate-100 dark:to-white dark:text-slate-900">
                    Prenota 15 min →
                </CallModalTrigger>
                <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
                    Fit + timeline reale in 48h
                </p>
            </div>
        </div>
    )
}
