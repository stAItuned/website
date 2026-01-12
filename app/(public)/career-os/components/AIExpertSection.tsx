import { Target, Zap, CheckCircle2, User } from 'lucide-react'

/**
 * AIExpertSection - Differentiator section showing AI Expert Guidance value
 * Includes mentor placeholder for future photo/bio
 */
export default function AIExpertSection() {
    return (
        <section id="ai-expert" className="py-24 bg-gradient-to-br from-[#1A1E3B] to-[#383F74] text-white">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-2 rounded-full bg-[#FFF272]/20 text-[#FFF272] text-sm font-semibold mb-6">
                        🏆 Il Nostro Differenziatore
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        AI Expert Guidance
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Impari da <strong>chi assume per questi ruoli</strong>, non da career coach generici.<br />
                        <em>Insider knowledge reale, non teoria.</em>
                    </p>
                </div>

                {/* Mentor Card Placeholder */}
                <div className="max-w-xl mx-auto mb-12 p-6 rounded-2xl bg-white/5 border border-[#FFF272]/30 backdrop-blur-sm">
                    <div className="flex items-center gap-6">
                        {/* Photo placeholder */}
                        <div className="flex-shrink-0 w-20 h-20 rounded-full bg-white/10 border-2 border-dashed border-[#FFF272]/40 flex items-center justify-center">
                            <User className="w-10 h-10 text-[#FFF272]/60" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white mb-1">
                                Il tuo Mentor
                            </p>
                            <p className="text-sm text-[#FFF272] font-medium mb-2">
                                Principal Data Scientist • Specializzato in soluzioni GenAI
                            </p>
                            <p className="text-xs text-slate-400 italic">
                                Foto e bio in arrivo
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 relative group hover:bg-white/10 transition-colors">
                        <div className="w-14 h-14 rounded-xl bg-[#FFF272]/20 text-[#FFF272] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Target className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Focus su ciò che le aziende cercano</h3>
                        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                            Ti diciamo esattamente quali skill mostrano i candidati che vengono assunti: evaluation pipeline, reliability, cost optimization.
                        </p>
                        <div className="pt-6 border-t border-white/10">
                            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">Proven Roles</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 rounded bg-white/10 text-xs text-slate-300">Principal Data Scientist</span>
                                <span className="px-2 py-1 rounded bg-white/10 text-xs text-slate-300">AI Research Engineer</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 relative group hover:bg-white/10 transition-colors">
                        <div className="w-14 h-14 rounded-xl bg-[#FFF272]/20 text-[#FFF272] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Zap className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Roadmap collaudata, zero tutorial hell</h3>
                        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                            In 4-8 settimane costruisci una proof che abbiamo visto convertire in offer. Niente &quot;fai quello che vuoi&quot;.
                        </p>
                        <div className="pt-6 border-t border-white/10">
                            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">Proven Roles</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 rounded bg-white/10 text-xs text-slate-300">Senior AI Engineer</span>
                                <span className="px-2 py-1 rounded bg-white/10 text-xs text-slate-300">GenAI Engineer</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 relative group hover:bg-white/10 transition-colors">
                        <div className="w-14 h-14 rounded-xl bg-[#FFF272]/20 text-[#FFF272] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Feedback tecnico da chi lavora nel campo</h3>
                        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                            Il tuo progetto viene rivisto con la stessa severità di una code review aziendale. Niente pacche sulla spalla.
                        </p>
                        <div className="pt-6 border-t border-white/10">
                            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">Proven Roles</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 rounded bg-white/10 text-xs text-slate-300">Tech Lead</span>
                                <span className="px-2 py-1 rounded bg-white/10 text-xs text-slate-300">Eng Manager</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bridge CTA to Journey */}
                <div className="mt-12 text-center">
                    <a
                        href="#journey"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FFF272] text-[#1A1E3B] font-bold hover:bg-[#F59E0B] transition-colors shadow-lg"
                    >
                        Vedi il percorso completo →
                    </a>
                </div>
            </div>
        </section>
    )
}
