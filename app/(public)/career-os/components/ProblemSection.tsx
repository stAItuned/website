import { UserX, FileQuestion, VideoOff } from 'lucide-react'

/**
 * ProblemSection - 3 pain cards (simplified, compact)
 */
export default function ProblemSection() {
    const problems = [
        {
            icon: UserX,
            title: 'Nessun target',
            desc: '"Cerco un ruolo AI" non basta. Serve: RAG Engineer, Agent Engineer, GenAI Product.'
        },
        {
            icon: FileQuestion,
            title: 'CV generico',
            desc: 'I recruiter cercano: RAG, Agents, Evaluation. "Appassionato di AI" = cestino.'
        },
        {
            icon: VideoOff,
            title: 'Zero proof',
            desc: 'Servono: demo funzionante, repo pulita, evaluation con metriche reali.'
        }
    ]

    return (
        <section className="py-16 bg-slate-50 dark:bg-[#151925]">
            <div className="max-w-5xl mx-auto px-6">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-[#1A1E3B] dark:text-white">
                    Perché non ti chiamano <span className="text-rose-500">(anche se sai programmare)</span>
                </h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {problems.map((item, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-2xl bg-white dark:bg-[#1A1E3B] border border-slate-200 dark:border-slate-800 hover:border-rose-500/50 transition-colors"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1A1E3B] dark:text-white">
                                    {item.title}
                                </h3>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
