"use client"

import { useState } from 'react'
import { DecisionRules, DecisionRule } from './DecisionRules'
import { Pitfalls, Pitfall } from './Pitfalls'
import { Sparkles, ChevronRight } from 'lucide-react'

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
        <div className={`mt-10 mb-16 not-prose ${className}`}>
            {/* Ultra-Minimalist Header - REMOVED */}

            <div className="flex flex-col gap-3">

                {/* SECTION: STRATEGIC ALIGNMENT (Ultra-Thin Style) */}
                {(geo.decisionRules || geo.pitfalls) && (
                    <div className="flex flex-col">
                        <button
                            onClick={() => setAlignmentOpen(!isAlignmentOpen)}
                            className="group relative flex items-center justify-between py-2.5 px-4 rounded-xl bg-white dark:bg-primary-950 border border-slate-100 dark:border-primary-500/10 shadow-sm hover:border-primary-500/20 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest bg-primary-500/5 px-2 py-0.5 rounded">01</span>
                                <h3 className="text-[12px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">Strategic Alignment</h3>
                                <div className={`w-1 h-1 rounded-full transition-colors duration-500 ${isAlignmentOpen ? 'bg-primary-500 animate-pulse' : 'bg-slate-200 dark:bg-slate-800'}`} />
                            </div>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`flex items-center justify-center w-6 h-6 transition-all duration-500 ${isAlignmentOpen ? 'rotate-90 text-primary-500' : 'rotate-0 text-slate-300'}`}>
                                    <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        </button>

                        <div className={`overflow-hidden transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isAlignmentOpen ? 'max-h-[2000px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0 pointer-events-none'}`}>
                            <div className="flex flex-col gap-8">
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
