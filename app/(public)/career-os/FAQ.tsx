'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
    {
        q: "Garantite il lavoro?",
        a: "No. Nessun educatore etico promette lavoro garantito. Ti promettiamo deliverable concreti (CV, proof, prep) che aumentano statisticamente le tue chances."
    },
    {
        q: "E se non sono soddisfatto?",
        a: "Feedback garantito + iterazioni entro i limiti concordati. Il nostro obiettivo è che tu sia pronto, non che tu sia \"contento ma impreparato\"."
    },
    {
        q: "Quanto tempo devo dedicare?",
        a: "5-8 ore/settimana tra sessioni e homework. È un impegno serio, ma realistico se stai cercando lavoro attivamente."
    },
    {
        q: "Qual è la differenza con un bootcamp?",
        a: "I bootcamp vendono ore di video. Noi vendiamo outcome: proof pubblica, candidabilità, interview readiness. Non ore, risultati."
    }
]

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section className="py-24 px-6 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#1A1E3B] dark:text-white">
                Domande Frequenti
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
                {faqs.map((item, i) => (
                    <div
                        key={i}
                        className="rounded-2xl bg-slate-50 dark:bg-[#151925] border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors hover:border-slate-300 dark:hover:border-slate-700"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex items-center justify-between p-6 text-left"
                        >
                            <span className="font-bold text-[#1A1E3B] dark:text-white text-lg pr-4">
                                {item.q}
                            </span>
                            <span className={`shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}>
                                <ChevronDown className="w-5 h-5 text-slate-400" />
                            </span>
                        </button>

                        <AnimatePresence>
                            {openIndex === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-4">
                                        {item.a}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    )
}
