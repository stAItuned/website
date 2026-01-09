import { Code2, BarChart3, FileText, CheckCircle2, Users } from 'lucide-react'

/**
 * SocialProofSection - Process Proof & Output Standards
 * Instead of contestable metrics, we show tangible outputs and quality standards.
 */

interface ProcessProofItem {
    icon: React.ElementType
    title: string
    description: string
}

const PROCESS_PROOF: ProcessProofItem[] = [
    {
        icon: Code2,
        title: 'Repo + Demo',
        description: 'GitHub pubblico, demo riproducibile, README professionale',
    },
    {
        icon: BarChart3,
        title: 'Evaluation Report',
        description: 'Metriche, error analysis, decision log documentati',
    },
    {
        icon: FileText,
        title: 'Write-up Tecnico',
        description: 'Articolo/portfolio che comunica il progetto',
    },
]

const QUALITY_STANDARDS = [
    'Definition of Done',
    'Evaluation Harness',
    'Decision Log',
    'Peer Review',
]

export default function SocialProofSection() {
    return (
        <section className="py-16 md:py-20 px-6 bg-white dark:bg-[#0F1117]">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-4">
                        🎯 What You'll Build
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1A1E3B] dark:text-white mb-3">
                        Output tangibili, non slide
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Ogni partecipante esce con asset verificabili che riducono il rischio percepito per l'hiring manager.
                    </p>
                </div>

                {/* Process Proof Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {PROCESS_PROOF.map((item, i) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={i}
                                className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-[#151925] dark:to-[#1A1E3B] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all group"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
                                    <Icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-[#1A1E3B] dark:text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* Quality Standards Checklist */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/50 dark:from-[#151925] dark:to-[#1A1E3B]/80 border border-slate-200 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-[#1A1E3B] dark:text-white mb-1">
                                Standard di qualità inclusi
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Ogni progetto segue checklist da engineering professionale.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {QUALITY_STANDARDS.map((standard, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#0F1117] border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300"
                                >
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    {standard}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cohort Badge */}
                <div className="mt-8 flex justify-center">
                    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-[#151925] border border-slate-200 dark:border-slate-800 shadow-sm">
                        <Users className="w-5 h-5 text-[#FFF272]" />
                        <div>
                            <p className="text-sm font-bold text-[#1A1E3B] dark:text-white">
                                Cohort 8–10 persone
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Max 2 classi/mese • Qualità &gt; quantità
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
