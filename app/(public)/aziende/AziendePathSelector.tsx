'use client'

import { useState } from 'react'

/**
 * AziendePathSelector - "Scegli il percorso" toggle
 * Helps user self-qualify: Route+Extract vs Extract only
 */
export function AziendePathSelector() {
    const [selectedPath, setSelectedPath] = useState<'route' | 'extract' | null>(null)

    const paths = [
        {
            id: 'route' as const,
            icon: '📬',
            title: 'Ho caos in Email/PEC',
            subtitle: 'Route → Extract',
            description: 'Smistiamo prima, poi estraiamo.',
            color: 'blue',
        },
        {
            id: 'extract' as const,
            icon: '📁',
            title: 'Ho già cartelle/drive',
            subtitle: 'Extract only',
            description: 'Andiamo dritti all\'estrazione.',
            color: 'amber',
        },
    ]

    return (
        <section className="space-y-4">
            <div className="text-center">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Qual è la tua situazione?
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 max-w-xl mx-auto">
                {paths.map((path) => {
                    const isSelected = selectedPath === path.id
                    const borderColor = path.color === 'blue'
                        ? isSelected ? 'border-blue-500 dark:border-blue-400' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                        : isSelected ? 'border-amber-500 dark:border-amber-400' : 'border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600'
                    const bgColor = isSelected
                        ? path.color === 'blue' ? 'bg-blue-50 dark:bg-blue-950/30' : 'bg-amber-50 dark:bg-amber-950/30'
                        : 'bg-white dark:bg-slate-900/60'

                    return (
                        <button
                            key={path.id}
                            type="button"
                            onClick={() => setSelectedPath(path.id)}
                            className={`relative rounded-xl border-2 ${borderColor} ${bgColor} p-4 text-left transition-all`}
                        >
                            {isSelected && (
                                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                                    ✓
                                </span>
                            )}
                            <span className="text-2xl block mb-2">{path.icon}</span>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                                {path.title}
                            </h3>
                            <p className={`text-xs font-semibold mt-1 ${path.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-amber-600 dark:text-amber-400'
                                }`}>
                                {path.subtitle}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {path.description}
                            </p>
                        </button>
                    )
                })}
            </div>

            {selectedPath && (
                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    {selectedPath === 'route'
                        ? '👉 Ti proponiamo un pilot Route + Extract (inbox → export).'
                        : '👉 Ti proponiamo un pilot Extract (cartelle → export).'}
                </p>
            )}
        </section>
    )
}
