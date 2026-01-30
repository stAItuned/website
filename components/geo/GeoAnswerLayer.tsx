"use client"

import { useState } from 'react'
import { AudienceFit } from './AudienceFit'
import { Users, BookOpen, Sparkles, ChevronLeft, ChevronRight, Zap, Clock } from 'lucide-react'

interface GeoData {
    quickAnswer?: {
        title?: string
        bullets: string[]
        oneThing?: string
    }
    audience?: {
        title?: string
        description: string
    }
    definition?: {
        term: string
        definition: string
    }
}

interface GeoAnswerLayerProps {
    geo: GeoData
    articleSlug: string
    className?: string
}

export function GeoAnswerLayer({
    geo,
    articleSlug,
    className = ""
}: GeoAnswerLayerProps) {
    const [takeawayIndex, setTakeawayIndex] = useState(0)

    const nextTakeaway = () => {
        if (geo.quickAnswer?.bullets) {
            setTakeawayIndex((prev) => (prev + 1) % geo.quickAnswer!.bullets.length)
        }
    }

    const prevTakeaway = () => {
        if (geo.quickAnswer?.bullets) {
            setTakeawayIndex((prev) => (prev - 1 + geo.quickAnswer!.bullets.length) % geo.quickAnswer!.bullets.length)
        }
    }

    if (!geo) return null

    const renderMarkdown = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g)
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <strong key={i} className="font-bold text-secondary-500">
                        {part.slice(2, -2)}
                    </strong>
                )
            }
            return part
        })
    }

    return (
        <div className={`not-prose mb-12 ${className}`}>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-primary-950 border-2 border-primary-100 dark:border-primary-500/20 shadow-2xl">
                {/* 1. Context Ribbon (Top) */}
                {/* 1. Context Ribbon - REMOVED for minimal look */}

                {/* 2. Main Executive Summary Body */}
                <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-stretch">
                    {/* Left: One Thing / Title */}
                    <div className="flex-1 flex flex-col justify-center gap-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 rounded-lg bg-secondary-500 text-primary-900 shadow-sm">
                                <Zap className="w-4 h-4 fill-primary-900" />
                            </div>
                            <h3 className="text-[11px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-[0.25em]">Key Takeaways</h3>
                        </div>

                        {geo.quickAnswer?.oneThing && (
                            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight">
                                {renderMarkdown(geo.quickAnswer.oneThing)}
                            </div>
                        )}
                    </div>

                    {/* Right: Takeaways Carousel */}
                    {geo.quickAnswer?.bullets && geo.quickAnswer.bullets.length > 0 && (
                        <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-primary-900/20 rounded-3xl p-6 border border-slate-100 dark:border-primary-500/10 min-h-[160px] relative group/carousel">
                            <div className="flex-1 flex items-center justify-center text-center">
                                <div className="text-[15px] sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed font-bold animate-in fade-in slide-in-from-right-4 duration-500" key={takeawayIndex}>
                                    {renderMarkdown(geo.quickAnswer.bullets[takeawayIndex])}
                                </div>
                            </div>

                            {/* Carousel Controls */}
                            {geo.quickAnswer.bullets.length > 1 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex gap-1.5">
                                        {geo.quickAnswer.bullets.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${takeawayIndex === idx ? 'w-6 bg-secondary-500' : 'w-1.5 bg-primary-200 dark:bg-primary-800'}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={prevTakeaway}
                                            className="p-1.5 rounded-full bg-white dark:bg-primary-800 border border-primary-100 dark:border-primary-700 shadow-sm hover:scale-110 active:scale-95 transition-all"
                                        >
                                            <ChevronLeft className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                        </button>
                                        <button
                                            onClick={nextTakeaway}
                                            className="p-1.5 rounded-full bg-white dark:bg-primary-800 border border-primary-100 dark:border-primary-700 shadow-sm hover:scale-110 active:scale-95 transition-all"
                                        >
                                            <ChevronRight className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
