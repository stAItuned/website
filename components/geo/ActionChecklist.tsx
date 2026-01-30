"use client"

import { useState, useEffect } from 'react'
import { Check, ChevronLeft, ChevronRight, Target, Info } from 'lucide-react'

interface ActionChecklistProps {
    articleSlug: string
    items: string[]
    className?: string
}

export function ActionChecklist({
    articleSlug,
    items = [],
    className = ""
}: ActionChecklistProps) {
    const storageKey = `checklist_${articleSlug}`
    const [checkedIndices, setCheckedIndices] = useState<number[]>([])
    const [mounted, setMounted] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem(storageKey)
        if (saved) {
            try {
                setCheckedIndices(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse checklist progress", e)
            }
        }
    }, [storageKey])

    useEffect(() => {
        if (mounted) {
            localStorage.setItem(storageKey, JSON.stringify(checkedIndices))
        }
    }, [checkedIndices, mounted, storageKey])

    const toggleItem = (index: number) => {
        setCheckedIndices(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        )
    }

    const next = () => setCurrentIndex((prev) => (prev + 1) % items.length)
    const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)

    if (!mounted || items.length === 0) return null

    return (
        <div className={`relative flex flex-col ${className}`}>
            {/* Unified Header Row */}
            <div className="flex items-center gap-4 px-1 group/header">
                <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-500/10 shadow-sm">
                        <Target className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Execution Roadmap</span>
                    </div>
                </div>

                {/* Horizontal Divider */}
                <div className="w-px h-4 bg-slate-200 dark:bg-primary-800/50 shrink-0" />

                {/* Explanation Text - Aligned on the same line */}
                <div className="flex items-center gap-2 min-w-0">
                    <Info className="w-3.5 h-3.5 text-emerald-400/70 shrink-0" />
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-500 leading-none italic truncate sm:whitespace-normal m-0 p-0">
                        Turn insights into <span className="text-slate-800 dark:text-slate-200 font-bold">measurable results</span> with step-by-step progress.
                    </p>
                </div>

                {/* Spacer & Progress */}
                <div className="hidden md:block flex-1 h-px bg-slate-100 dark:bg-primary-900/40 ml-4" />

                <div className="flex items-center gap-3 shrink-0 ml-auto">
                    <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tabular-nums tracking-widest">
                        {Math.round((checkedIndices.length / items.length) * 100)}%
                    </span>
                    <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest leading-none">Complete</span>
                </div>
            </div>

            <div className="group relative">
                {/* Modern Progress Line Container */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-slate-100 dark:bg-primary-900/20 z-10 overflow-hidden rounded-t-xl transition-all duration-500 group-hover:h-[2px]">
                    <div
                        className="bg-emerald-500 h-full transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                        style={{ width: `${(checkedIndices.length / items.length) * 100}%` }}
                    />
                </div>

                <div className="overflow-hidden rounded-2xl bg-white dark:bg-primary-950 border border-slate-100 dark:border-primary-500/10 shadow-sm hover:shadow-md transition-all duration-500">
                    <div className="w-full flex transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1)" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {items.map((item, idx) => {
                            const isChecked = checkedIndices.includes(idx)
                            return (
                                <div key={idx} className="w-full flex-shrink-0 px-12 py-6 flex items-center justify-center min-h-[64px]">
                                    <label className="flex items-center gap-4 cursor-pointer w-full justify-center group/item hover:scale-[1.01] transition-transform">
                                        {/* Premium Checkbox */}
                                        <div
                                            onClick={(e) => { e.preventDefault(); toggleItem(idx); }}
                                            className={`flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-lg border-2 transition-all duration-300 ${isChecked ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 'bg-white dark:bg-primary-900 border-slate-200 dark:border-primary-700 group-hover/item:border-emerald-400'}`}
                                        >
                                            <Check className={`w-3.5 h-3.5 transition-all duration-300 ${isChecked ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} strokeWidth={4} />
                                        </div>
                                        <span className={`text-[13px] font-medium leading-tight transition-all duration-300 text-center ${isChecked ? 'text-slate-400 line-through opacity-60' : 'text-slate-700 dark:text-slate-200'}`}>
                                            {item}
                                        </span>
                                    </label>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* DYNAMIC NAVIGATION BUTTONS */}
                {items.length > 1 && (
                    <>
                        <div className="absolute left-2 inset-y-0 flex items-center z-20">
                            <button
                                onClick={prev}
                                className="group/btn p-2 rounded-xl bg-white/95 dark:bg-primary-900/95 border border-slate-200 dark:border-primary-800 shadow-lg text-slate-400 hover:text-emerald-500 hover:scale-115 hover:shadow-emerald-500/20 transition-all duration-300 active:scale-95"
                                aria-label="Previous step"
                            >
                                <ChevronLeft className="w-4 h-4 group-hover/btn:-translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                        <div className="absolute right-2 inset-y-0 flex items-center z-20">
                            <button
                                onClick={next}
                                className="group/btn p-2 rounded-xl bg-white/95 dark:bg-primary-900/95 border border-slate-200 dark:border-primary-800 shadow-lg text-slate-400 hover:text-emerald-500 hover:scale-115 hover:shadow-emerald-500/20 transition-all duration-300 active:scale-95"
                                aria-label="Next step"
                            >
                                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* MODERN DOT INDICATOR */}
            {items.length > 1 && (
                <div className="mt-5 flex justify-center gap-2">
                    {items.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-[2px] rounded-full transition-all duration-700 ease-in-out ${currentIndex === idx ? 'w-10 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'w-2 bg-slate-200 dark:bg-primary-900/60 hover:bg-slate-300'}`}
                            aria-label={`Go to item ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
