"use client"

import { Users } from 'lucide-react'

export interface AudienceFitProps {
    title?: string
    description?: string
    className?: string
    compact?: boolean
}

export function AudienceFit({
    title = "Who is this for?",
    description,
    className = "",
    compact = false
}: AudienceFitProps) {
    if (!description) return null
    if (compact) {
        return (
            <div className={`group flex flex-col items-center text-center gap-3 p-6 rounded-[1.5rem] bg-white dark:bg-primary-900/40 border-2 border-primary-100 dark:border-primary-500/20 shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 h-full ${className}`}>
                <div className="flex items-center gap-2 mb-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    <div className="p-1.5 rounded-lg bg-primary-500/10 dark:bg-primary-400/20 text-primary-500 dark:text-primary-400">
                        <Users className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-primary-600 dark:text-primary-300 text-[10px] uppercase tracking-[0.2em] whitespace-nowrap">
                        {title}
                    </span>
                </div>

                <div className="w-full text-slate-800 dark:text-slate-100 text-[15px] leading-relaxed font-bold">
                    {description}
                </div>
            </div>
        )
    }

    return (
        <div className={`flex items-start gap-5 p-6 rounded-[1.5rem] bg-white dark:bg-primary-900/40 border-2 border-primary-100 dark:border-primary-500/20 shadow-sm ${className}`}>
            <div className="flex-shrink-0 p-2.5 bg-primary-500/10 dark:bg-primary-500/20 rounded-xl border border-primary-500/10 dark:border-primary-500/20 text-primary-600 dark:text-primary-400">
                <Users className="w-5 h-5" />
            </div>
            <div>
                <h3 className="text-[10px] font-black text-primary-600 dark:text-primary-400 mb-1 uppercase tracking-[0.25em]">
                    {title}
                </h3>
                <p className="text-[15px] text-slate-800 dark:text-slate-100 leading-relaxed font-bold">
                    {description}
                </p>
            </div>
        </div>
    )
}
