/**
 * AziendeProofPack - "Cosa ricevi a fine Pilot" section
 * Shows verifiable proof: scorecard, dashboard, audit log
 */
export function AziendeProofPack() {
    const proofItems = [
        {
            icon: '📋',
            title: 'Pilot Scorecard',
            description: '1 pagina: baseline → target → risultato. Impatto misurabile.',
        },
        {
            icon: '📊',
            title: 'Dashboard + Export',
            description: 'Visualizzazione dati e export per il tuo team.',
        },
        {
            icon: '📝',
            title: 'Audit Log',
            description: 'Traccia decisioni e output. Verificabile.',
        },
    ]

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide mb-3 dark:bg-emerald-900/50 dark:text-emerald-200">
                    ✓ Proof verificabile
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                    Cosa ricevi a fine Pilot{' '}
                    <span className="text-slate-500 dark:text-slate-400">(e come lo verifichi)</span>
                </h2>
            </div>

            {/* 3 proof items */}
            <div className="grid gap-4 sm:grid-cols-3">
                {proofItems.map((item) => (
                    <div
                        key={item.title}
                        className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 dark:border-emerald-800/50 dark:bg-emerald-950/20"
                    >
                        <span className="text-2xl mb-2 block">{item.icon}</span>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 mb-1">
                            {item.title}
                        </h3>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Trust copy */}
            <div className="text-center max-w-2xl mx-auto">
                <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    Non giudichi il pilot &quot;a sensazione&quot;. Ti lasciamo una{' '}
                    <strong className="text-slate-900 dark:text-slate-100">Pilot Scorecard</strong> con baseline, target e risultati.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Se non c&apos;è impatto, lo vediamo dai numeri — e ci fermiamo.
                </p>
            </div>
        </section>
    )
}
