/**
 * AziendePricing - Packages with clear scope (no prices)
 * Clear scope = reduces friction and filtering
 */
export function AziendePricing() {
    const packages = [
        {
            name: 'Assessment',
            duration: '10 giorni',
            output: 'Use case + ROI stimato + piano pilot + rischi/guardrail',
            color: 'amber',
        },
        {
            name: 'Pilot',
            duration: '4 settimane',
            output: 'Pipeline + dashboard + export + metriche + handover',
            color: 'blue',
        },
    ]

    const getColorClasses = (color: string) => {
        if (color === 'amber') {
            return {
                border: 'border-amber-200 dark:border-amber-800/50',
                bg: 'bg-amber-50/50 dark:bg-amber-950/20',
                badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200',
            }
        }
        return {
            border: 'border-blue-200 dark:border-blue-800/50',
            bg: 'bg-blue-50/50 dark:bg-blue-950/20',
            badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200',
        }
    }

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wide mb-3 dark:bg-slate-800 dark:text-slate-300">
                    📦 Pacchetti
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                    Scope chiaro, niente progetti infiniti
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Sai cosa ricevi e quanto dura.
                </p>
            </div>

            {/* 2 packages */}
            <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
                {packages.map((pkg) => {
                    const classes = getColorClasses(pkg.color)
                    return (
                        <div
                            key={pkg.name}
                            className={`rounded-2xl border-2 ${classes.border} ${classes.bg} p-6`}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                                    {pkg.name}
                                </h3>
                                <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${classes.badge}`}>
                                    {pkg.duration}
                                </span>
                            </div>

                            {/* Output */}
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                <strong>Output:</strong> {pkg.output}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* Risk reversal */}
            <div className="text-center max-w-2xl mx-auto">
                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    Se dopo l&apos;Assessment non c&apos;è un caso d&apos;uso forte,{' '}
                    <strong className="text-slate-900 dark:text-slate-100">chiudiamo lì e ti rimane la roadmap</strong>.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Niente progetti infiniti. Decidi tu se andare avanti.
                </p>
            </div>
        </section>
    )
}
