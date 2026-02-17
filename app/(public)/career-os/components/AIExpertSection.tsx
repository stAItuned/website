'use client'

import { Target, Zap, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

import { trackCareerOSCTAClicked } from '@/lib/analytics/trackEvent'
import { useCareerOS } from '../context/CareerOSContext'

/**
 * AIExpertSection - Differentiator section showing AI Expert Guidance value
 * Includes mentor placeholder for future photo/bio
 */
export default function AIExpertSection() {
    const { openAuditModal } = useCareerOS()

    return (
        <section id="ai-expert" className="py-24 bg-gradient-to-br from-[#1A1E3B] to-[#383F74] text-white">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-2 rounded-full bg-[#FCD34D]/20 text-[#FCD34D] text-sm font-semibold mb-6">
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
                <div className="max-w-2xl mx-auto mb-12 p-6 rounded-2xl bg-white/5 border border-[#FCD34D]/30 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                        {/* Photo */}
                        <div className="relative flex-shrink-0 w-24 h-24 rounded-full border-2 border-[#FCD34D] overflow-hidden shadow-[0_0_20px_-5px_rgba(252,211,77,0.3)]">
                            <Image
                                src="/assets/career-os/mentor_profile.jpg"
                                alt="Mentor Profile"
                                fill
                                className="object-cover"
                                sizes="96px"
                            />
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-xl font-bold text-white mb-1">
                                Il tuo Mentor
                            </p>
                            <p className="text-base text-[#FCD34D] font-bold mb-2">
                                Principal Data Scientist & AI Strategy Lead
                            </p>
                            <div className="inline-flex px-3 py-1 rounded-full bg-[#FCD34D]/10 text-[#FCD34D] text-xs font-semibold border border-[#FCD34D]/20">
                                6+ Anni di Esperienza in AI / NLP / GenAI
                            </div>
                        </div>
                    </div>

                    {/* Credibility Badges */}
                    <div className="grid sm:grid-cols-2 gap-4 border-t border-white/10 pt-5">
                        <div className="flex items-start gap-3">
                            <span className="mt-1 w-2 h-2 rounded-full bg-[#FCD34D] shadow-[0_0_10px_rgba(251,191,36,0.5)]"></span>
                            <div>
                                <p className="text-white font-bold text-sm">Nova Talent Member</p>
                                <p className="text-xs text-slate-400">Top 3% Global Talent Network (Merit-based)</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="mt-1 w-2 h-2 rounded-full bg-[#FCD34D] shadow-[0_0_10px_rgba(251,191,36,0.5)]"></span>
                            <div>
                                <p className="text-white font-bold text-sm">Top 111 Under 35</p>
                                <p className="text-xs text-slate-400">Riconosciuto tra i migliori talenti italiani (2022)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-12">
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 relative group hover:bg-white/10 transition-colors">
                        <div className="w-14 h-14 rounded-xl bg-[#FCD34D]/20 text-[#FCD34D] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
                        <div className="w-14 h-14 rounded-xl bg-[#FCD34D]/20 text-[#FCD34D] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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
                        <div className="w-14 h-14 rounded-xl bg-[#FCD34D]/20 text-[#FCD34D] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
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

                {/* Bridge CTAs */}
                <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <a
                        href="#social-proof"
                        onClick={() => trackCareerOSCTAClicked('expert', 'vedi_cosa_costruirai')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FCD34D] text-[#1A1E3B] font-bold hover:bg-[#F59E0B] transition-colors shadow-lg w-full sm:w-auto justify-center"
                    >
                        Vedi cosa costruirai →
                    </a>
                    <button
                        onClick={() => {
                            trackCareerOSCTAClicked('expert', 'richiedi_audit_gratuito')
                            openAuditModal()
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-[#FCD34D]/30 text-white font-bold hover:bg-white/10 transition-colors shadow-lg w-full sm:w-auto justify-center"
                    >
                        Hai dei dubbi? Parliamone
                    </button>
                </div>
            </div>
        </section>
    )
}
