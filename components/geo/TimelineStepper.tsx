"use client"

import { Calendar, Info } from 'lucide-react'

export interface TimelineStep {
    title: string
    description: string
    period?: string
}

interface TimelineStepperProps {
    steps: TimelineStep[]
    className?: string
}

export function TimelineStepper({
    steps = [],
    className = ""
}: TimelineStepperProps) {
    if (!steps || steps.length === 0) return null

    return (
        <div className={`flex flex-col ${className}`}>
            {/* Unified Header Row */}
            <div className="flex items-center gap-4 px-1 group/header">
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-950 border border-primary-500/10 shadow-sm">
                        <Calendar className="w-3 h-3 text-primary-500" />
                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Implementation Phases</span>
                    </div>
                </div>

                {/* Horizontal Divider */}
                <div className="w-px h-4 bg-slate-200 dark:bg-primary-800/50 shrink-0" />

                {/* Explanation Text - Aligned on the same line */}
                <div className="flex items-center gap-2 min-w-0">
                    <Info className="w-3.5 h-3.5 text-primary-400/70 shrink-0" />
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-500 leading-none italic truncate sm:whitespace-normal m-0 p-0">
                        Phased roadmap to master the <span className="text-slate-800 dark:text-slate-200 font-bold">rollout timing</span> for these strategies.
                    </p>
                </div>

                <div className="hidden md:block flex-1 h-px bg-slate-100 dark:bg-primary-900/40 ml-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {steps.map((step, idx) => (
                    <div key={idx} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-primary-950 border border-slate-100 dark:border-primary-500/10 shadow-sm transition-all duration-500 hover:shadow-md p-5 flex flex-col items-start min-h-[110px]">
                        {/* Phase Header */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-1 h-6 bg-primary-500 rounded-full group-hover:scale-y-110 transition-transform origin-center duration-500" />
                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] leading-none">
                                {step.period || `Stage ${idx + 1}`}
                            </span>
                        </div>

                        <h4 className="text-[12px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight mb-2 leading-tight group-hover:text-primary-500 transition-colors duration-300">
                            {step.title}
                        </h4>

                        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-500 leading-relaxed italic">
                            {step.description}
                        </p>

                        {/* Modern Interaction Stripe */}
                        <div className="absolute bottom-0 left-5 right-5 h-[1.5px] bg-gradient-to-r from-transparent via-primary-500/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-700" />
                    </div>
                ))}
            </div>
        </div>
    )
}
