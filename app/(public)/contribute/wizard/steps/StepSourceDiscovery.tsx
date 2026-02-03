'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Contribution, SourceDiscoveryData } from '@/lib/types/contributor'
import { useAuth } from '@/components/auth/AuthContext'
import { useAIUsage } from '@/lib/hooks/use-ai-usage'

interface StepSourceDiscoveryProps {
    contribution: Contribution
    onNext: (discoveryData: SourceDiscoveryData) => void
    translations: any
    language: 'it' | 'en'
}

export function StepSourceDiscovery({ contribution, onNext, translations, language }: StepSourceDiscoveryProps) {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [discoveryData, setDiscoveryData] = useState<SourceDiscoveryData | null>(contribution.sourceDiscovery || null)
    const { getRemaining, refreshUsage, getResetTime } = useAIUsage()
    const [limitReached, setLimitReached] = useState(false)

    // Initial fetch if no data
    useEffect(() => {
        if (!discoveryData && !isLoading && !limitReached) {
            discoverSources()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const discoverSources = async () => {
        if (!user) return
        setIsLoading(true)
        setError(null)

        try {
            const res = await fetch('/api/contributor/discover-sources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user.getIdToken()}`
                },
                body: JSON.stringify({
                    brief: contribution.brief,
                    interviewHistory: contribution.interviewHistory,
                    language
                })
            })

            if (res.status === 429) {
                setLimitReached(true);
                refreshUsage();
                return;
            }

            const json = await res.json()

            if (json.success && json.data) {
                setDiscoveryData(json.data)
            } else {
                throw new Error(json.error?.message || 'Failed to discover sources')
            }
        } catch (err) {
            console.error(err)
            setError(translations.error || 'Errore nella ricerca delle fonti. Riprova.')
        } finally {
            setIsLoading(false)
        }
    }

    const toggleSource = (sourceId: string) => {
        if (!discoveryData) return

        const newSources = discoveryData.sources.map(s => {
            if (s.id === sourceId) {
                const newState = !s.selected
                // If selecting, auto-select all claims by default? Or none? Let's say none, user picks.
                // Actually, better UX: if I select a source, I likely want its content.
                // Let's auto-select top 2 claims if selecting source.
                return {
                    ...s,
                    selected: newState,
                    selectedClaims: newState ? s.usefulClaims.slice(0, 2) : [],
                    selectedEvidence: newState ? s.suggestedEvidence.slice(0, 1) : []
                }
            }
            return s
        })

        setDiscoveryData({ ...discoveryData, sources: newSources })
    }

    const toggleClaim = (sourceId: string, claim: string) => {
        if (!discoveryData) return
        const newSources = discoveryData.sources.map(s => {
            if (s.id === sourceId) {
                const isSelected = s.selectedClaims.includes(claim)
                return {
                    ...s,
                    selectedClaims: isSelected
                        ? s.selectedClaims.filter(c => c !== claim)
                        : [...s.selectedClaims, claim]
                }
            }
            return s
        })
        setDiscoveryData({ ...discoveryData, sources: newSources })
    }

    const handleNext = () => {
        if (discoveryData) {
            onNext(discoveryData)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
        if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200'
        return 'text-slate-600 bg-slate-50 border-slate-200'
    }

    return (
        <div className="space-y-8 max-w-3xl mx-auto pb-32">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{translations.title}</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                    {translations.subtitle}
                </p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-center">
                    {error}
                    <button onClick={discoverSources} className="ml-4 underline font-bold">Riprova</button>
                </div>
            )}

            {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-6 text-center">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">🔍</div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{translations.searching}</h3>
                        <p className="text-slate-500 text-sm mt-1">{translations.searchingDesc}</p>
                    </div>
                </div>
            ) : (!discoveryData && (limitReached || getRemaining('perplexity', 'sourceDiscovery') === 0)) ? (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-10 rounded-xl border border-amber-200 dark:border-amber-800 text-center space-y-4 my-10">
                    <span className="text-4xl block mb-2">⏳</span>
                    <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">Limite Giornaliero Raggiunto</h3>
                    <p className="text-amber-800 dark:text-amber-200">
                        Hai raggiunto il limite di ricerche fonti per oggi. <br />
                        Riprova alle {getResetTime('perplexity', 'sourceDiscovery')}.
                    </p>
                    <button onClick={() => onNext({ sources: [], discoveredAt: new Date().toISOString(), searchQuery: 'SKIPPED_LIMIT_REACHED' })} className="text-sm underline text-amber-900 dark:text-amber-100 mt-4 block mx-auto">
                        Salta questo passaggio
                    </button>
                </div>
            ) : discoveryData ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    {/* Sources List */}
                    {discoveryData.sources.map((source) => (
                        <div
                            key={source.id}
                            className={`
                                relative overflow-hidden rounded-2xl border-2 transition-all duration-300
                                ${source.selected
                                    ? 'border-primary-500 bg-white dark:bg-slate-800 shadow-lg'
                                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 opacity-80 hover:opacity-100 hover:border-primary-300'
                                }
                            `}
                        >
                            {/* Header / Selection Toggle */}
                            <div
                                onClick={() => toggleSource(source.id)}
                                className="p-5 flex items-start gap-4 cursor-pointer select-none"
                            >
                                <div className={`
                                    w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-colors
                                    ${source.selected ? 'bg-primary-500 border-primary-500' : 'border-slate-300 bg-white dark:bg-slate-700'}
                                `}>
                                    {source.selected && <span className="text-white text-sm font-bold">✓</span>}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight">
                                            {source.title}
                                        </h3>
                                        <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap border ${getScoreColor(source.authorityScore)}`}>
                                            {source.authorityScore}/100 Auth
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-400 mt-1 font-mono flex items-center gap-2">
                                        <span>{source.domain}</span>
                                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary-500" onClick={(e) => e.stopPropagation()}>
                                            ↗
                                        </a>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 italic">
                                        &quot;{source.relevanceReason}&quot;
                                    </p>
                                </div>
                            </div>

                            {/* Details (Claims) - Only visible if selected */}
                            <AnimatePresence>
                                {source.selected && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 px-5 pb-5"
                                    >
                                        <div className="pt-4 space-y-4">
                                            <div>
                                                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-wider">
                                                    {translations.claimsLabel || "Claims Utili"}
                                                </h4>
                                                <div className="space-y-2">
                                                    {source.usefulClaims.map((claim, idx) => (
                                                        <label key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700/50 cursor-pointer transition">
                                                            <input
                                                                type="checkbox"
                                                                checked={source.selectedClaims.includes(claim)}
                                                                onChange={() => toggleClaim(source.id, claim)}
                                                                className="mt-1 w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-gray-300"
                                                            />
                                                            <span className="text-sm text-slate-700 dark:text-slate-200">{claim}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-8 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-sm text-slate-500">
                            {discoveryData.sources.filter(s => s.selected).length} {translations.sourcesSelected}
                        </div>
                        <button
                            onClick={handleNext}
                            className="px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-500 shadow-xl transition transform hover:scale-105"
                        >
                            {translations.continueToOutline} →
                        </button>
                    </div>
                </motion.div>
            ) : null}
        </div>
    )
}
