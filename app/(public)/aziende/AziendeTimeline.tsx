/**
 * AziendeTimeline - Visual timeline component
 * Shows Assessment → Pilot flow visually
 */
export function AziendeTimeline() {
    return (
        <section className="space-y-4">
            <div className="text-center">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                    Come funziona
                </h2>
            </div>

            {/* Timeline */}
            <div className="relative max-w-2xl mx-auto">
                {/* Line */}
                <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-amber-200 via-amber-400 to-emerald-400 rounded-full dark:from-amber-800 dark:via-amber-600 dark:to-emerald-600" />

                {/* Steps */}
                <div className="relative flex justify-between">
                    {/* Start */}
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center text-xl dark:bg-slate-800 dark:border-slate-700">
                            📋
                        </div>
                        <p className="mt-2 text-xs font-bold text-slate-900 dark:text-slate-100">Giorno 0</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Kick-off</p>
                    </div>

                    {/* Assessment */}
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-amber-100 border-4 border-white shadow-md flex items-center justify-center text-xl dark:bg-amber-900/50 dark:border-slate-700">
                            🔍
                        </div>
                        <p className="mt-2 text-xs font-bold text-amber-700 dark:text-amber-300">Giorno 10</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Assessment</p>
                    </div>

                    {/* Pilot */}
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 border-4 border-white shadow-md flex items-center justify-center text-xl dark:bg-emerald-900/50 dark:border-slate-700">
                            ✅
                        </div>
                        <p className="mt-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">Settimana 6</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Pilot + scorecard</p>
                    </div>
                </div>
            </div>

            {/* Clarification */}
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                <strong className="text-slate-900 dark:text-white">Assessment parte subito.</strong>{' '}
                Pilot nel prossimo slot disponibile.
            </p>
        </section>
    )
}
