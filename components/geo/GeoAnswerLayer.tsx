"use client"

import { useState } from 'react'
import { Users, BookOpen, ChevronRight, Zap, ChevronDown, Sparkles, ChevronLeft } from 'lucide-react'

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
    const [isTargetExpanded, setIsTargetExpanded] = useState(false)
    const [isDefinitionExpanded, setIsDefinitionExpanded] = useState(false)
    const [isTakeawaysExpanded, setIsTakeawaysExpanded] = useState(false)
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
                    <strong key={i} className="font-bold text-slate-800 dark:text-slate-100">
                        {part.slice(2, -2)}
                    </strong>
                )
            }
            return part
        })
    }

    return (
        <div className={`not-prose mb-10 ${className}`}>
            <div className="space-y-4">

                {/* 1. Audience (Glass Dossier Style) */}
                {geo.audience && (
                    <div className="group relative rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/40 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-blue-500/20">
                        <button
                            onClick={() => setIsTargetExpanded(!isTargetExpanded)}
                            className="w-full flex items-center justify-between p-3.5 text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform duration-300">
                                    <Users className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-0.5">Target Audience</span>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Who is this for?</span>
                                </div>
                            </div>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 ${isTargetExpanded ? 'bg-slate-100 dark:bg-slate-800' : 'bg-transparent'}`}>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isTargetExpanded ? 'rotate-180 text-blue-500' : ''}`} />
                            </div>
                        </button>

                        <div className={`transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-hidden ${isTargetExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-4 pb-4 pt-1 ml-[44px]">
                                <div className="pl-4 border-l-2 border-blue-100 dark:border-blue-900/30">
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                        {geo.audience.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Definition (Glass Dossier Style) */}
                {geo.definition && (
                    <div className="group relative rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/40 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:border-purple-500/20">
                        <button
                            onClick={() => setIsDefinitionExpanded(!isDefinitionExpanded)}
                            className="w-full flex items-center justify-between p-3.5 text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-50/80 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform duration-300">
                                    <BookOpen className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-0.5">Core Concept</span>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        {geo.definition.term}
                                    </span>
                                </div>
                            </div>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 ${isDefinitionExpanded ? 'bg-slate-100 dark:bg-slate-800' : 'bg-transparent'}`}>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDefinitionExpanded ? 'rotate-180 text-purple-500' : ''}`} />
                            </div>
                        </button>

                        <div className={`transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] overflow-hidden ${isDefinitionExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-4 pb-4 pt-1 ml-[44px]">
                                <div className="pl-4 border-l-2 border-purple-100 dark:border-purple-900/30">
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                        {geo.definition.definition}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Key Takeaways (Premium Intelligence Card) */}
                {geo.quickAnswer && (
                    <div
                        onClick={() => setIsTakeawaysExpanded(!isTakeawaysExpanded)}
                        className="group cursor-pointer relative rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/60 backdrop-blur-md overflow-hidden shadow-sm hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] hover:border-amber-500/30 transition-all duration-300"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/80 dark:border-slate-800/50 bg-gradient-to-r from-slate-50/80 via-transparent to-transparent dark:from-slate-900/80 transition-colors group-hover:from-amber-50/30 dark:group-hover:from-amber-900/10">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 shadow-sm ring-1 ring-amber-500/10 dark:ring-amber-400/20 group-hover:scale-105 transition-transform duration-300">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors ">
                                    Strategic Briefing
                                </span>
                            </div>
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${isTakeawaysExpanded ? 'bg-amber-100/50 dark:bg-amber-900/30 rotate-180' : 'bg-transparent group-hover:bg-slate-100 dark:group-hover:bg-slate-800'}`}>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-colors duration-300 ${isTakeawaysExpanded ? 'text-amber-600 dark:text-amber-400' : 'group-hover:text-amber-500'}`} />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            {/* Primary Answer */}
                            {geo.quickAnswer.oneThing && (
                                <div className="mb-2">
                                    <p className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                                        {renderMarkdown(geo.quickAnswer.oneThing)}
                                    </p>
                                </div>
                            )}

                            {/* Carousel Details (Collapsible) */}
                            {geo.quickAnswer.bullets && geo.quickAnswer.bullets.length > 0 && (
                                <div className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${isTakeawaysExpanded ? 'max-h-[500px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'}`}>
                                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800/50 relative">
                                        {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-600">
                                            Deep Dive
                                        </div> */}

                                        <div className="relative group/carousel px-2">
                                            <div className="px-12 py-2 min-h-[90px] flex items-center justify-center text-center">
                                                <p className="text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in slide-in-from-right-4 duration-300" key={takeawayIndex}>
                                                    {renderMarkdown(geo.quickAnswer.bullets[takeawayIndex])}
                                                </p>
                                            </div>

                                            {/* Navigation Arrows */}
                                            {geo.quickAnswer.bullets.length > 1 && (
                                                <>
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); prevTakeaway(); }}
                                                            className="group/btn p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-200 dark:hover:border-amber-800/50 hover:shadow-lg hover:shadow-amber-500/10 hover:scale-105 transition-all active:scale-95"
                                                            aria-label="Previous takeaway"
                                                        >
                                                            <ChevronLeft className="w-5 h-5 group-hover/btn:-translate-x-0.5 transition-transform" />
                                                        </button>
                                                    </div>
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); nextTakeaway(); }}
                                                            className="group/btn p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-200 dark:hover:border-amber-800/50 hover:shadow-lg hover:shadow-amber-500/10 hover:scale-105 transition-all active:scale-95"
                                                            aria-label="Next takeaway"
                                                        >
                                                            <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
                                                        </button>
                                                    </div>
                                                </>
                                            )}

                                            {/* Dots Indicator */}
                                            {geo.quickAnswer.bullets.length > 1 && (
                                                <div className="mt-6 flex justify-center gap-2">
                                                    {geo.quickAnswer.bullets.map((_, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={(e) => { e.stopPropagation(); setTakeawayIndex(idx); }}
                                                            className={`h-1.5 rounded-full transition-all duration-300 ${takeawayIndex === idx ? 'w-8 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'w-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300'}`}
                                                            aria-label={`Go to takeaway ${idx + 1}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
