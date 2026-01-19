'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronDown,
    CheckCircle2,
    UserX,
    Lightbulb,
    Clock,
    Target
} from 'lucide-react'

import { trackSelectContent } from '@/lib/analytics/trackEvent'

// Data Structure
const FAQ_CATEGORIES = [
    { id: 'fit', label: 'Fit & Requisiti', icon: Target },
    { id: 'method', label: 'Metodo & Garanzie', icon: Lightbulb },
    { id: 'logistics', label: 'Tempi & Costi', icon: Clock },
]

const FAQ_CONTENT = {
    fit: [
        {
            q: "È il percorso adatto a me?",
            a: (
                <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 block">
                                SÌ, SE...
                            </span>
                            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    Hai background tecnico (dev/data)
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    Sei junior/early-career
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    Cerchi ruoli Applied AI (RAG, Agents)
                                </li>
                            </ul>
                        </div>
                        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20">
                            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-2 block">
                                NO, SE...
                            </span>
                            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                <li className="flex items-start gap-2">
                                    <UserX className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                    Parti da zero assoluto col codice
                                </li>
                                <li className="flex items-start gap-2">
                                    <UserX className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                    Cerchi solo teoria/video passivi
                                </li>
                                <li className="flex items-start gap-2">
                                    <UserX className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                    Sei già Senior AI Engineer
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        },
        {
            q: "Che requisiti servono?",
            a: "Serve familiarità con codice (Python/JS non ti spaventa). Non serve sapere di AI/LLM: quello te lo insegniamo noi. Se sai scrivere una funzione e usare Git, sei pronto."
        }
    ],
    method: [
        {
            q: "Perché NON è il solito bootcamp?",
            a: "I bootcamp vendono ore di video registrati. Noi vendiamo outcome professionali. In Career OS non guardi lezioni: costruisci asset (CV, GitHub, Proof) e ricevi feedback da chi assume. È un simulatore di lavoro, non un corso."
        },
        {
            q: "Garantite il lavoro?",
            a: "No. Chi lo promette ti mente. Ti promettiamo però che uscirai con gli asset che servono per essere presi sul serio (Role-fit, Proof tecnica, Interview skill). Ti diamo il 'sistema' che ha funzionato per noi e per chi abbiamo assunto."
        }
    ],
    logistics: [
        {
            q: "Quanto impegno richiede?",
            a: "5-8 ore a settimana. È pensato per chi lavora o studia ancora. Ci sono deadline settimanali per mantenerti in carreggiata, ma il lavoro è asincrono."
        },
        {
            q: "Come funziona il pagamento?",
            a: "Puoi pagare in un'unica soluzione o dividere in 2-3 rate mensili senza interessi. Se non sei soddisfatto nei primi 15 giorni (prima del primo deliverable), ti rimborsiamo."
        }
    ]
}

export default function FAQ() {
    const [activeTab, setActiveTab] = useState('fit')
    const [openIndex, setOpenIndex] = useState<number | null>(0) // Open first by default

    // Helper to switch tab
    const handleTabChange = (categoryId: string) => {
        setActiveTab(categoryId)
        setOpenIndex(null) // Reset accordion on tab switch
    }

    return (
        <section className="py-24 px-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-[#1A1E3B] dark:text-white">
                Domande Frequenti
            </h2>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
                {FAQ_CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleTabChange(cat.id)}
                        className={`
                            flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all
                            ${activeTab === cat.id
                                ? 'bg-[#1A1E3B] text-white shadow-lg scale-105 dark:bg-white dark:text-[#1A1E3B]'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10'
                            }
                        `}
                    >
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-4 min-h-[300px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        {FAQ_CONTENT[activeTab as keyof typeof FAQ_CONTENT].map((item, i) => (
                            <div
                                key={i}
                                className="rounded-2xl bg-white dark:bg-[#151925] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group"
                            >
                                <button
                                    onClick={() => {
                                        const nextState = openIndex === i ? null : i
                                        setOpenIndex(nextState)
                                        if (nextState !== null) {
                                            trackSelectContent('faq', item.q)
                                        }
                                    }}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className={`font-bold text-lg pr-4 transition-colors ${openIndex === i ? 'text-rose-500' : 'text-[#1A1E3B] dark:text-white group-hover:text-rose-500/80'}`}>
                                        {item.q}
                                    </span>
                                    <span
                                        className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 transition-all duration-300 ${openIndex === i ? 'bg-rose-500 text-white rotate-180' : 'text-slate-400'
                                            }`}
                                    >
                                        <ChevronDown className="w-5 h-5" />
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
                                            <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-4 text-base">
                                                {item.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Contact Link */}
            <div className="text-center mt-12">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Hai altre domande? <a href="mailto:info@staituned.com" className="text-rose-500 font-bold hover:underline">Scrivici</a> o prenota l'audit gratuito.
                </p>
            </div>
        </section>
    )
}
