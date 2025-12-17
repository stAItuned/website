'use client'

/**
 * AziendeUseCases - 3 concrete use cases above the fold
 * Shows specific examples: PDF extraction, document classification, RAG Q&A
 */
export function AziendeUseCases() {
    const useCases = [
        {
            icon: '📄',
            title: 'Estrazione dati da PDF',
            description: 'PDF → Excel + controlli automatici.',
            example: 'Fatture, bolle, ordini → tabella strutturata.',
        },
        {
            icon: '🏷️',
            title: 'Classificazione documenti',
            description: 'Smista per tipo, cliente, commessa.',
            example: 'Email, allegati, PEC → routing automatico.',
        },
        {
            icon: '💬',
            title: 'Assistente Q&A (RAG)',
            description: 'Domande → risposte da documenti interni.',
            example: 'Manuali, procedure, contratti → risposte tracciabili.',
        },
    ]

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-3 dark:bg-blue-900/50 dark:text-blue-200">
                    Casi d&apos;uso tipici
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50">
                    Cosa costruiamo in un Pilot
                </h2>
            </div>

            {/* 3 use cases */}
            <div className="grid gap-4 sm:grid-cols-3">
                {useCases.map((uc) => (
                    <div
                        key={uc.title}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all dark:border-slate-800 dark:bg-slate-900/60"
                    >
                        <span className="text-3xl mb-3 block">{uc.icon}</span>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-1">
                            {uc.title}
                        </h3>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            {uc.description}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                            Es: {uc.example}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
