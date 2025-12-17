/**
 * AziendeMetrics - "Come misuriamo" section
 * Shows 3 standard metrics: accuracy, time saved, human review rate
 */
export function AziendeMetrics() {
    const metrics = [
        {
            icon: '🎯',
            name: 'Accuracy per campi chiave',
            description: 'Quanti dati estratti sono corretti vs. totale.',
            example: 'Es: 95% accuracy su importi fatture',
        },
        {
            icon: '⏱️',
            name: 'Tempo risparmiato',
            description: 'Minuti/ore per pratica o documento.',
            example: 'Es: da 15 min a 2 min per fattura',
        },
        {
            icon: '👤',
            name: 'Tasso di intervento umano',
            description: 'Quando serve review manuale.',
            example: 'Es: review necessaria nel 12% dei casi',
        },
    ]

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                    Come misuriamo il Pilot
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto">
                    Definiamo le metriche prima di iniziare. Se non c&apos;è impatto, lo vediamo dai numeri.
                </p>
            </div>

            {/* 3 metrics */}
            <div className="grid gap-4 sm:grid-cols-3">
                {metrics.map((m) => (
                    <div
                        key={m.name}
                        className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-800/50 dark:bg-emerald-950/20"
                    >
                        <span className="text-2xl mb-2 block">{m.icon}</span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 mb-1">
                            {m.name}
                        </h3>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                            {m.description}
                        </p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                            {m.example}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
