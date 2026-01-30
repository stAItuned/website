"use client"

import { useState } from 'react'
import { AudienceFit } from './AudienceFit'
import { Users, BookOpen, Sparkles, ChevronLeft, ChevronRight, Zap, Clock, ChevronDown } from 'lucide-react'

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
        <div className={`not-prose mb-8 ${className}`}>
            {/* Mobile-optimized Container - Clean & Native feel */}
            <div className="space-y-4">

                {/* 1. Collapsible Audience (Who is for) */}
                {geo.audience && (
                    <div className="bg-primary-50 dark:bg-primary-900/10 rounded-xl border border-primary-100 dark:border-primary-800/30 overflow-hidden">
                        <button
                            onClick={() => setIsTargetExpanded(!isTargetExpanded)}
                            className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-primary-100/30 dark:hover:bg-primary-800/20"
                        >
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                <span className="text-xs font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider">Who is this for?</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-primary-400 transition-transform duration-300 ${isTargetExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`transition-all duration-300 ease-in-out ${isTargetExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-4 pb-4">
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                                    {geo.audience.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Collapsible Definition */}
                {geo.definition && (
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <button
                            onClick={() => setIsDefinitionExpanded(!isDefinitionExpanded)}
                            className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                        >
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                                <span className="text-xs font-bold text-secondary-700 dark:text-secondary-400 uppercase tracking-wider">Definition: {geo.definition.term}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-secondary-400 transition-transform duration-300 ${isDefinitionExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        <div className={`transition-all duration-300 ease-in-out ${isDefinitionExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-4 pb-4">
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                                    {geo.definition.definition}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Collapsible Key Takeaways */}
                {geo.quickAnswer && (
                    <div className="space-y-4">

                        {/* Always visible One Thing - High Impact */}
                        {geo.quickAnswer.oneThing && (
                            <div className="py-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1 rounded bg-secondary-100 dark:bg-secondary-900/30">
                                        <Zap className="w-3.5 h-3.5 text-secondary-600 dark:text-secondary-400" />
                                    </div>
                                    <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Key Takeaways</h3>
                                </div>
                                <div className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                                    {renderMarkdown(geo.quickAnswer.oneThing)}
                                </div>
                            </div>
                        )}

                        {/* Collapsible details/bullets */}
                        <button
                            onClick={() => setIsTakeawaysExpanded(!isTakeawaysExpanded)}
                            className="w-full flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800 text-slate-500"
                        >
                            <span className="text-xs font-bold uppercase tracking-wider">
                                {isTakeawaysExpanded ? 'Hide Key Breakdown' : 'Show Key Breakdown'}
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isTakeawaysExpanded ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Bullets - Collapsible part */}
                        {geo.quickAnswer.bullets && geo.quickAnswer.bullets.length > 0 && (
                            <div className={`transition-all duration-300 ease-in-out ${isTakeawaysExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                                <div className="space-y-3 pl-1 pb-2">
                                    {geo.quickAnswer.bullets.map((bullet, idx) => (
                                        <div key={idx} className="flex gap-3 items-start group">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-400/60 dark:bg-primary-500/60 shrink-0 group-hover:bg-secondary-500 transition-colors" />
                                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {renderMarkdown(bullet)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
