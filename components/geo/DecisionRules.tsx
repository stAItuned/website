"use client"

import { useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Zap, Info } from 'lucide-react'

export interface DecisionRule {
    if: string
    then: string
    example?: string
}

interface DecisionRulesProps {
    rules: DecisionRule[]
    className?: string
}

export function DecisionRules({
    rules = [],
    className = ""
}: DecisionRulesProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    if (!rules || rules.length === 0) return null

    const next = () => setCurrentIndex((prev) => (prev + 1) % rules.length)
    const prev = () => setCurrentIndex((prev) => (prev - 1 + rules.length) % rules.length)

    return (
        <div className={`relative flex flex-col ${className}`}>
            {/* Header (Clear & Visible) */}
            <div className="flex items-center gap-2 px-1 mb-2 group/header">
                <div className="flex items-center justify-center w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 shadow-sm ring-1 ring-blue-500/10">
                    <Zap className="w-3 h-3" />
                </div>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                    Decision Framework
                </span>
            </div>

            {/* The Compact Modern Logic Card */}
            <div className="group relative overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-blue-500/20 transition-all duration-500 ease-in-out">
                {/* Visual Glass Accent */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-full flex transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1)" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {rules.map((rule, idx) => (
                        <div key={idx} className="w-full flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:min-h-[60px]">
                            {/* IF SIDE (Condition) */}
                            <div className="flex-1 px-5 py-3.5 flex flex-col justify-center bg-slate-50/50 dark:bg-slate-900/50 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-800/50">
                                <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                    If This Happens
                                </span>
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                                    {rule.if}
                                </p>
                            </div>

                            {/* MODERN CONNECTOR (Compact) */}
                            <div className="relative shrink-0 flex items-center justify-center -my-3 sm:my-0 sm:-mx-2.5 z-10 pointer-events-none">
                                <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-md text-blue-500 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:border-blue-500/30">
                                    <ArrowRight className="w-3.5 h-3.5 rotate-90 sm:rotate-0" strokeWidth={2.5} />
                                </div>
                            </div>

                            {/* THEN SIDE (Execution) */}
                            <div className="flex-1 px-5 py-3.5 flex flex-col justify-center bg-white/50 dark:bg-slate-900/20">
                                <span className="text-[9px] font-extrabold text-blue-500 dark:text-blue-400 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                                    Do This
                                </span>
                                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                                    {rule.then}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* DYNAMIC NAVIGATION BUTTONS */}
                {rules.length > 1 && (
                    <>
                        <div className="absolute left-0 inset-y-0 flex items-center z-20 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={prev}
                                className="p-1 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 backdrop-blur text-slate-400 hover:text-blue-500 hover:border-blue-200 dark:hover:border-blue-800 shadow-sm transition-all active:scale-95"
                                aria-label="Previous rule"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="absolute right-0 inset-y-0 flex items-center z-20 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={next}
                                className="p-1 rounded-lg bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 backdrop-blur text-slate-400 hover:text-blue-500 hover:border-blue-200 dark:hover:border-blue-800 shadow-sm transition-all active:scale-95"
                                aria-label="Next rule"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* MODERN DOT INDICATOR */}
            {rules.length > 1 && (
                <div className="mt-2 flex justify-center gap-1">
                    {rules.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-0.5 rounded-full transition-all duration-500 ease-in-out ${currentIndex === idx ? 'w-4 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]' : 'w-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}
                            aria-label={`Go to rule ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
