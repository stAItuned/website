import { CheckCircle2, UserX } from 'lucide-react'

/**
 * TargetAudienceSection - Shows who Career OS is for and who it's not for
 */
export default function TargetAudienceSection() {
    return (
        <section className="py-20 bg-white dark:bg-[#0F1117]">
            <div className="max-w-5xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-center mb-12 text-[#1A1E3B] dark:text-white">
                    Career OS è per te se...
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Chi è per */}
                    <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                        <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            È per te se:
                        </h3>
                        <ul className="space-y-3 text-slate-700 dark:text-slate-300 text-sm">
                            <li>✅ Hai background tecnico (dev, data, STEM) e vuoi entrare in AI</li>
                            <li>✅ Sei junior/early-career e vuoi accelerare la transizione</li>
                            <li>✅ Hai tempo per eseguire (4-8h/settimana minimo)</li>
                            <li>✅ Vuoi deliverable concreti, non solo teoria</li>
                            <li>✅ Cerchi ruoli Applied GenAI (RAG, Agents, LLM Apps)</li>
                        </ul>
                    </div>

                    {/* Chi non è per */}
                    <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20">
                        <h3 className="text-lg font-bold text-rose-700 dark:text-rose-300 mb-4 flex items-center gap-2">
                            <UserX className="w-5 h-5" />
                            Non è per te se:
                        </h3>
                        <ul className="space-y-3 text-slate-700 dark:text-slate-300 text-sm">
                            <li>❌ Cerchi un corso video passivo da guardare</li>
                            <li>❌ Non hai tempo per eseguire e iterare</li>
                            <li>❌ Ti aspetti che &quot;troviamo lavoro noi per te&quot;</li>
                            <li>❌ Vuoi solo un certificato da appendere al muro</li>
                            <li>❌ Sei già Senior AI Engineer (non è per te, hai già le skill)</li>
                            <li>❌ Non hai background tecnico minimo</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
