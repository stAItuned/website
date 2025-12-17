/**
 * HomeProof - Results/proof section
 * Static business-focused content showing concrete results.
 */
export function HomeProof() {
    const proofPoints = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Riduzione tempi',
            description: 'Processi documentali automatizzati, meno ore manuali.',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: 'Accuratezza validata',
            description: 'Eval + human-in-the-loop per risultati affidabili.',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
            title: 'ROI misurabile',
            description: 'Metriche chiare da giorno 1, non promesse vaghe.',
        },
    ]

    return (
        <section className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
            <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-8 sm:p-12 shadow-lg dark:border-slate-800 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-950">
                {/* Background decoration */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-amber-100/50 to-transparent rounded-full blur-3xl dark:from-amber-900/20" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full blur-3xl dark:from-blue-900/20" />

                <div className="relative">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide mb-4 dark:bg-emerald-900/50 dark:text-emerald-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Risultati concreti
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">
                            Risultati che contano{' '}
                            <span className="text-slate-500 dark:text-slate-400">(tempo, errori, costi).</span>
                        </h2>
                    </div>

                    {/* Proof points */}
                    <div className="grid gap-6 sm:grid-cols-3">
                        {proofPoints.map((point) => (
                            <div
                                key={point.title}
                                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/70 border border-slate-100 shadow-sm dark:bg-slate-800/50 dark:border-slate-700"
                            >
                                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4 dark:bg-amber-900/50 dark:text-amber-400">
                                    {point.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">
                                    {point.title}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {point.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Trust note */}
                    <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Lavoriamo su dati reali con metriche definite prima di iniziare.
                        Se il pilot dimostra che non c&apos;è impatto, lo diciamo chiaramente.
                    </p>
                </div>
            </div>
        </section>
    )
}


