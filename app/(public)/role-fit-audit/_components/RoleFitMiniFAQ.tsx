import { Clock, FileCheck, Shield } from 'lucide-react'

export function RoleFitMiniFAQ() {
    const faqs = [
        {
            icon: Clock,
            q: 'Quanto dura?',
            a: 'Circa 5 minuti. Le domande sono progettate per essere rapide, dirette e senza fronzoli.'
        },
        {
            icon: FileCheck,
            q: 'Cosa ricevo?',
            a: 'Report PDF personalizzato con Archetipo, Punteggio di Readiness, Gap Analysis e Piano d’azione.'
        },
        {
            icon: Shield,
            q: 'I dati sono privati?',
            a: 'Assolutamente sì. Non vendiamo i tuoi dati. Servono solo per calcolare il tuo score.'
        }
    ]

    return (
        <section className="py-12 md:py-16 px-4 bg-slate-100/50 dark:bg-slate-900/30">
            <div className="max-w-4xl mx-auto">
                <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6">
                    Domande Frequenti
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center md:items-start p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow text-center md:text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 mb-4">
                                <faq.icon className="w-5 h-5" />
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                                {faq.q}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
