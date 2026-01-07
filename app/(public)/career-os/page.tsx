import { PageTransition } from '@/components/ui/PageTransition'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
    BrainCircuit,
    FileSearch,
    Target,
    UserX,
    FileQuestion,
    VideoOff,
    CheckCircle2,
    Briefcase,
    Zap,
    Users,
    ShieldCheck,
    TrendingUp,
    Linkedin,
    AlertTriangle,
    ArrowRight
} from 'lucide-react'
import FAQ from './FAQ'

export const metadata: Metadata = {
    title: 'Career OS — Il Percorso per Diventare GenAI Engineer | stAItuned',
    description: 'Smetti di mandare CV a vuoto. Career OS ti prepara per ruoli Applied GenAI in 4-8 settimane: Role-fit, CV ottimizzato, Proof pubblica, Interview prep. Da chi assume, non da career coach.',
}

export default function CareerOSPage() {
    return (
        <PageTransition>
            <div className="min-h-screen bg-white dark:bg-[#0F1117]">
                {/* --- HERO SECTION (Option D: FOMO + Market Data) --- */}
                <section className="relative pt-28 pb-16 px-6 overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#1A1E3B] to-slate-900" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

                    {/* Subtle Orbs */}
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#FFF272]/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#F59E0B]/10 rounded-full blur-3xl" />

                    <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                        {/* Headline */}
                        <div className="space-y-2">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                                Il mercato AI sta{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF272] to-[#F59E0B]">esplodendo</span>.
                                <br /><br />
                                Tu sei{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF272] to-[#F59E0B]">pronto</span>?
                            </h1>
                        </div>

                        {/* Stats - High Impact */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 py-6 max-w-3xl mx-auto">
                            {/* Stat 1: Domanda AI */}
                            <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-[#FFF272]/20 hover:border-[#FFF272]/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,242,114,0.15)]">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FFF272]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative text-center space-y-2">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF272]/10 mb-2">
                                        <TrendingUp className="w-5 h-5 text-[#FFF272]" />
                                    </div>
                                    <div className="text-4xl md:text-5xl font-black text-[#FFF272] drop-shadow-[0_0_10px_rgba(255,242,114,0.3)]">
                                        +88%
                                    </div>
                                    <div className="text-sm text-white font-medium">Domanda AI</div>
                                    <div className="text-xs text-white/40">vs anno precedente</div>
                                </div>
                            </div>

                            {/* Stat 2: Annunci LinkedIn */}
                            <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-[#FFF272]/20 hover:border-[#FFF272]/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,242,114,0.15)]">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FFF272]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative text-center space-y-2">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF272]/10 mb-2">
                                        <Linkedin className="w-5 h-5 text-[#FFF272]" />
                                    </div>
                                    <div className="text-4xl md:text-5xl font-black text-[#FFF272] drop-shadow-[0_0_10px_rgba(255,242,114,0.3)]">
                                        +73%
                                    </div>
                                    <div className="text-sm text-white font-medium">Annunci LinkedIn</div>
                                    <div className="text-xs text-white/40">skill AI richieste</div>
                                </div>
                            </div>

                            {/* Stat 3: Posizioni AI */}
                            <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-[#FFF272]/20 hover:border-[#FFF272]/50 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,242,114,0.15)]">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#FFF272]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative text-center space-y-2">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FFF272]/10 mb-2">
                                        <Briefcase className="w-5 h-5 text-[#FFF272]" />
                                    </div>
                                    <div className="text-4xl md:text-5xl font-black text-[#FFF272] drop-shadow-[0_0_10px_rgba(255,242,114,0.3)]">
                                        21k+
                                    </div>
                                    <div className="text-sm text-white font-medium">Posizioni AI</div>
                                    <div className="text-xs text-white/40">in Italia (2024)</div>
                                </div>
                            </div>
                        </div>

                        {/* Sources */}
                        <p className="text-[10px] text-white/30 text-center">
                            Fonti:{' '}
                            <a href="https://www.hays.it/press-release/content/gen-ia-cresce-richiesta-profili" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/50">Hays Italia Q1 2024</a>
                            {' · '}
                            <a href="https://www.anitec-assinform.it/media/comunicati-stampa/184mila-annunci-per-professionisti-ict-le-aziende-formano-in-autonomia.kl" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/50">Anitec-Assinform Dic 2024</a>
                        </p>

                        {/* Pain vs Solution - High Impact */}
                        <div className="max-w-3xl mx-auto">
                            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                                {/* Pain Card */}
                                <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/30">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                                            <AlertTriangle className="w-5 h-5 text-rose-400" />
                                        </div>
                                        <div>
                                            <p className="text-rose-300 font-semibold text-sm mb-1">Il problema</p>
                                            <p className="text-white text-sm leading-relaxed">
                                                Il <strong className="text-rose-300">90% dei candidati</strong> manda CV generici a ruoli che non capisce.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Arrow Connector */}
                                <div className="hidden md:flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                        <ArrowRight className="w-5 h-5 text-[#FFF272]" />
                                    </div>
                                </div>

                                {/* Solution Card */}
                                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-emerald-300 font-semibold text-sm mb-1">La soluzione</p>
                                            <p className="text-white text-sm leading-relaxed">
                                                <strong className="text-[#FFF272]">Career OS</strong> ti posiziona come profilo AI credibile in <strong className="text-emerald-300">4-8 settimane</strong>.
                                            </p>
                                            <p className="text-xs text-white/50 mt-1 italic">Da chi assume, non da chi teorizza.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                            <Link
                                href="/audit"
                                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#FFF272] to-[#F59E0B] text-[#1A1E3B] font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                Prenota Audit Gratuito →
                            </Link>
                            <span className="text-xs text-white/40">
                                15 min • Zero impegno
                            </span>
                        </div>
                    </div>
                </section>


                {/* --- PROBLEM SECTION --- */}
                <section className="py-24 bg-slate-50 dark:bg-[#151925]">
                    <div className="max-w-5xl mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center mb-6 text-[#1A1E3B] dark:text-white">
                            Perché le tue candidature AI <span className="text-rose-500">non ricevono risposta</span>
                        </h2>
                        <p className="text-center text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto">
                            20-40 candidature inviate, zero callback. Ecco i 3 motivi.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Card 1: Role Confusion */}
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#1A1E3B] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-slate-300">01</div>
                                <div className="mb-6 w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                                    <UserX className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-[#1A1E3B] dark:text-white">
                                    Non sai quale ruolo AI sei
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Data Scientist? ML Engineer? GenAI Engineer? Ogni ruolo ha requisiti diversi. <strong>Se applichi a tutti, non convinci nessuno.</strong>
                                </p>
                            </div>

                            {/* Card 2: CV Invisibility */}
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#1A1E3B] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-slate-300">02</div>
                                <div className="mb-6 w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                                    <FileQuestion className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-[#1A1E3B] dark:text-white">
                                    Il CV dice &quot;entusiasta&quot;, non &quot;engineer&quot;
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    I recruiter cercano keyword specifiche: <strong>RAG, Agents, Evaluation</strong>. Se scrivi "appassionato di AI", finisci nel cestino.
                                </p>
                            </div>

                            {/* Card 3: No Proof */}
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#1A1E3B] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-slate-300">03</div>
                                <div className="mb-6 w-12 h-12 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                                    <VideoOff className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-[#1A1E3B] dark:text-white">
                                    Nessuna prova pubblica
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Gli hiring manager vogliono vedere: <strong>demo funzionante, repo pulita, evaluation con metriche</strong>. Non un altro "progetto Kaggle".
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SOLUTION SECTION --- */}
                <section className="py-24 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-[#1A1E3B] dark:text-white mb-6">
                                La Soluzione: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#383F74] to-[#4d84d4] dark:from-[#FFF272] dark:to-[#F59E0B]">Career OS™</span>
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Un percorso che produce <strong>deliverable concreti</strong>, non ore di video.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: <Target className="w-8 h-8 text-indigo-600 dark:text-[#FFF272]" />,
                                    title: 'Role-Fit + Job Targeting',
                                    desc: 'Scopri se sei RAG Engineer, Agent Engineer o GenAI Product Engineer. Ricevi una lista di 20-40 aziende target.'
                                },
                                {
                                    icon: <FileSearch className="w-8 h-8 text-indigo-600 dark:text-[#FFF272]" />,
                                    title: 'CV/LinkedIn Ottimizzati',
                                    desc: 'CV riscritto con keyword che passano ATS + LinkedIn ottimizzato. Fino a 10 candidature personalizzate.'
                                },
                                {
                                    icon: <CheckCircle2 className="w-8 h-8 text-indigo-600 dark:text-[#FFF272]" />,
                                    title: 'Proof Pubblica "da Engineer"',
                                    desc: 'Progetto GenAI completo: demo funzionante + repo GitHub professionale + evaluation con metriche + write-up tecnico.'
                                },
                                {
                                    icon: <BrainCircuit className="w-8 h-8 text-indigo-600 dark:text-[#FFF272]" />,
                                    title: 'Interview Readiness GenAI',
                                    desc: 'Mock interview con Senior AI su: system design RAG/Agents, tradeoff costo/latenza, debugging live.'
                                }
                            ].map((feature, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-[#151925] border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-[#FFF272]/50 transition-colors group">
                                    <div className="mb-4 p-3 bg-indigo-500/10 dark:bg-[#FFF272]/10 rounded-lg w-fit group-hover:bg-indigo-500/20 dark:group-hover:bg-[#FFF272]/20 transition-colors">{feature.icon}</div>
                                    <h3 className="text-lg font-bold text-[#1A1E3B] dark:text-white mb-2">{feature.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- AI EXPERT GUIDANCE SECTION --- */}
                <section className="py-24 bg-gradient-to-br from-[#1A1E3B] to-[#383F74] text-white">
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
                                    In 4-8 settimane costruisci una proof che abbiamo visto convertire in offer. Niente "fai quello che vuoi".
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
                    </div>
                </section>

                {/* --- HOW IT WORKS SECTION --- */}
                <section className="py-24 px-6">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-16 text-[#1A1E3B] dark:text-white">
                            Come Funziona
                        </h2>

                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent before:dark:via-slate-700">
                            {[
                                { week: 'Week 1-2', title: 'Role-Fit + Job Targeting', desc: 'Output: sai esattamente quale ruolo AI fa per te + hai una lista di 20-40 aziende target.' },
                                { week: 'Week 3-4', title: 'CV/LinkedIn + Candidature', desc: 'Output: CV riscritto + LinkedIn ottimizzato + fino a 10 candidature pronte da inviare.' },
                                { week: 'Week 5-6', title: 'Proof Project', desc: 'Output: progetto GenAI completo con demo live, repo GitHub pulita, evaluation e write-up tecnico.' },
                                { week: 'Week 7-8', title: 'Interview Prep + Mock', desc: 'Output: sei pronto per colloqui tecnici GenAI + hai fatto almeno 1 mock interview reale.' }
                            ].map((step, i) => (
                                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                    {/* Icon/Dot */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 dark:bg-[#1A1E3B] dark:border-slate-700 z-10 transition-transform group-hover:scale-110">
                                        <div className="w-3 h-3 bg-[#FFF272] rounded-full animate-pulse" />
                                    </div>

                                    {/* Card */}
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white dark:bg-[#151925] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-[#FFF272]/50 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-[#1A1E3B] dark:text-white text-lg">{step.title}</span>
                                            <span className="text-xs font-bold px-2 py-1 rounded bg-[#1A1E3B]/5 dark:bg-[#FFF272]/10 text-[#1A1E3B] dark:text-[#FFF272]">
                                                {step.week}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* --- PRICING SECTION --- */}
                <section className="py-24 bg-[#1A1E3B] text-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
                            Investi nel tuo <span className="text-[#FFF272]">ROI</span>
                        </h2>

                        {/* Bootcamp Comparison - KEY MESSAGE */}
                        <div className="max-w-3xl mx-auto mb-12">
                            <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-500/10 to-transparent border border-rose-500/20 mb-6">
                                <p className="text-center text-lg text-rose-300 font-medium">
                                    ❌ I bootcamp tradizionali: <strong className="text-white">€4.000+</strong> • <strong className="text-white">6 mesi</strong> • ore di video
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20">
                                <p className="text-center text-lg text-emerald-300 font-medium">
                                    ✅ Career OS: da <strong className="text-white">€390</strong> • <strong className="text-white">4-8 settimane</strong> • proof concreta
                                </p>
                            </div>
                            <div className="mt-8 text-center">
                                <p className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed">
                                    Non vendiamo ore. Vendiamo <span className="text-[#FFF272] font-bold">OUTCOME</span>:
                                    <br />
                                    <span className="text-white font-bold">CV, Proof Pubblica, Interview Readiness.</span>
                                </p>
                            </div>
                        </div>


                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Starter Card */}
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                                <p className="text-slate-400 text-sm mb-4">4 settimane • Pronto a candidarti con CV e proof</p>
                                <div className="mb-6">
                                    <span className="text-sm line-through text-slate-500">€590</span>
                                    <div className="text-4xl font-bold">€390 <span className="text-lg font-normal text-[#FFF272]">Beta</span></div>
                                </div>
                                <ul className="space-y-3 mb-8 text-slate-300 text-sm">
                                    <li>✓ Scopri quale ruolo AI sei (RAG/Agent/Product)</li>
                                    <li>✓ CV e LinkedIn riscritti con keyword AI</li>
                                    <li>✓ 3 candidature complete (CV + cover)</li>
                                    <li>✓ 1 articolo tecnico pubblicato come proof</li>
                                </ul>
                                <Link href="/audit" className="block w-full py-3 rounded-xl border border-white/20 text-center font-semibold hover:bg-white hover:text-[#1A1E3B] transition-all">
                                    Prenota Audit
                                </Link>
                            </div>

                            {/* Pro Card */}
                            <div className="relative p-8 rounded-3xl bg-gradient-to-b from-[#383F74] to-[#1A1E3B] border-2 border-[#FFF272] shadow-[0_0_30px_rgba(255,242,114,0.15)]">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FFF272] text-[#1A1E3B] px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                                    Più Popolare
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                                <p className="text-slate-300 text-sm mb-4">8 settimane • Tutto per ottenere offer</p>
                                <div className="mb-6">
                                    <span className="text-sm line-through text-slate-500">€1.190</span>
                                    <div className="text-4xl font-bold">€790 <span className="text-lg font-normal text-[#FFF272]">Beta</span></div>
                                </div>
                                <ul className="space-y-3 mb-8 text-white text-sm font-medium">
                                    <li>✓ <strong>Tutto in Starter</strong></li>
                                    <li>✓ 10 candidature complete pronte da inviare</li>
                                    <li>✓ 1 progetto GenAI con demo + repo + evaluation</li>
                                    <li>✓ 1 mock interview con Senior AI Engineer</li>
                                    <li>✓ Lista 20-40 aziende target con contatti</li>
                                </ul>
                                <Link href="/audit" className="block w-full py-3 rounded-xl bg-[#FFF272] text-[#1A1E3B] text-center font-bold hover:bg-[#F59E0B] transition-all shadow-lg">
                                    Prenota Audit
                                </Link>
                            </div>

                            {/* Elite Card */}
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <h3 className="text-2xl font-bold mb-2">Elite</h3>
                                <p className="text-slate-400 text-sm mb-4">8 settimane + Supporto continuo fino all'offer</p>
                                <div className="mb-6">
                                    <span className="text-sm line-through text-slate-500">€1.990</span>
                                    <div className="text-4xl font-bold">€1.490 <span className="text-lg font-normal text-[#FFF272]">Beta</span></div>
                                </div>
                                <ul className="space-y-3 mb-8 text-slate-300 text-sm">
                                    <li>✓ <strong>Tutto in Pro</strong></li>
                                    <li>✓ Tool Career OS per 12 mesi</li>
                                    <li>✓ 1 call mensile di supporto strategico</li>
                                    <li>✓ Review prioritaria su 2 asset/mese</li>
                                </ul>
                                <Link href="/audit" className="block w-full py-3 rounded-xl border border-white/20 text-center font-semibold hover:bg-white hover:text-[#1A1E3B] transition-all">
                                    Prenota Audit
                                </Link>
                            </div>
                        </div>

                        <p className="text-center text-slate-400 mt-8 text-sm">
                            💳 Pagamento in rate disponibile • Nessun abbonamento nascosto
                        </p>

                        {/* Garanzia */}
                        <div className="mt-8 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 max-w-xl mx-auto">
                            <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                            <p className="text-emerald-300 font-medium">
                                <strong className="text-white">Garanzia 15 giorni:</strong> non sei soddisfatto? Ti rimborsiamo, senza domande.
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- FAQ SECTION --- */}
                <FAQ />

                {/* --- FINAL CTA SECTION --- */}
                <section className="py-24 bg-slate-50 dark:bg-[#151925] text-center">
                    <div className="max-w-2xl mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1A1E3B] dark:text-white">
                            Non sei sicuro se fa per te?
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                            Prenota un <strong>GenAI Role-Fit Audit</strong> gratuito (15 min).<br />
                            Ti dico onestamente se Career OS ha senso per la tua situazione.
                        </p>
                        <Link
                            href="/audit"
                            className="inline-block px-12 py-5 rounded-full bg-[#1A1E3B] dark:bg-[#FFF272] text-white dark:text-[#1A1E3B] font-bold text-xl hover:scale-105 transition-transform shadow-2xl"
                        >
                            Prenota Audit Gratuito
                        </Link>
                        <p className="text-sm text-slate-500 mt-4">
                            Zero impegno • Nessuna vendita aggressiva
                        </p>
                        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                            <span className="text-sm text-emerald-600 dark:text-emerald-300 font-medium">
                                Soddisfatti o rimborsati entro 15 giorni
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </PageTransition>
    )
}
