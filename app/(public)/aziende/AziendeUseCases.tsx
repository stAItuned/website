/**
 * AziendeUseCases - "Cosa costruiamo" section
 * Shows DocuRoute, DocuExtract, and End-to-end options
 */
export function AziendeUseCases() {
    const useCases = [
        {
            icon: '📬',
            badge: 'DocuRoute',
            badgeColor: 'blue',
            title: 'Triage & Routing',
            description: 'Smistamento automatico di Email/PEC e allegati: archiviazione, naming standard, task al team giusto.',
            metrics: 'auto-route %, tempo di presa in carico, review rate, mis-archiving.',
        },
        {
            icon: '📄',
            badge: 'DocuExtract',
            badgeColor: 'amber',
            title: 'Extraction & Export',
            description: 'Estrazione campi chiave (fatture/DDT/contratti ecc.), validazioni e export pronto.',
            metrics: 'accuracy per campi, tempo/doc, % review, export rate.',
        },
        {
            icon: '🔗',
            badge: 'End-to-end',
            badgeColor: 'emerald',
            title: 'Route → Extract',
            description: 'Dalla casella email al file esportato: routing + estrazione su documenti approvati, tutto tracciato.',
            metrics: 'tempo totale "inbox → export", errori evitati, intervento umano.',
        },
    ]

    const getBadgeClasses = (color: string) => {
        switch (color) {
            case 'blue':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
            case 'amber':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
            case 'emerald':
            default:
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
        }
    }

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wide mb-3 dark:bg-slate-800 dark:text-slate-300">
                    🛠️ Cosa costruiamo
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                    Un flusso alla volta, con metriche
                </h2>
            </div>

            {/* 3 cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                {useCases.map((uc) => (
                    <div
                        key={uc.title}
                        className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900/60"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">{uc.icon}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${getBadgeClasses(uc.badgeColor)}`}>
                                {uc.badge}
                            </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 mb-2">
                            {uc.title}
                        </h3>
                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                            {uc.description}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            <strong>Misuriamo:</strong> {uc.metrics}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
