/**
 * AziendeAfterPilot - "Dopo il Pilot" section
 * Shows 3 options: license, rollout, handover
 * Updated with PMI-friendly naming and clearer value prop
 */
export function AziendeAfterPilot() {
    const options = [
        {
            letter: 'A',
            title: 'Licenza mensile',
            subtitle: 'Qualità & aggiornamenti',
            description: 'Monitor metriche + adattamento a nuovi template + miglioramenti + report mensile (scorecard).',
            micro: 'Ideale se vuoi evitare che il sistema si degradi quando cambiano documenti e fornitori.',
            color: 'amber',
        },
        {
            letter: 'B',
            title: 'Rollout',
            subtitle: 'Stesso framework, nuovo flusso',
            description: 'Nuovo tipo documento, nuova commessa, nuova inbox.',
            micro: '',
            color: 'blue',
        },
        {
            letter: 'C',
            title: 'Handover',
            subtitle: 'Consegna al tuo IT',
            description: 'Pipeline, mapping export, training. Supporto a tempo.',
            micro: '',
            color: 'slate',
        },
    ]

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'amber':
                return {
                    border: 'border-amber-200 dark:border-amber-800/50',
                    bg: 'bg-amber-50/50 dark:bg-amber-950/20',
                    letter: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
                }
            case 'blue':
                return {
                    border: 'border-blue-200 dark:border-blue-800/50',
                    bg: 'bg-blue-50/50 dark:bg-blue-950/20',
                    letter: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
                }
            default:
                return {
                    border: 'border-slate-200 dark:border-slate-700',
                    bg: 'bg-slate-50/50 dark:bg-slate-800/20',
                    letter: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
                }
        }
    }

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                    Dopo il Pilot
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Se funziona, scegli tu come proseguire:
                </p>
            </div>

            {/* 3 options */}
            <div className="grid gap-4 sm:grid-cols-3">
                {options.map((opt) => {
                    const classes = getColorClasses(opt.color)
                    return (
                        <div
                            key={opt.letter}
                            className={`rounded-2xl border ${classes.border} ${classes.bg} p-5`}
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${classes.letter}`}>
                                    {opt.letter}
                                </span>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                                        {opt.title}
                                    </h3>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                        {opt.subtitle}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                {opt.description}
                            </p>
                            {opt.micro && (
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 italic">
                                    {opt.micro}
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
