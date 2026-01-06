import { PageTransition } from '@/components/ui/PageTransition'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'AI Career Fit Audit - stAItuned',
    description: 'Discover your ideal AI role and identify your skill gaps in 5 minutes.',
}

export default function AuditPage() {
    return (
        <PageTransition>
            <div className="min-h-screen bg-white dark:bg-[#0F1117] flex flex-col items-center justify-center p-6">

                {/* Header */}
                <div className="max-w-2xl text-center space-y-6 mb-12 mt-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#383F74]/10 text-[#383F74] dark:text-[#aab4ff] text-sm font-semibold">
                        🎯 Free Diagnostic Tool
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1A1E3B] dark:text-white">
                        Where do you fit in the <br /> AI Economy?
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Stop learning random skills. Answer 8 questions to uncover: <br />
                        1. Your ideal AI Role (Eng vs Product vs Data). <br />
                        2. Your "Credibility Score". <br />
                        3. The exact project you should build next.
                    </p>
                </div>

                {/* --- FORM PLACEHOLDER (Waitlist / Typeform) --- */}
                <div className="w-full max-w-xl bg-slate-50 dark:bg-[#151925] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    {/* Visual filtering logic explanation */}
                    <div className="space-y-6 text-center">
                        <h3 className="text-xl font-bold text-[#1A1E3B] dark:text-white">
                            Start the Audit
                        </h3>

                        {/* Temporary Logic for MVP (Replace with Client Component interacting with Typeform later) */}
                        <div className="grid gap-4">
                            <Link
                                href="https://tally.so/r/w7Xj0L" // Replace with actual Form link
                                target="_blank"
                                className="block w-full py-4 rounded-xl bg-[#1A1E3B] text-white font-bold hover:bg-[#383F74] transition-colors"
                            >
                                I live in Italy 🇮🇹
                                <span className="block text-xs font-normal opacity-70 mt-1">Get Audit + Match with Career OS Mentor</span>
                            </Link>

                            <Link
                                href="https://tally.so/r/mK0jD9" // Replace with Waitlist Form link
                                target="_blank"
                                className="block w-full py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-[#1A1E3B] dark:hover:border-white transition-colors"
                            >
                                I live elsewhere 🌍
                                <span className="block text-xs font-normal text-slate-500 mt-1">Get Audit + Join Global Waitlist</span>
                            </Link>
                        </div>

                        <p className="text-xs text-slate-400 mt-4">
                            Takes 3 minutes. No credit card required.
                        </p>
                    </div>
                </div>

                {/* Social Proof Footer */}
                <div className="mt-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    <p className="text-center text-sm font-semibold mb-4 text-slate-400">JOIN 1,500+ ENGINEERS READING STAITUNED</p>
                    {/* Add logos here if available */}
                </div>

            </div>
        </PageTransition>
    )
}
