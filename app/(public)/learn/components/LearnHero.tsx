'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLearnLocale, LearnLocaleToggle } from '@/lib/i18n'
import { ContributorCTA } from '@/components/ui/ContributorCTA'

interface LearnHeroProps {
    className?: string
}

/**
 * Hero section with integrated router - immediate decision point
 * 
 * Premium design with:
 * - Animated gradient mesh background
 * - Glassmorphism router cards
 * - Micro-animations and hover effects
 */
export function LearnHero({ className = '' }: LearnHeroProps) {
    const { t } = useLearnLocale()
    const [showContributorForm, setShowContributorForm] = useState(false)

    return (
        <section className={`relative overflow-hidden ${className}`}>
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 -z-10">
                {/* Primary gradient orbs */}
                <div className="absolute top-0 -left-40 w-80 h-80 bg-primary-500/30 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-[pulse_4s_ease-in-out_infinite]" />
                <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-amber-500/20 rounded-full blur-[80px] animate-[pulse_5s_ease-in-out_infinite]" />

                {/* Subtle grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                                          linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            <div className="relative space-y-12 py-8">
                {/* Language Toggle - top right */}
                <div className="flex justify-end">
                    <LearnLocaleToggle />
                </div>

                {/* Floating Badge */}
                <div className="text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-500/10 via-indigo-500/10 to-primary-500/10 border border-primary-500/20 text-sm font-medium text-primary-600 dark:text-primary-400 backdrop-blur-sm animate-[fadeIn_0.5s_ease-out]">
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        stAItuned Learn
                    </span>
                </div>

                {/* H1 + Subtitle + Slogan */}
                <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                        <span className="bg-gradient-to-br from-slate-900 via-slate-700 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                            {t.hero.title}
                        </span>
                    </h1>

                    <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                        {t.hero.subtitle}
                    </p>

                    {t.hero.slogan && (
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary-500/25 animate-[fadeIn_0.8s_ease-out]">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping opacity-75" />
                            {t.hero.slogan}
                        </div>
                    )}
                </div>

                {/* Router Section - Decision Point */}
                <div className="space-y-8">
                    {/* Router Header */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                            {t.router.title}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            {t.router.subtitle}
                        </p>
                    </div>

                    {/* Two Router Cards - Glassmorphism */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto px-4">
                        {/* Card A: Read & Write */}
                        <div className="group relative">
                            {/* Animated gradient border */}
                            <div className="absolute -inset-[2px] bg-gradient-to-br from-primary-500 via-amber-500 to-primary-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500" />
                            <div className="absolute -inset-[1px] bg-gradient-to-br from-primary-500 via-amber-500 to-primary-600 rounded-3xl opacity-0 group-hover:opacity-70 transition-all duration-500" />

                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-amber-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative h-full flex flex-col rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-gradient-to-r from-primary-500/10 to-amber-500/10 border border-primary-500/20 mb-4">
                                    <span className="text-xl">{t.router.read.badge.split(' ')[0]}</span>
                                    <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                                        {t.router.read.badge.split(' ').slice(1).join(' ')}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {t.router.read.title}
                                </h3>

                                {/* Description */}
                                <p className="text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                                    {t.router.read.description}
                                </p>

                                {/* Features */}
                                <ul className="space-y-3 mb-6 flex-grow">
                                    {t.router.read.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-amber-500 flex items-center justify-center mt-0.5">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTAs */}
                                <div className="space-y-3">
                                    <Link
                                        href="/learn/articles"
                                        className="group/btn flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:from-primary-500 hover:to-primary-400 transition-all duration-300"
                                    >
                                        {t.router.read.ctaPrimary}
                                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                    <button
                                        onClick={() => setShowContributorForm(!showContributorForm)}
                                        className="w-full text-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors py-2"
                                    >
                                        {t.router.read.ctaSecondary}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card B: Build & Ship */}
                        <div className="group relative">
                            {/* Animated gradient border */}
                            <div className="absolute -inset-[2px] bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500" />
                            <div className="absolute -inset-[1px] bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-70 transition-all duration-500" />

                            {/* Glow effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative h-full flex flex-col rounded-3xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-4">
                                    <span className="text-xl">{t.router.build.badge.split(' ')[0]}</span>
                                    <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                                        {t.router.build.badge.split(' ').slice(1).join(' ')}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {t.router.build.title}
                                </h3>

                                {/* Description */}
                                <p className="text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                                    {t.router.build.description}
                                </p>

                                {/* Features */}
                                <ul className="space-y-3 mb-6 flex-grow">
                                    {t.router.build.features.map((feature, index) => (
                                        <li key={index} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mt-0.5">
                                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTAs */}
                                <div className="space-y-3">
                                    <Link
                                        href="/lab"
                                        className="group/btn flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300"
                                    >
                                        {t.router.build.ctaPrimary}
                                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                    <Link
                                        href="/lab#how-it-works"
                                        className="block w-full text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors py-2"
                                    >
                                        {t.router.build.ctaSecondary}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Micro-proof line */}
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            {t.hero.microProof.free}
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            {t.hero.microProof.noPaywall}
                        </span>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-400 font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                            </svg>
                            {t.hero.microProof.review}
                        </span>
                    </div>
                </div>

                {/* Collapsible Contributor Form */}
                {showContributorForm && (
                    <div className="animate-in slide-in-from-top-4 duration-300 max-w-lg mx-auto px-4">
                        <ContributorCTA source="learn-hero" className="text-left" />
                    </div>
                )}
            </div>
        </section>
    )
}
