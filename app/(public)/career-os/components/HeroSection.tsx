'use client'

import {
    TrendingUp,
    Linkedin,
    Briefcase,
    ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'

import { trackCareerOSCTAClicked } from '@/lib/analytics/trackEvent'
import { useCareerOS } from '../context/CareerOSContext'

/**
 * HeroSection - Career OS landing page hero
 * REVISED: Problem-focused headline with attention-grabbing stats
 * Layout: Message + Hook Stats + CTAs (above fold), Market stats (right on desktop)
 */
export default function HeroSection() {
    const { openAuditModal } = useCareerOS()

    const marketStats = [
        {
            value: '+88%',
            label: 'Domanda GenAI 2024',
            subLabel: 'vs 2023',
            source: 'Hays Salary Guide 2024',
            link: 'https://www.hays.it/press-release/content/gen-ia-cresce-richiesta-profili'
        },
        {
            value: '+73%',
            label: 'Skill AI richieste',
            subLabel: 'Negli annunci IT',
            source: 'Osservatorio Competenze 2024',
            link: 'https://www.assintel.it/wp-content/uploads/2024/12/Competenze-Digitali-Unopportunita-per-lo-sviluppo-del-Paese.pdf'
        },
        {
            value: '21k+',
            label: 'Posizioni aperte',
            subLabel: 'Settore AI/Data',
            source: 'Anitec-Assinform 2024',
            link: 'https://www.assintel.it/wp-content/uploads/2024/12/Competenze-Digitali-Unopportunita-per-lo-sviluppo-del-Paese.pdf'
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    }

    return (
        <section className="relative pt-24 sm:pt-36 lg:pt-44 pb-10 sm:pb-16 px-4 sm:px-6 overflow-x-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#1A1E3B] to-slate-900" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

            {/* Subtle Orbs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FFF272]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#F59E0B]/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Two-column layout: Message + Stats */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="grid lg:grid-cols-[1.4fr_0.6fr] gap-8 lg:gap-10 items-center"
                >
                    {/* LEFT: Message + CTAs */}
                    <div className="text-center lg:text-left space-y-4 sm:space-y-6">
                        {/* Headline: responsive scaling */}
                        <motion.h1
                            variants={itemVariants}
                            className="text-[1.75rem] sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-6xl font-black leading-[1.15] text-white"
                        >
                            <span className="sm:whitespace-nowrap">Tutti vogliono ruoli <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF272] to-[#F59E0B]">GenAI</span></span>
                            <br className="hidden sm:block" />
                            <span className="block sm:ml-2">Tu come<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-500"> ti distingui?</span></span>
                        </motion.h1>

                        {/* HOOK STATS - Stack on mobile, side-by-side on larger */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row sm:flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 py-4"
                        >
                            {[
                                {
                                    value: "7s",
                                    label: "Prima scrematura del CV",
                                    subLabel: "È tutto quello che hai, prima di essere cestinato.",
                                    source: "TheLadders – Eye-Tracking Study",
                                    link: "https://www.theladders.com/static/images/basicSite/pdfs/TheLadders-EyeTracking-StudyC2.pdf"
                                },
                                {
                                    value: "55%",
                                    label: "dei candidati Personalizza il CV",
                                    subLabel: "Sei tu quello che non lo fa?",
                                    source: "Indeed (multiple resume analysis)",
                                    link: "https://www.indeed.com/news/releases/indeed-launches-ai-powered-smart-sourcing-to-make-hiring-faster-by-matching-and-connecting-people-with-relevant-jobs"
                                }
                            ].map((stat, i) => (
                                <a
                                    key={i}
                                    href={stat.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative group cursor-pointer block w-full sm:min-w-[280px] sm:flex-1 sm:max-w-sm"
                                >
                                    <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-2xl group-hover:bg-rose-500/30 transition-all opacity-0 group-hover:opacity-100" />
                                    <div className="relative h-full flex flex-col items-start gap-2 p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-600/10 border border-rose-500/30 sm:border-2 shadow-lg shadow-rose-500/5 transition-all group-hover:border-rose-500/60 group-hover:-translate-y-1">
                                        <div className="flex flex-row items-center gap-3 sm:gap-4">
                                            <span className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-rose-300 to-rose-500 shrink-0">
                                                {stat.value}
                                            </span>
                                            <span className="text-sm sm:text-sm text-white leading-snug">
                                                <strong className="text-rose-200 text-sm sm:text-lg block mb-1">
                                                    {stat.label}
                                                </strong>
                                                <span className="text-[#FFF272] text-xs sm:text-sm font-semibold drop-shadow-[0_0_8px_rgba(255,242,114,0.4)]">
                                                    {stat.subLabel}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-widest flex items-center justify-center gap-1.5 mt-auto pt-1 w-full group-hover:text-rose-300 transition-colors px-2 text-center">
                                            Fonte: {stat.source} <ArrowRight className="w-2.5 h-2.5 shrink-0" />
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </motion.div>

                        {/* Solution teaser - Strong value prop */}
                        <motion.p
                            variants={itemVariants}
                            className="text-base sm:text-lg md:text-xl text-white/80 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            In <strong className="text-[#FFF272]">4–8 settimane</strong> costruisci{' '}
                            <strong className="text-white">CV, Prove Concrete e Interview Skills</strong> che ti fanno notare dai recruiter GenAI, guidato da esperti in questo settore.
                        </motion.p>

                        {/* Target roles - Specificity */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap justify-center lg:justify-start gap-1.5 sm:gap-2 text-xs sm:text-sm"
                        >
                            {['GenAI Engineer', 'Applied GenAI', 'Agentic AI', 'GenAI Roles'].map((role, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-medium"
                                >
                                    {role}
                                </span>
                            ))}
                        </motion.div>

                        {/* CTAs */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4 pt-2 sm:pt-4"
                        >
                            <a
                                href="#social-proof"
                                onClick={() => trackCareerOSCTAClicked('hero', 'vedi_cosa_costruirai')}
                                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-gradient-to-r from-[#FFF272] to-[#F59E0B] text-[#1A1E3B] font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                            >
                                Vedi cosa costruirai
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </a>
                            <button
                                onClick={() => {
                                    trackCareerOSCTAClicked('hero', 'richiedi_audit_gratuito')
                                    openAuditModal()
                                }}
                                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white/5 border border-white/20 text-white font-bold text-base sm:text-lg hover:bg-white/10 hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                            >
                                📞  Richiedi un audit gratuito (15 min)
                            </button>
                        </motion.div>
                    </div>

                    {/* RIGHT: Market Stats - IMPACTFUL DESIGN */}
                    <motion.div
                        variants={itemVariants}
                        className="hidden lg:flex flex-col items-center justify-center"
                    >
                        {/* Big impactful stat grid */}
                        <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#FFF272]/10 via-[#F59E0B]/5 to-transparent border border-[#FFF272]/20 w-full max-w-sm">
                            {/* Glow effect */}
                            <div className="absolute inset-0 rounded-3xl bg-[#FFF272]/5 blur-xl" />

                            <div className="relative space-y-6">
                                {/* Header */}
                                <p className="text-xs text-[#FFF272] font-bold uppercase tracking-widest text-center">
                                    🔥 Mercato AI in Italia
                                </p>

                                {/* Big number 1 */}
                                <div className="text-center group cursor-pointer transition-transform hover:scale-105">
                                    <a href={marketStats[0].link} target="_blank" rel="noopener noreferrer" className="block">
                                        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF272] to-[#F59E0B] mb-2">
                                            {marketStats[0].value}
                                        </div>
                                        <div className="text-sm font-bold text-white mb-1">{marketStats[0].label}</div>
                                        <div className="inline-flex items-center gap-1 text-[10px] text-white/40 uppercase tracking-wide group-hover:text-[#FFF272] transition-colors">
                                            Fonte: {marketStats[0].source} ↗
                                        </div>
                                    </a>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-[#FFF272]/30 to-transparent" />

                                {/* Two smaller stats inline */}
                                <div className="grid grid-cols-2 gap-4">
                                    {marketStats.slice(1).map((stat, i) => (
                                        <div key={i} className="text-center group cursor-pointer transition-transform hover:scale-105">
                                            <a href={stat.link} target="_blank" rel="noopener noreferrer" className="block">
                                                <div className="text-3xl font-black text-[#FFF272] mb-1">{stat.value}</div>
                                                <div className="text-xs font-medium text-white/70 mb-1 leading-tight">{stat.label}</div>
                                                <div className="inline-flex items-center gap-0.5 text-[9px] text-white/30 group-hover:text-[#FFF272] transition-colors">
                                                    {stat.source.split(' ')[0]}... ↗
                                                </div>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Mobile stats - horizontal scroll with visual cues */}
            <div className="lg:hidden mt-10 relative group">
                {/* Visual cue: fade gradient on the right */}
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

                <div className="overflow-x-auto pb-6 -mx-4 px-4 no-scrollbar scroll-smooth">
                    <div className="flex gap-4 min-w-max pb-2">
                        {marketStats.map((stat, i) => (
                            <a
                                key={i}
                                href={stat.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col gap-2 p-5 rounded-2xl bg-white/5 border border-white/10 min-w-[200px] active:scale-95 transition-all hover:bg-white/10 hover:border-[#FFF272]/30"
                            >
                                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF272] to-[#F59E0B]">{stat.value}</div>
                                <div className="text-sm font-bold text-white tracking-tight">{stat.label}</div>
                                <div className="text-[10px] text-[#FFF272]/60 mt-auto uppercase tracking-widest flex items-center gap-1 font-bold">
                                    Fonte: {stat.source.split(' ')[0]} ↗
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
                {/* Optional: subtle drag hint or dots? Ticker usually enough with fade. */}
            </div>
        </section >
    )
}
