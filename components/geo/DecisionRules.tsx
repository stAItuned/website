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
            {/* Unified Header Row */}
            <div className="flex items-center gap-4 px-1 group/header">
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950 border border-primary-500/10 shadow-sm">
                        <Zap className="w-3 h-3 text-primary-500" />
                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Decision Rules</span>
                    </div>
                </div>

                {/* Horizontal Divider */}
                <div className="w-px h-4 bg-slate-200 dark:bg-primary-800/50 shrink-0" />

                {/* Explanation Text - Aligned on the same line */}
                <div className="flex items-center gap-2 min-w-0">
                    <Info className="w-3.5 h-3.5 text-primary-400/70 shrink-0" />
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-500 leading-none italic truncate sm:whitespace-normal !mb-0">
                        Logic shortcuts to pick the <span className="text-slate-800 dark:text-slate-200 font-bold">best move</span> for your situation.
                    </p>
                </div>

                {/* Spacer & Counter */}
                <div className="hidden md:block flex-1 h-px bg-slate-100 dark:bg-primary-900/40" />

                {rules.length > 1 && (
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tabular-nums tracking-widest group-hover/header:text-primary-500 transition-colors">
                            {currentIndex + 1} <span className="opacity-30">/</span> {rules.length}
                        </span>
                    </div>
                )}
            </div>

            {/* The Modern Logic Card */}
            <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-primary-950 border border-slate-100 dark:border-primary-500/10 shadow-sm hover:shadow-md transition-all duration-500 ease-in-out">
                {/* Visual Glass Accent */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="w-full flex transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1)" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {rules.map((rule, idx) => (
                        <div key={idx} className="w-full flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:min-h-[72px]">
                            {/* IF SIDE (Condition) */}
                            <div className="flex-1 px-10 py-5 flex flex-col justify-center bg-slate-50/20 dark:bg-primary-900/5">
                                <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500" />
                                    If This Happens
                                </span>
                                <p className="text-[12px] sm:text-[13px] font-medium text-slate-700 dark:text-slate-300 leading-tight">
                                    {rule.if}
                                </p>
                            </div>

                            {/* MODERN POISED CONNECTOR */}
                            <div className="relative shrink-0 flex items-center justify-center py-2 sm:py-0">
                                <div className="hidden sm:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-slate-100 dark:bg-primary-900/40" />
                                <div className="relative z-10 w-10 h-10 rounded-full bg-primary-500 text-white shadow-lg shadow-primary-500/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-primary-500/40">
                                    <ArrowRight className="w-5 h-5 rotate-90 sm:rotate-0" strokeWidth={3} />
                                </div>
                            </div>

                            {/* THEN SIDE (Execution) */}
                            <div className="flex-1 px-10 py-5 flex flex-col justify-center">
                                <span className="text-[9px] font-extrabold text-primary-600 dark:text-primary-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-1.5">
                                    <div className="w-1 h-1 rounded-full bg-primary-500" />
                                    Execute This
                                </span>
                                <p className="text-[13px] sm:text-[14px] font-bold text-slate-900 dark:text-white leading-tight">
                                    {rule.then}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* DYNAMIC NAVIGATION BUTTONS */}
                {rules.length > 1 && (
                    <>
                        <div className="absolute left-2 inset-y-0 flex items-center z-20">
                            <button
                                onClick={prev}
                                className="group/btn p-2 rounded-xl bg-white/95 dark:bg-primary-900/95 border border-slate-200 dark:border-primary-800 shadow-lg text-slate-400 hover:text-primary-500 hover:scale-115 hover:shadow-primary-500/20 transition-all duration-300 active:scale-95"
                                aria-label="Previous rule"
                            >
                                <ChevronLeft className="w-4 h-4 group-hover/btn:-translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                        <div className="absolute right-2 inset-y-0 flex items-center z-20">
                            <button
                                onClick={next}
                                className="group/btn p-2 rounded-xl bg-white/95 dark:bg-primary-900/95 border border-slate-200 dark:border-primary-800 shadow-lg text-slate-400 hover:text-primary-500 hover:scale-115 hover:shadow-primary-500/20 transition-all duration-300 active:scale-95"
                                aria-label="Next rule"
                            >
                                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* MODERN DOT INDICATOR */}
            {rules.length > 1 && (
                <div className="mt-5 flex justify-center gap-2">
                    {rules.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-[2px] rounded-full transition-all duration-700 ease-in-out ${currentIndex === idx ? 'w-10 bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.3)]' : 'w-2 bg-slate-200 dark:bg-primary-900/60 hover:bg-slate-300'}`}
                            aria-label={`Go to rule ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
