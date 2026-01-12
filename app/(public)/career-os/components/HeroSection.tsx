// Link import removed - no longer used after CTA strategy update
import {
    TrendingUp,
    Linkedin,
    Briefcase,
    Users
} from 'lucide-react'

/**
 * HeroSection - Career OS landing page hero
 * Layout: 2 columns (message + CTA left, stats right) + Problem strip below
 * CTA above the fold for maximum conversion
 */
export default function HeroSection() {
    return (
        <section className="relative pt-36 lg:pt-44 pb-20 px-6 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#1A1E3B] to-slate-900" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

            {/* Subtle Orbs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FFF272]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#F59E0B]/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Two-column layout: Message + Stats */}
                <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
                    {/* LEFT: Message + CTA (above the fold) */}
                    <div className="text-center lg:text-left space-y-8">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] text-white">
                            Il mercato GenAI sta{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF272] to-[#F59E0B]">esplodendo</span>.
                            <br />
                            Tu sei{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF272] to-[#F59E0B]">pronto</span>?
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-xl mx-auto lg:mx-0">
                            In 4–8 settimane diventi <strong className="text-white">offer-ready</strong>: role-fit, CV/JD tailoring, proof con evaluation, mock interview.
                        </p>

                        {/* Micro-persona - problem lever framing */}
                        <p className="text-sm text-[#FFF272]/80 font-medium">
                            Non vuoi solo <span className="text-white/50 line-through">smanettare con GenAI</span> — vuoi diventare un <span className="text-white font-bold">professionista pagato</span> per farlo.
                        </p>

                        {/* Single CTA - Guide user to learn more first */}
                        <div className="flex justify-center lg:justify-start">
                            <a
                                href="#journey"
                                className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-[#FFF272] to-[#F59E0B] text-[#1A1E3B] font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                Scopri come funziona →
                            </a>
                        </div>

                        {/* Capacity Badge */}
                        {/* <div className="flex justify-center lg:justify-start">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60">
                                <Users className="w-4 h-4 text-[#FFF272]" />
                                Cohort 8-10 persone • Max 2 classi/mese
                            </div>
                        </div> */}
                    </div>

                    {/* RIGHT: Stats (compact, vertical on lg) */}
                    <div className="grid sm:grid-cols-3 lg:grid-cols-1 gap-4">
                        {/* Stat 1: Domanda AI */}
                        <div className="group p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-[#FFF272]/20 hover:border-[#FFF272]/40 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FFF272]/10 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-[#FFF272]" />
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-[#FFF272]">+88%</div>
                                    <div className="text-base text-white/70">Domanda AI (Hays Q1 2024)</div>
                                </div>
                            </div>
                        </div>

                        {/* Stat 2: Annunci LinkedIn */}
                        <div className="group p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-[#FFF272]/20 hover:border-[#FFF272]/40 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FFF272]/10 flex items-center justify-center">
                                    <Linkedin className="w-6 h-6 text-[#FFF272]" />
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-[#FFF272]">+73%</div>
                                    <div className="text-base text-white/70">Annunci skill AI (Anitec)</div>
                                </div>
                            </div>
                        </div>

                        {/* Stat 3: Posizioni AI */}
                        <div className="group p-5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-[#FFF272]/20 hover:border-[#FFF272]/40 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FFF272]/10 flex items-center justify-center">
                                    <Briefcase className="w-6 h-6 text-[#FFF272]" />
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-[#FFF272]">21k+</div>
                                    <div className="text-base text-white/70">Annunci AI Italia 2023-24</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PROBLEM STRIP - Dominant visual with clear messaging */}
                <div className="mt-16 p-10 rounded-3xl bg-gradient-to-r from-rose-500/25 to-rose-500/10 border-2 border-rose-500/40 shadow-lg shadow-rose-500/10">
                    <div className="grid md:grid-cols-[auto_1fr_auto] gap-10 items-center">
                        {/* Left: ~6s stat with context */}
                        <div className="text-center">
                            <div className="text-6xl md:text-7xl font-black text-rose-400">~6s</div>
                            <div className="text-base text-white/70 mt-2 font-medium">Il recruiter guarda<br />il tuo CV per 6 secondi</div>
                        </div>

                        {/* Center: Message - concise and impactful */}
                        <div className="text-center space-y-4">
                            <p className="text-2xl md:text-3xl font-bold text-white leading-tight">
                                Hai solo 6 secondi per colpire i recruiter.
                            </p>
                            <p className="text-lg text-white/70">
                                In <strong className="text-[#FFF272]">4–8 settimane</strong> esci con CV + Proof + Interview readiness.
                            </p>
                        </div>

                        {/* Right: <30% stat with context */}
                        <div className="text-center">
                            <div className="text-6xl md:text-7xl font-black text-rose-400">&lt;30%</div>
                            <div className="text-base text-white/70 mt-2 font-medium">Solo il 30% personalizza il CV.<br />Tu sarai tra quelli.</div>
                        </div>
                    </div>
                </div>

                {/* All sources consolidated */}
                <p className="text-xs text-white/40 text-center mt-6">
                    Fonti:{' '}
                    <a href="https://www.hays.it/press-release/content/gen-ia-cresce-richiesta-profili" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/60">Hays Italia</a>
                    {' · '}
                    <a href="https://www.anitec-assinform.it/media/comunicati-stampa/184mila-annunci-per-professionisti-ict-le-aziende-formano-in-autonomia.kl" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/60">Anitec-Assinform</a>
                    {' · '}
                    <a href="https://www.topresume.com/career-advice/7-top-job-search-statistics" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/60">TopResume</a>
                    {' · '}
                    <a href="https://www.theladders.com/career-advice/you-only-get-6-seconds-of-fame-make-it-count" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/60">The Ladders</a>
                </p>
            </div>
        </section>
    )
}
