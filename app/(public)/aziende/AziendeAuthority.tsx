'use client'

import Link from 'next/link'

/**
 * AziendeAuthority - "Chi ti affianca" section
 * Team credibility with clear value proposition
 */
export function AziendeAuthority() {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
                {/* Text */}
                <div className="flex-1">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-3 dark:bg-blue-900/50 dark:text-blue-200">
                        👤 Chi ti affianca
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">
                        Un team che unisce AI/GenAI + workflow + dati.
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        Costruiamo pilot usabili (UI + export + audit), e li misuriamo con scorecard.
                        <br />
                        Approccio <strong className="text-slate-900 dark:text-slate-100">guidato da metriche</strong>: misuriamo qualità e impatto, poi decidiamo se scalare.
                    </p>
                </div>
            </div>
        </section>
    )
}
