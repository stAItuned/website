import { useCareerOS } from '../context/CareerOSContext'

/**
 * FinalCTASection - Final call-to-action with urgency and scarcity
 * Primary: Candidati, Secondary: Audit
 */
export default function FinalCTASection() {
    const { openAuditModal } = useCareerOS()

    return (
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-[#151925] dark:to-[#0F1117] text-center">
            <div className="max-w-2xl mx-auto px-6">
                {/* Urgency Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 text-rose-500 dark:text-rose-400 text-sm font-medium mb-6">
                    <span className="animate-pulse">●</span>
                    Solo 8-10 posti per cohort
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1A1E3B] dark:text-white">
                    Pronto a diventare <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#383F74] to-[#4d84d4] dark:from-[#FFF272] dark:to-[#F59E0B]">Offer-Ready</span>?
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                    Compila la candidatura in 2 minuti. Ti ricontatto personalmente entro 48h.
                </p>

                {/* Primary CTA */}
                <a
                    href="#candidati"
                    className="inline-block px-10 py-5 rounded-full bg-gradient-to-r from-[#FFF272] to-[#F59E0B] text-[#1A1E3B] font-bold text-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                    Candidati Ora →
                </a>

                {/* Secondary CTA */}
                <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                    Hai domande? <button onClick={openAuditModal} className="underline hover:text-slate-700 dark:hover:text-slate-300">Prenota un audit gratuito (15 min)</button>
                </p>
            </div>
        </section>
    )
}
