/**
 * AziendeNotForYou - "Chi non è un buon fit" section
 * Increases credibility by being honest about who shouldn't work with us
 */
export function AziendeNotForYou() {
    const notForYou = [
        'Cerchi "AI ovunque" senza un processo chiaro da migliorare',
        'Non hai dati disponibili (neanche documenti, email, o file sparsi)',
        'Vuoi un progetto infinito, non un pilot con metriche',
    ]

    return (
        <section className="rounded-2xl border-2 border-rose-200 bg-rose-50/50 p-6 dark:border-rose-800/50 dark:bg-rose-950/20">
            <div className="flex items-start gap-4">
                <span className="text-2xl">🚫</span>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">
                        Non è per te se...
                    </h3>
                    <ul className="space-y-2">
                        {notForYou.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <span className="text-rose-500 mt-0.5">✕</span>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                        Se non c&apos;è un buon fit, te lo diciamo subito nella mini-call.
                    </p>
                </div>
            </div>
        </section>
    )
}
