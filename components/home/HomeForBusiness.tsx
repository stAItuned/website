'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ContactCtaWithModal } from '@/app/(public)/aziende/ContactCtaWithModal'

/**
 * HomeForBusiness - Business section (positioned lower, not aggressive)
 * Shows 3 use cases and CTA
 */
export function HomeForBusiness() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const useCases = [
        {
            icon: '📬',
            title: 'Smistamento documenti',
            description: 'Email, PEC, allegati → cartelle/task giusto',
        },
        {
            icon: '📄',
            title: 'Estrazione dati',
            description: 'Fatture, DDT, contratti → export CSV/Excel',
        },
        {
            icon: '🔗',
            title: 'Workflow end-to-end',
            description: 'Inbox → estrazione → gestionale, tutto tracciato',
        },
    ]

    return (
        <>
            <section className="max-w-5xl mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50">
                        Se vuoi applicarla in azienda
                    </h2>
                    <p className="text-base text-slate-600 dark:text-slate-400 mt-2">
                        Pilot rapidi su documenti e workflow, con metriche verificabili.
                    </p>
                </div>

                {/* 3 use cases */}
                <div className="grid gap-4 sm:grid-cols-3 mb-8">
                    {useCases.map((uc) => (
                        <div
                            key={uc.title}
                            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900/60"
                        >
                            <span className="text-2xl block mb-2">{uc.icon}</span>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-1">
                                {uc.title}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                                {uc.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA + Badge */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white font-semibold shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all dark:from-white dark:via-slate-100 dark:to-white dark:text-slate-900"
                    >
                        Prenota 15 min →
                    </button>
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        2 pilot/mese
                    </span>
                </div>
            </section>

            {/* Modal */}
            <ContactCtaWithModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        </>
    )
}
