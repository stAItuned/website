'use client'

import { useState } from 'react'

/**
 * AziendeFAQ - Accordion FAQ section
 * Answers common questions to reduce friction
 */
export function AziendeFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    const faqs = [
        {
            question: 'Quanti dati servono per partire?',
            answer: 'Basta un campione iniziale (es. 50–200 documenti) per stimare fattibilità e ROI.',
        },
        {
            question: 'Serve IT interno?',
            answer: 'Non necessariamente. Serve 1 referente operativo + accesso ai dati/sorgenti.',
        },
        {
            question: 'Privacy e sicurezza?',
            answer: 'Minimizzazione dati, logging, controlli. Se necessario valutiamo alternative (cloud/on-prem) in base al contesto.',
        },
        {
            question: 'Cosa succede se il pilot non funziona?',
            answer: 'Lo vediamo dalla scorecard. Documentiamo perché e ti lasciamo opzioni (fermare/migliorare/alternativa use case).',
        },
        {
            question: 'Quanto tempo richiede al mio team?',
            answer: '1–2 ore a settimana + brevi review durante le iterazioni.',
        },
    ]

    return (
        <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 text-center">
                Domande frequenti
            </h2>

            <div className="max-w-2xl mx-auto space-y-2">
                {faqs.map((faq, index) => (
                    <div
                        key={faq.question}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                    >
                        <button
                            type="button"
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                        >
                            <span className="font-medium text-slate-900 dark:text-slate-100">
                                {faq.question}
                            </span>
                            <span className={`text-slate-400 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                                ▼
                            </span>
                        </button>
                        {openIndex === index && (
                            <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/40 text-sm text-slate-700 dark:text-slate-300">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}
