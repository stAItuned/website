"use client"

import { useState } from 'react'
import { Users, BookOpen, ChevronDown } from 'lucide-react'

interface GeoData {
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
    articleSlug: _articleSlug,
    className = ""
}: GeoAnswerLayerProps) {
    const [isTargetExpanded, setIsTargetExpanded] = useState(false)
    const [isDefinitionExpanded, setIsDefinitionExpanded] = useState(false)

    if (!geo) return null

    return (
        <div className={`not-prose mb-10 ${className}`}>
            <div className="flex flex-col gap-4 pb-4 md:pb-0 items-stretch">

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
            </div>
        </div>
    )
}
