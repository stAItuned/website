'use client'

import { TrendingUp, AlertTriangle, Users } from 'lucide-react'

// =============================================================================
// Data
// =============================================================================

const stats = [
    {
        icon: TrendingUp,
        value: '+56%',
        metric: 'Stipendio',
        label: 'Se decidi di specializzarti',
        source: 'PwC Jobs Barometer 2025',
        link: 'https://www.pwc.com/gx/en/issues/artificial-intelligence/ai-jobs-barometer.html',
    },
    {
        icon: AlertTriangle,
        value: '66%',
        metric: 'Ti Scarta',
        label: 'Se il tuo profilo è generico',
        source: 'Microsoft Work Trend 2024',
        link: 'https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part',
    },
    {
        icon: Users,
        value: '93%',
        metric: 'Non Trova',
        label: 'Talenti pronti (è la tua chance)',
        source: 'Insight Global Report 2025',
        link: 'https://insightglobal.com/2025-ai-in-hiring-report/',
    },
]

// =============================================================================
// Components
// =============================================================================

/**
 * BoldImpactCard Component
 * High-impact design with large numbers, strong gradients, and animated glow ring.
 */
function BoldImpactCard({ stat }: { stat: typeof stats[0] }) {
    return (
        <div className="group relative flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-[#FFF272]/30 transition-all duration-300 hover:scale-105 hover:border-[#FFF272] hover:shadow-[0_0_40px_-5px_rgba(255,242,114,0.5)]">
            {/* Animated glow ring */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-[#FFF272] via-[#F59E0B] to-[#FFF272] opacity-0 group-hover:opacity-30 blur-sm transition-opacity" />

            {/* Inner container */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Icon badge with pulse */}
                <div className="relative mb-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFF272] to-[#F59E0B] flex items-center justify-center shadow-lg shadow-[#FFF272]/30 group-hover:animate-pulse">
                        <stat.icon className="w-6 h-6 text-[#1A1E3B]" />
                    </div>
                    {/* Ping effect */}
                    <div className="absolute inset-0 rounded-full bg-[#FFF272] opacity-0 group-hover:opacity-50 group-hover:animate-ping" />
                </div>

                {/* HUGE value */}
                <div className="text-center mb-2">
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-[0_0_10px_rgba(255,242,114,0.5)]">
                        {stat.value}
                    </span>
                    <span className="block text-lg font-bold text-[#FFF272] uppercase tracking-wider mt-1">
                        {stat.metric}
                    </span>
                </div>

                {/* Label with line accent */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-0.5 bg-gradient-to-r from-transparent to-[#FFF272]/50" />
                    <p className="text-sm text-slate-300 text-center font-medium">
                        {stat.label}
                    </p>
                    <div className="w-6 h-0.5 bg-gradient-to-l from-transparent to-[#FFF272]/50" />
                </div>

                {/* Source badge */}
                <a
                    href={stat.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-400 hover:text-[#FFF272] hover:border-[#FFF272]/30 transition-all uppercase tracking-wider"
                >
                    {stat.source}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </a>
            </div>
        </div>
    )
}

// =============================================================================
// Main Component
// =============================================================================

export function MarketEvidence() {
    return (
        <div className="w-full max-w-5xl mx-auto mb-10 px-4">
            {/* Section label */}
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">
                📊 Dati di Mercato
            </p>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <BoldImpactCard key={i} stat={stat} />
                ))}
            </div>
        </div>
    )
}
