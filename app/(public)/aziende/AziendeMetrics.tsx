/**
 * AziendeMetrics - "Come misuriamo" section
 * Shows 3 standard KPIs with clear definitions + example savings
 */
export function AziendeMetrics() {
    const metrics = [
        {
            icon: '🎯',
            name: 'Accuracy campi chiave',
            description: '% correttezza sui campi critici (es. totale, IVA, data, fornitore, n° documento).',
        },
        {
            icon: '⏱️',
            name: 'Tempo risparmiato',
            description: 'min/doc vs processo manuale. Misuriamo la differenza reale.',
        },
        {
            icon: '👤',
            name: 'Tasso intervento umano',
            description: 'Quanti casi richiedono review e perché → guida miglioramenti.',
        },
    ]

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                    Come misuriamo (in pratica)
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto">
                    Prima di iniziare definiamo baseline, target e criteri di accettazione su 3 metriche:
                </p>
            </div>

            {/* 3 metrics */}
            <div className="grid gap-4 sm:grid-cols-3">
                {metrics.map((m) => (
                    <div
                        key={m.name}
                        className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900/60"
                    >
                        <span className="text-2xl mb-2 block">{m.icon}</span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 mb-1">
                            {m.name}
                        </h3>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            {m.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Output finale + Set verificato */}
            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-5 dark:border-amber-700/50 dark:bg-amber-950/20 space-y-3">
                <p className="text-sm text-slate-700 dark:text-slate-300 text-center">
                    <strong className="text-slate-900 dark:text-slate-100">Output finale:</strong>{' '}
                    una <strong>Pilot Scorecard</strong> (1 pagina) con baseline → target → risultato + cosa fare dopo.
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                    <strong>Set verificato:</strong> campione concordato (es. 100–300 documenti) + rubric chiara.
                </p>
            </div>

            {/* Example savings */}
            <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                    <strong>Esempio:</strong> da 12 min/doc a 3 min/doc su 1.200 doc/mese → ~180 ore risparmiate/mese{' '}
                    <span className="text-slate-500">(da verificare sul tuo caso)</span>.
                </p>
            </div>
        </section>
    )
}
