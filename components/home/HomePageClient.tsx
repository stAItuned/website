'use client'

import { HomeHero } from './HomeHero'
import { TickerArticle } from '@/components/ui/ArticleTicker'
import { ArticleCard } from '@/components/ArticleCard'
import Link from 'next/link'

interface HomePageClientProps {
    tickerArticles: TickerArticle[]
}

export function HomePageClient({ tickerArticles }: HomePageClientProps) {
    // We treat the tickerArticles as the "Latest Articles" feed for now
    // In a real scenario, we might pass a separate 'latestPosts' prop
    const latestPosts = tickerArticles.slice(0, 9);

    return (
        <>
            {/* 1. Hero Section (Updated Copy in next step) */}
            <HomeHero />

            {/* 2. Authority Feed (Direct Articles) */}
            <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto" id="articles">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            Latest Insights
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Technical deep-dives and career strategy for AI Engineers.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestPosts.map((post, i) => (
                        <ArticleCard
                            key={post.slug}
                            article={post} // ArticleCard expects 'target' prop format, might need adjustment if types mismatch
                        />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-500 mb-4">Want to go deep on a specific path?</p>
                    {/* Temporary links to keep old navigation accessible if needed */}
                    <div className="flex justify-center gap-4">
                        <Link href="/learn?target=newbie" className="text-sm font-semibold hover:text-[#383F74] transition-colors">Beginner Path</Link>
                        <span className="text-slate-300">•</span>
                        <Link href="/learn?target=expert" className="text-sm font-semibold hover:text-[#383F74] transition-colors">Expert Path</Link>
                    </div>
                </div>
            </section>

            {/* 2b. Lead Magnet: Role-Fit Guide (Pain: Role Confusion) */}
            <section className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-[#0f1117] dark:to-[#151925]">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-700">
                        <span className="inline-block text-4xl mb-4">🧭</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                            Not sure which AI role fits you?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">
                            ML Engineer? AI Ops? Data Scientist? Download the free <strong>AI Career Role-Fit Guide</strong> and find your path.
                        </p>
                        <a
                            href="/audit"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
                        >
                            <span>📥</span>
                            <span>Get the Free Guide</span>
                        </a>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-4">
                            No spam. Just clarity on your AI career direction.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Intermezzo: Career OS CTA (Pain: Opportunity Gap) */}
            <section className="py-24 bg-slate-50 dark:bg-[#151925] border-y border-slate-200 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    {/* Italy Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 mb-8">
                        <span className="text-lg">🇮🇹</span>
                        <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                            Cohort #1 — Italy Only — Limited Spots
                        </span>
                    </div>

                    <h2 className="text-3xl font-bold mb-6 text-[#1A1E3B] dark:text-white">
                        No Interviews?<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#383F74] to-[#4d84d4] dark:from-[#FFF272] dark:to-[#F59E0B]">
                            It's not you, it's your Proof.
                        </span>
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                        Companies don't hire "AI enthusiasts". They hire <strong>builders with proof</strong>.<br />
                        Career OS helps you build it in 8 weeks.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/career-os"
                            className="px-8 py-3 rounded-full bg-[#1A1E3B] text-white font-bold hover:bg-[#383F74] transition-all shadow-lg"
                        >
                            Apply for Cohort #1
                        </Link>
                        <a
                            href="#articles"
                            className="px-8 py-3 rounded-full border border-slate-300 dark:border-slate-700 font-semibold hover:bg-white hover:text-[#1A1E3B] transition-all"
                        >
                            Keep Reading
                        </a>
                    </div>
                </div>
            </section>
        </>
    )
}
