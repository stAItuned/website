import { PageTransition } from '@/components/ui/PageTransition'
import Link from 'next/link'
import type { Metadata } from 'next'

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
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFF272] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFF272]"></span>
                            </span>
                            <span className="text-xs font-medium text-white/80">
                                🇮🇹 Beta Italia — Solo 10 Posti
                            </span>
                        </div>

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

                        {/* Stats inline */}
                        <div className="flex flex-wrap justify-center gap-3 md:gap-4 py-4">
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                <span className="text-xl md:text-2xl font-bold text-[#FFF272]">+88%</span>
                                <span className="text-xs text-white/50 ml-2">domanda AI</span>
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                <span className="text-xl md:text-2xl font-bold text-[#FFF272]">+73%</span>
                                <span className="text-xs text-white/50 ml-2">annunci LinkedIn</span>
                            </div>
                            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                                <span className="text-xl md:text-2xl font-bold text-[#FFF272]">21k+</span>
                                <span className="text-xs text-white/50 ml-2">posizioni AI</span>
                            </div>
                        </div>

                        {/* Pain + Solution */}
                        <div className="space-y-3 max-w-2xl mx-auto">
                            <p className="text-base text-rose-300/80">
                                ⚠️ Il 90% dei candidati manda CV generici a ruoli che non capisce.
                            </p>
                            <p className="text-base text-white/70">
                                <strong className="text-white">Career OS</strong> ti posiziona come un profilo AI credibile in 4-8 settimane.{' '}
                                <span className="text-[#FFF272]">Da chi assume, non da chi teorizza.</span>
                            </p>
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
                            Il problema che <span className="text-rose-500">nessuno ti dice</span>
                        </h2>
                        <p className="text-center text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto">
                            Puoi leggere tutti gli articoli AI del mondo. Ma se non sai come posizionarti, i recruiter non ti chiameranno mai.
                        </p>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Card 1: Role Confusion */}
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#1A1E3B] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-slate-300">01</div>
                                <div className="text-3xl mb-4">🤷</div>
                                <h3 className="text-xl font-bold mb-4 text-[#1A1E3B] dark:text-white">
                                    Confusione Ruoli
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    DS, ML Eng, GenAI Eng… <strong>Quale sei?</strong> Se non lo sai tu, perché dovrebbe saperlo un recruiter?
                                </p>
                            </div>

                            {/* Card 2: CV Invisibility */}
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#1A1E3B] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-slate-300">02</div>
                                <div className="text-3xl mb-4">👻</div>
                                <h3 className="text-xl font-bold mb-4 text-[#1A1E3B] dark:text-white">
                                    CV Invisibile
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    "AI Enthusiast" non basta. Se il tuo CV dice <em>entusiasta</em> invece di <em>engineer</em>, finisce nel cestino.
                                </p>
                            </div>

                            {/* Card 3: No Proof */}
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#1A1E3B] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-rose-500/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-slate-300">03</div>
                                <div className="text-3xl mb-4">📭</div>
                                <h3 className="text-xl font-bold mb-4 text-[#1A1E3B] dark:text-white">
                                    Nessuna Proof
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Gli hiring manager vogliono <strong>demo, repo, evaluation</strong>. Non un altro CV con "Python/LangChain" senza contesto.
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
                                Non un corso. Un sistema per generare <strong>outcome di carriera</strong> in 4-8 settimane.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: '🎯',
                                    title: 'Role-Fit + Job Targeting',
                                    desc: 'Scegli il track giusto (RAG / Agent / Product) e identifica le aziende target.'
                                },
                                {
                                    icon: '📄',
                                    title: 'CV/LinkedIn Ottimizzati',
                                    desc: 'Rubrica + revisione per passare ATS e hiring manager AI.'
                                },
                                {
                                    icon: '🚀',
                                    title: 'Proof Pubblica "da Engineer"',
                                    desc: 'Demo + repo pulita + evaluation + write-up. Validata da chi lavora nel campo.'
                                },
                                {
                                    icon: '🎤',
                                    title: 'Interview Readiness GenAI',
                                    desc: 'Prep specifica: RAG, Agents, Evaluation, Tradeoffs reali.'
                                }
                            ].map((feature, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-[#151925] border border-slate-200 dark:border-slate-800 hover:border-[#FFF272]/50 transition-colors">
                                    <div className="text-4xl mb-4">{feature.icon}</div>
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
                                Mentoring da <strong>Senior AI professionals</strong> che assumono, costruiscono e shippano AI ogni giorno.<br />
                                <em>Non teoria. Insider knowledge reale.</em>
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 mt-12">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🎯</span>
                                </div>
                                <h3 className="font-bold mb-2">Sai Cosa Conta Davvero</h3>
                                <p className="text-sm text-slate-300">Quali skill prioritizzare, come emergere, cosa cercano gli hiring manager.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <h3 className="font-bold mb-2">Accelerazione</h3>
                                <p className="text-sm text-slate-300">Evitiamo perdite di tempo su cose irrilevanti. Focus su ciò che funziona.</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">✅</span>
                                </div>
                                <h3 className="font-bold mb-2">Credibilità</h3>
                                <p className="text-sm text-slate-300">La tua proof validata da chi lavora nel campo. Non da career coach generici.</p>
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

                        <div className="space-y-6">
                            {[
                                { week: 'Week 1-2', title: 'Role-Fit + Job Targeting', desc: 'Scelta del track (RAG/Agent/Product), definizione JD archetype, roadmap personale.' },
                                { week: 'Week 3-4', title: 'CV/LinkedIn + JD Tailoring', desc: 'Ottimizzazione CV con rubrica, LinkedIn strategy, pack candidature (3-10 JD).' },
                                { week: 'Week 5-6', title: 'Proof Project', desc: 'Progetto standard per track: demo + repo pulita + evaluation + write-up.' },
                                { week: 'Week 7-8', title: 'Interview Prep + Mock', desc: 'Prep specifica GenAI (RAG/Agents/Eval/Tradeoffs) + mock interview con Senior AI.' }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-6 items-start p-6 rounded-2xl bg-slate-50 dark:bg-[#151925] border border-slate-200 dark:border-slate-800">
                                    <div className="shrink-0 w-24 text-center">
                                        <span className="inline-block px-3 py-1 rounded-full bg-[#1A1E3B] dark:bg-[#FFF272] text-white dark:text-[#1A1E3B] text-sm font-bold">
                                            {step.week}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#1A1E3B] dark:text-white mb-1">{step.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400">{step.desc}</p>
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
                                <p className="text-slate-400 text-sm mb-4">4 settimane • Candidabile + Proof-lite</p>
                                <div className="mb-6">
                                    <span className="text-sm line-through text-slate-500">€590</span>
                                    <div className="text-4xl font-bold">€390 <span className="text-lg font-normal text-[#FFF272]">Beta</span></div>
                                </div>
                                <ul className="space-y-3 mb-8 text-slate-300 text-sm">
                                    <li>✓ Role-Fit Audit completo</li>
                                    <li>✓ CV + LinkedIn ottimizzati</li>
                                    <li>✓ 3 JD pack (tailoring + cover)</li>
                                    <li>✓ 1 Articolo su stAItuned (con QA)</li>
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
                                <p className="text-slate-300 text-sm mb-4">8 settimane • Proof seria + Interview</p>
                                <div className="mb-6">
                                    <span className="text-sm line-through text-slate-500">€1.190</span>
                                    <div className="text-4xl font-bold">€790 <span className="text-lg font-normal text-[#FFF272]">Beta</span></div>
                                </div>
                                <ul className="space-y-3 mb-8 text-white text-sm font-medium">
                                    <li>✓ <strong>Tutto in Starter</strong></li>
                                    <li>✓ 10 JD pack</li>
                                    <li>✓ Progetto GenAI standard (demo+repo+eval)</li>
                                    <li>✓ 1 Mock Interview con Senior AI</li>
                                    <li>✓ Job Targeting Kit (20-40 aziende)</li>
                                </ul>
                                <Link href="/audit" className="block w-full py-3 rounded-xl bg-[#FFF272] text-[#1A1E3B] text-center font-bold hover:bg-[#F59E0B] transition-all shadow-lg">
                                    Prenota Audit
                                </Link>
                            </div>

                            {/* Elite Card */}
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <h3 className="text-2xl font-bold mb-2">Elite</h3>
                                <p className="text-slate-400 text-sm mb-4">8 settimane + 12 mesi supporto</p>
                                <div className="mb-6">
                                    <span className="text-sm line-through text-slate-500">€1.990</span>
                                    <div className="text-4xl font-bold">€1.490 <span className="text-lg font-normal text-[#FFF272]">Beta</span></div>
                                </div>
                                <ul className="space-y-3 mb-8 text-slate-300 text-sm">
                                    <li>✓ <strong>Tutto in Pro</strong></li>
                                    <li>✓ Accesso tool 12 mesi</li>
                                    <li>✓ 1 Office Hour / mese</li>
                                    <li>✓ Priority review (2 asset/mese)</li>
                                </ul>
                                <Link href="/audit" className="block w-full py-3 rounded-xl border border-white/20 text-center font-semibold hover:bg-white hover:text-[#1A1E3B] transition-all">
                                    Prenota Audit
                                </Link>
                            </div>
                        </div>

                        <p className="text-center text-slate-400 mt-8 text-sm">
                            💳 Pagamento in rate disponibile • Nessun abbonamento nascosto
                        </p>
                    </div>
                </section>

                {/* --- FAQ SECTION --- */}
                <section className="py-24 px-6 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-[#1A1E3B] dark:text-white">
                        Domande Frequenti
                    </h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: "Garantite il lavoro?",
                                a: "No. Nessun educatore etico promette lavoro garantito. Ti promettiamo deliverable concreti (CV, proof, prep) che aumentano statisticamente le tue chances."
                            },
                            {
                                q: "E se non sono soddisfatto?",
                                a: "Feedback garantito + iterazioni entro i limiti concordati. Il nostro obiettivo è che tu sia pronto, non che tu sia \"contento ma impreparato\"."
                            },
                            {
                                q: "Quanto tempo devo dedicare?",
                                a: "5-8 ore/settimana tra sessioni e homework. È un impegno serio, ma realistico se stai cercando lavoro attivamente."
                            },
                            {
                                q: "Qual è la differenza con un bootcamp?",
                                a: "I bootcamp vendono ore di video. Noi vendiamo outcome: proof pubblica, candidabilità, interview readiness. Non ore, risultati."
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-[#151925] border border-slate-200 dark:border-slate-800">
                                <h4 className="font-bold text-lg mb-3 text-[#1A1E3B] dark:text-white">{item.q}</h4>
                                <p className="text-slate-600 dark:text-slate-400">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

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
                    </div>
                </section>
            </div>
        </PageTransition>
    )
}
