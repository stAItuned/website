'use client'

import {
    TrendingUp,
    Linkedin,
    Briefcase,
    ArrowRight
} from 'lucide-react'

function trackGtagEvent(eventName: string, params: Record<string, string | number | undefined>) {
    // @ts-ignore
    if (typeof window === 'undefined' || !window.gtag) return
    // @ts-ignore
    window.gtag('event', eventName, params)
}

/**
 * HeroSection - Career OS landing page hero
 * REVISED: Problem-focused headline with attention-grabbing stats
 * Layout: Message + Hook Stats + CTAs (above fold), Market stats (right on desktop)
 */
export default function HeroSection() {
    return (
        <section className="relative pt-36 lg:pt-44 pb-16 px-6 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#1A1E3B] to-slate-900" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

            {/* Subtle Orbs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FFF272]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#F59E0B]/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Two-column layout: Message + Stats */}
                <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
                    {/* LEFT: Message + CTAs */}
                    <div className="text-center lg:text-left space-y-6">
                        {/* Pre-headline: Market urgency */}
                        {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFF272]/10 border border-[#FFF272]/30">
                            <span className="w-2 h-2 rounded-full bg-[#FFF272] animate-pulse" />
                            <span className="text-sm font-semibold text-[#FFF272]">
                                +88% domanda GenAI — 21k+ posizioni in Italia
                            </span>
                        </div> */}

                        {/* Headline: 2 lines - Competitive positioning */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] text-white">
                            <span className="whitespace-nowrap">Tutti vogliono ruoli <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF272] to-[#F59E0B]">GenAI</span></span>
                            <br />
                            <span className="whitespace-nowrap">Tu come<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-500"> ti distingui?</span></span>
                        </h1>

                        {/* HOOK STATS - High impact visual design */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-5 py-3">
                            {/* 6 secondi stat */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-2xl group-hover:bg-rose-500/30 transition-all" />
                                <div className="relative flex items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-600/10 border-2 border-rose-500/40 shadow-lg shadow-rose-500/10">
                                    <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-rose-300 to-rose-500">~6s</span>
                                    <span className="text-sm text-white leading-tight">
                                        <strong className="text-rose-300 text-base">È tutto quello che hai, <br />prima di essere cestinato.</strong>
                                    </span>
                                </div>
                            </div>
                            {/* <30% stat */}
                            <div className="relative group">
                                <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-2xl group-hover:bg-rose-500/30 transition-all" />
                                <div className="relative flex items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-600/10 border-2 border-rose-500/40 shadow-lg shadow-rose-500/10">
                                    <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-rose-300 to-rose-500">70%</span>
                                    <span className="text-sm text-white leading-tight">
                                        Manda lo stesso CV. <br /><strong className="text-rose-300 text-base">Tu lo personalizzi!</strong>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Solution teaser - Strong value prop */}
                        <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            In <strong className="text-[#FFF272]">4–8 settimane</strong> costruisci{' '}
                            <strong className="text-white">CV, Prove Concrete e Interview Skills</strong> che ti fanno notare dai recruiter GenAI, guidato da esperti in questo settore.
                        </p>

                        {/* Target roles - Specificity */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 text-sm">
                            {['GenAI Engineer', 'Applied GenAI', 'Agentic AI', 'GenAI Roles'].map((role, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-medium"
                                >
                                    {role}
                                </span>
                            ))}
                        </div>

                        {/* Single CTA */}
                        <div className="flex justify-center lg:justify-start pt-4">
                            <a
                                href="#social-proof"
                                onClick={() => trackGtagEvent('cta_click', { section: 'hero', label: 'vedi_cosa_costruirai' })}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#FFF272] to-[#F59E0B] text-[#1A1E3B] font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                Vedi cosa costruirai
                                <ArrowRight className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* RIGHT: Market Stats - IMPACTFUL DESIGN */}
                    <div className="hidden lg:flex flex-col items-center justify-center">
                        {/* Big impactful stat grid */}
                        <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#FFF272]/10 via-[#F59E0B]/5 to-transparent border border-[#FFF272]/20">
                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-3xl bg-[#FFF272]/5 blur-xl" />

                            <div className="relative space-y-5">
                                {/* Header */}
                                <p className="text-xs text-[#FFF272] font-bold uppercase tracking-widest text-center">
                                    🔥 Mercato AI in Italia
                                </p>

                                {/* Big number 1 */}
                                <div className="text-center">
                                    <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF272] to-[#F59E0B]">
                                        +88%
                                    </div>
                                    <div className="text-sm text-white/60 mt-1">Domanda GenAI 2024</div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-[#FFF272]/30 to-transparent" />

                                {/* Two smaller stats inline */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-[#FFF272]">+73%</div>
                                        <div className="text-xs text-white/50">Skill AI richieste</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-black text-[#FFF272]">21k+</div>
                                        <div className="text-xs text-white/50">Posizioni aperte</div>
                                    </div>
                                </div>

                                {/* Sources */}
                                <p className="text-[9px] text-white/30 text-center pt-2">
                                    Hays • Anitec-Assinform • 2024
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile stats - horizontal scroll */}
            <div className="lg:hidden mt-10 overflow-x-auto pb-4 -mx-6 px-6">
                <div className="flex gap-4 min-w-max">
                    {[
                        { value: '+88%', label: 'Domanda AI', icon: TrendingUp },
                        { value: '+73%', label: 'Skill AI', icon: Linkedin },
                        { value: '21k+', label: 'Posizioni AI', icon: Briefcase },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10"
                        >
                            <div className="w-8 h-8 rounded-lg bg-[#FFF272]/10 flex items-center justify-center">
                                <stat.icon className="w-4 h-4 text-[#FFF272]" />
                            </div>
                            <div>
                                <div className="text-xl font-black text-[#FFF272]">{stat.value}</div>
                                <div className="text-xs text-white/60">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
