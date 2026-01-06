import { PageTransition } from '@/components/ui/PageTransition'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'stAItuned Career OS - The AI Engineer Path',
    description: 'The first "Operating System" to validate your AI skills and get hired. No more tutorials. Just proof.',
}

export default function CareerOSPage() {
    return (
        <PageTransition>
            <div className="min-h-screen bg-white dark:bg-[#0F1117]">
                {/* --- HERO SECTION --- */}
                <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A1E3B]/5 border border-[#1A1E3B]/10 dark:bg-white/5 dark:border-white/10">
                            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
                            <span className="text-sm font-semibold text-[#1A1E3B] dark:text-white/90">
                                Cohort #1 Focus: Italy 🇮🇹
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#1A1E3B] dark:text-white">
                            Stop Being a Theorist. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#383F74] to-[#4d84d4] dark:from-[#FFF272] dark:to-[#F59E0B]">
                                Become a Practitioner.
                            </span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            University is too slow. Bootcamps are too general. <br />
                            <strong>stAItuned Career OS™</strong> is the 4-8 week system to validate your AI skills,
                            publish real proof, and get hired by top tech teams.
                        </p>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link
                                href="/audit"
                                className="px-8 py-4 rounded-full bg-[#1A1E3B] text-white font-bold text-lg hover:bg-[#383F74] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                            >
                                Start Free Audit
                            </Link>
                            <span className="text-sm text-slate-500 dark:text-slate-500">
                                Only 10 spots for Beta
                            </span>
                        </div>
                    </div>
                </section>

                {/* --- PROBLEM SECTION (The Gap) --- */}
                <section className="py-24 bg-slate-50 dark:bg-[#151925]">
                    <div className="max-w-5xl mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center mb-16 text-[#1A1E3B] dark:text-white">
                            The AI Talent Pipeline is <span className="text-rose-500">Broken</span>.
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#1A1E3B] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-[#FFF272]/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-slate-300">01</div>
                                <h3 className="text-xl font-bold mb-4 text-[#1A1E3B] dark:text-white">The Skill Gap</h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Universities teach theory from 2022. You need to ship RAG & Agents in 2026. The speed of AI &gt; The speed of Academia.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#1A1E3B] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-[#FFF272]/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-slate-300">02</div>
                                <h3 className="text-xl font-bold mb-4 text-[#1A1E3B] dark:text-white">The Credibility Gap</h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Hiring managers see 1,000 "GenAI Experts" who can't code. Without public proof (GitHub/Articles), you are invisible.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="p-8 rounded-2xl bg-white dark:bg-[#1A1E3B] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-[#FFF272]/50 transition-colors">
                                <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-slate-300">03</div>
                                <h3 className="text-xl font-bold mb-4 text-[#1A1E3B] dark:text-white">The Support Void</h3>
                                <p className="text-slate-600 dark:text-slate-300">
                                    Udemy is cheap but lonely. Bootcamps are expensive (€4k+) and slow. You need a middle ground: <strong>Expert Guidance.</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SOLUTION SECTION (The OS) --- */}
                <section className="py-24 px-6">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold text-[#1A1E3B] dark:text-white mb-6">
                                Introducing Career OS™
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400">
                                Not a course. A system to generate career outcomes.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            {/* Visual Side (Mockup placeholder) */}
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#1A1E3B] to-[#383F74] p-8 flex items-center justify-center shadow-2xl relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                                <div className="text-center space-y-4 relative z-10">
                                    <div className="text-6xl text-[#FFF272]">⚙️</div>
                                    <div className="text-2xl font-bold text-white">The Engine</div>
                                </div>
                            </div>

                            {/* Features Side */}
                            <div className="space-y-8">
                                {[
                                    { title: 'Role-Fit Audit', desc: "Stop guessing. We identify your exact fit (Eng vs Product vs Data)." },
                                    { title: 'Expert Guidance', desc: "Mentorship from Seniors who actually ship. No generic coaches." },
                                    { title: 'The Proof Engine', desc: "You graduate with 1 Published Article on stAItuned + 1 Repo." },
                                    { title: 'Job Strategy', desc: "Tailored CV & LinkedIn strategy to bypass filters." }
                                ].map((feature, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#FFF272] flex items-center justify-center text-[#1A1E3B] font-bold shrink-0">
                                            ✓
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[#1A1E3B] dark:text-white">{feature.title}</h3>
                                            <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- PRICING SECTION --- */}
                <section className="py-24 bg-[#1A1E3B] text-white">
                    <div className="max-w-5xl mx-auto px-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
                            Invest in your <span className="text-[#FFF272]">ROI</span>.
                        </h2>
                        <p className="text-center text-slate-300 mb-16 max-w-2xl mx-auto">
                            Most bootcamps cost €4,000+ and take 6 months. We focus on speed and proof for a fraction of the cost.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Starter Card */}
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <h3 className="text-2xl font-bold mb-2">Starter (1:1)</h3>
                                <div className="text-4xl font-bold mb-6">€590 <span className="text-lg font-normal text-slate-400">/ one-off</span></div>
                                <ul className="space-y-4 mb-8 text-slate-300">
                                    <li>✓ Full Role-Fit Audit</li>
                                    <li>✓ CV & LinkedIn Review</li>
                                    <li>✓ 1 Published Article (Editing + SEO)</li>
                                    <li>✓ 2x 1:1 Strategy Calls</li>
                                </ul>
                                <Link href="/audit" className="block w-full py-3 rounded-xl border border-white/20 text-center font-semibold hover:bg-white hover:text-[#1A1E3B] transition-all">
                                    Check Availability
                                </Link>
                            </div>

                            {/* Pro Card */}
                            <div className="relative p-8 rounded-3xl bg-gradient-to-b from-[#383F74] to-[#1A1E3B] border-2 border-[#FFF272] shadow-[0_0_30px_rgba(255,242,114,0.15)]">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FFF272] text-[#1A1E3B] px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                                    Most Popular
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Pro Package</h3>
                                <div className="text-4xl font-bold mb-6">€1,190 <span className="text-lg font-normal text-slate-300">/ one-off</span></div>
                                <ul className="space-y-4 mb-8 text-white font-medium">
                                    <li>✓ <strong>Everything in Starter</strong></li>
                                    <li>✓ <strong>Technical Project Review</strong> (Code level)</li>
                                    <li>✓ Mock Interview w/ Senior AI Eng</li>
                                    <li>✓ Unlimited Async Support (4 weeks)</li>
                                </ul>
                                <Link href="/audit" className="block w-full py-3 rounded-xl bg-[#FFF272] text-[#1A1E3B] text-center font-bold hover:bg-[#F59E0B] transition-all shadow-lg">
                                    Apply Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- FAQ SECTION --- */}
                <section className="py-24 px-6 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12 text-[#1A1E3B] dark:text-white">Common Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: "Is this for beginners?", a: "It's for people who know the basics (Python/JS) but feel stuck. If you've never coded, this is too advanced. If you're a Senior, this is too basic." },
                            { q: "Why focus on Italy?", a: "We believe in dominating one market at a time. Our network and hiring partners are currently strongest in Italy. Global expansion is coming in late 2026." },
                            { q: "Do you guarantee a job?", a: "No ethical educator guarantees a job. We guarantee you will have a portfolio and profile that statistically increases your chances by 10x." }
                        ].map((item, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-[#151925]">
                                <h4 className="font-bold text-lg mb-2 text-[#1A1E3B] dark:text-white">{item.q}</h4>
                                <p className="text-slate-600 dark:text-slate-400">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- FINAL CTA --- */}
                <section className="py-24 text-center">
                    <h2 className="text-4xl font-bold mb-8 text-[#1A1E3B] dark:text-white">Ready to stop guessing?</h2>
                    <Link
                        href="/audit"
                        className="inline-block px-12 py-5 rounded-full bg-[#1A1E3B] dark:bg-white text-white dark:text-[#1A1E3B] font-bold text-xl hover:scale-105 transition-transform shadow-2xl"
                    >
                        Get Your Audit
                    </Link>
                </section>
            </div>
        </PageTransition>
    )
}
