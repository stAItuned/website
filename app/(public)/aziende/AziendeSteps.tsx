'use client'

import { CallModalTrigger } from './CallModalTrigger'

/**
 * AziendeSteps - Process steps section for business page
 * Shows the 3 clear phases: Assessment, Pilot, Scale
 */
export function AziendeSteps() {
    const steps = [
        {
            number: '01',
            title: 'Assessment',
            duration: '10 giorni',
            description: 'Identifichiamo il caso d\'uso migliore e stimiamo ROI, dati, rischi.',
            color: 'amber',
        },
        {
            number: '02',
            title: 'Pilot',
            duration: '4 settimane',
            description: 'Classificazione / estrazione / RAG + dashboard + metriche.',
            color: 'blue',
        },
        {
            number: '03',
            title: 'Scale',
            duration: 'A richiesta',
            description: 'Industrializzazione, integrazioni, governance e miglioramento continuo.',
            color: 'emerald',
        },
    ]

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'amber':
                return {
                    number: 'text-amber-500 dark:text-amber-400',
                    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200',
                }
            case 'blue':
                return {
                    number: 'text-blue-500 dark:text-blue-400',
                    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200',
                }
            case 'emerald':
            default:
                return {
                    number: 'text-emerald-500 dark:text-emerald-400',
                    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200',
                }
        }
    }

    return (
        <section className="space-y-8">
            {/* Section header */}
            <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 leading-tight mb-2">
                    Un percorso semplice, senza sorprese.
                </h2>
                <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                    Tre fasi chiare per passare dall&apos;idea all&apos;impatto misurabile.
                </p>
            </div>

            {/* Steps */}
            <div className="relative">
                {/* Connection line - hidden on mobile */}
                <div className="hidden md:block absolute top-[56px] left-[calc(16.67%-16px)] right-[calc(16.67%-16px)] h-0.5 bg-gradient-to-r from-amber-300 via-blue-300 to-emerald-300 dark:from-amber-700 dark:via-blue-700 dark:to-emerald-700" />

                <div className="grid gap-6 md:grid-cols-3">
                    {steps.map((step, index) => {
                        const classes = getColorClasses(step.color)
                        return (
                            <div key={step.number} className="relative">
                                {/* Number circle */}
                                <div className="flex justify-center mb-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 shadow-lg flex items-center justify-center">
                                            <span className={`text-lg font-bold ${classes.number}`}>
                                                {step.number}
                                            </span>
                                        </div>
                                        {/* Connector dot */}
                                        {index < steps.length - 1 && (
                                            <div className="hidden md:block absolute top-1/2 -right-3 w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 -translate-y-1/2" />
                                        )}
                                    </div>
                                </div>

                                {/* Card */}
                                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 dark:border-slate-800 dark:bg-slate-900/60">
                                    <div className="flex items-center gap-2 mb-3">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                                            {step.title}
                                        </h3>
                                        <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${classes.badge}`}>
                                            {step.duration}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {step.description}
                                    </p>
                                </article>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* CTA */}
            <div className="text-center">
                <CallModalTrigger className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white font-semibold text-sm shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all dark:from-white dark:via-slate-100 dark:to-white dark:text-slate-900">
                    <span>Mini-call 15 min (fit)</span>
                    <span>→</span>
                </CallModalTrigger>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Senza impegno. Se c&apos;è potenziale, facciamo 30 min per lo scope.
                </p>
            </div>
        </section>
    )
}
