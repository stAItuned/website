/**
 * AziendeProofPack - "3 prove concrete" section
 * Simplified: just the 3 proof items, no CTA (using sticky footer)
 */
export function AziendeProofPack() {
    const proofItems = [
        {
            icon: '📊',
            title: 'Pilot Dashboard',
            description: 'Volume, accuracy, tempo/doc, % review. Se non migliora, lo vediamo.',
        },
        {
            icon: '🔍',
            title: 'Audit & Human-in-the-loop',
            description: 'Campi estratti, correzioni, conferma → export. Tutto tracciato.',
        },
        {
            icon: '📋',
            title: 'Master Ledger + Export',
            description: 'Storico, stato, export CSV/Excel pronto per il gestionale.',
        },
    ]

    return (
        <section className="space-y-4">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                    3 prove concrete
                </h2>
            </div>

            {/* 3 proof items */}
            <div className="grid gap-3 sm:grid-cols-3">
                {proofItems.map((item) => (
                    <div
                        key={item.title}
                        className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/60"
                    >
                        <span className="text-xl mb-2 block">{item.icon}</span>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-1">
                            {item.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
