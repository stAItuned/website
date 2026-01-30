"use client"

import { useState } from 'react'
import { DecisionRules, DecisionRule } from './DecisionRules'
import { Pitfalls, Pitfall } from './Pitfalls'
import { Sparkles, ChevronRight, Share2 } from 'lucide-react'

interface GeoData {
    decisionRules?: {
        title?: string
        rules: DecisionRule[]
    }
    pitfalls?: Pitfall[]
}

interface GeoStrategicInsightsProps {
    geo: GeoData
    articleSlug: string
    className?: string
}

export function GeoStrategicInsights({
    geo,
    articleSlug,
    className = ""
}: GeoStrategicInsightsProps) {
    const [isAlignmentOpen, setAlignmentOpen] = useState(false)

    if (!geo) return null

    const hasStrategicContent =
        (geo.decisionRules && geo.decisionRules.rules.length > 0) ||
        (geo.pitfalls && geo.pitfalls.length > 0)

    if (!hasStrategicContent) return null

    return (
        <div className={`mt-2 mb-8 not-prose ${className}`}>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent my-8" />

            <div className="flex flex-col gap-2">

                {/* SECTION: STRATEGIC EXECUTION (Compact Premium Glass Toggle) */}
                {(geo.decisionRules || geo.pitfalls) && (
                    <div className="flex flex-col">
                        <button
                            onClick={() => setAlignmentOpen(!isAlignmentOpen)}
                            className="group relative flex items-center justify-between py-3 px-4 md:py-2.5 md:px-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/95 dark:bg-slate-900/60 backdrop-blur-md shadow-sm mobile-ring hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 ring-1 ring-blue-500/10 dark:ring-blue-400/10 md:ring-0"
                        >
                            {/* Glass Accent */}
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-500 transition-all duration-300">
                                    <Share2 className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex items-baseline gap-2.5">
                                    <h3 className="text-sm md:text-xs font-black text-slate-700 dark:text-slate-200 tracking-wider group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors !mt-1 !mb-1">Strategic Execution</h3>
                                    <span className="text-[13px] text-slate-400 dark:text-slate-500 uppercase tracking-widest opacity-80 whitespace-nowrap">
                                        Decision Framework & Risk Solutions
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`flex items-center justify-center w-6 h-6 rounded-full transition-all duration-500 ${isAlignmentOpen ? 'bg-blue-50 dark:bg-blue-900/20 rotate-90 text-blue-500' : 'bg-transparent rotate-0 text-slate-300 group-hover:bg-slate-50 dark:group-hover:bg-slate-800'}`}>
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </button>

                        <div className={`overflow-hidden transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isAlignmentOpen ? 'max-h-[2000px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0 pointer-events-none'}`}>
                            <div className="flex flex-col gap-4 pl-1">
                                {geo.decisionRules && geo.decisionRules.rules.length > 0 && (
                                    <DecisionRules rules={geo.decisionRules.rules} />
                                )}

                                {geo.pitfalls && geo.pitfalls.length > 0 && (
                                    <Pitfalls pitfalls={geo.pitfalls} />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
