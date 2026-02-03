'use client'

import { useState, useEffect } from 'react'
import { Contribution, GeneratedOutline } from '@/lib/types/contributor'
import { useAuth } from '@/components/auth/AuthContext'
import { useAIUsage } from '@/lib/hooks/use-ai-usage'

interface StepOutlineProps {
    contribution: Contribution
    onNext: () => void
    translations: any
}

export function StepOutline({ contribution, onNext, translations }: StepOutlineProps) {
    const { user } = useAuth()
    const { getRemaining, refreshUsage, getResetTime } = useAIUsage()
    const [outline, setOutline] = useState<GeneratedOutline | null>(contribution.generatedOutline || null)
    const [loading, setLoading] = useState(false)
    const [limitReached, setLimitReached] = useState(false)

    // Generate Outline on mount (if missing)
    useEffect(() => {
        if (!outline && contribution.brief && contribution.interviewHistory && !limitReached) {
            // Check client side first to avoid unnecessary call
            // We use timeout to ensure hook has loaded (simple workaround) or just rely on server 429
            generateOutline()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const generateOutline = async () => {
        if (!user) return
        setLoading(true)
        try {
            const res = await fetch('/api/contributor/generate-outline', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user.getIdToken()}`
                },
                body: JSON.stringify({
                    brief: contribution.brief,
                    interviewHistory: contribution.interviewHistory,
                    language: contribution.language,
                    sources: contribution.sourceDiscovery?.sources.filter(s => s.selected)
                })
            })



            if (res.status === 429) {
                setLimitReached(true);
                refreshUsage();
                return;
            }

            const json = await res.json()
            if (json.success && json.data) {
                setOutline(json.data)
                // Save to DB
                await fetch('/api/contributor/save-progress', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await user.getIdToken()}`
                    },
                    body: JSON.stringify({
                        contributionId: contribution.id,
                        data: {
                            generatedOutline: json.data,
                            currentStep: 'outline'
                        }
                    })
                })
            }
        } catch (e) {
            console.error("Outline generation failed", e)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async () => {
        if (!user) return
        setLoading(true)
        try {
            await fetch('/api/contributor/save-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user.getIdToken()}`
                },
                body: JSON.stringify({
                    contributionId: contribution.id,
                    data: {
                        currentStep: 'review', // Done
                        status: 'draft'
                    }
                })
            })
            onNext()
        } catch (e) {
            console.error(e)
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!user || !outline) return
        setLoading(true)
        try {
            await fetch('/api/contributor/save-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await user.getIdToken()}`
                },
                body: JSON.stringify({
                    contributionId: contribution.id,
                    data: {
                        generatedOutline: outline,
                        currentStep: 'outline'
                    }
                })
            })
            // Maybe a toast here effectively, but for now just stop loading
        } catch (e) {
            console.error("Save failed", e)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-500 rounded-full animate-spin" />
                <p className="text-slate-500 animate-pulse">Generazione struttura articolo in corso...</p>
            </div>
        )
    }

    if (!outline) {
        if (limitReached || getRemaining('gemini', 'outlineGeneration') === 0) {
            return (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-10 rounded-xl border border-amber-200 dark:border-amber-800 text-center space-y-4 my-10">
                    <span className="text-4xl block mb-2">⏳</span>
                    <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100">Limite Giornaliero Raggiunto</h3>
                    <p className="text-amber-800 dark:text-amber-200">
                        Hai raggiunto il limite di generazioni outline per oggi. <br />
                        Riprova alle {getResetTime('gemini', 'outlineGeneration')}.
                    </p>
                    <button onClick={() => onNext()} className="text-sm underline text-amber-900 dark:text-amber-100 mt-4 block mx-auto">
                        Inizia a scrivere manualmente
                    </button>
                </div>
            )
        }

        return <div className="text-center py-10">Generazione fallita. <button onClick={generateOutline} className="underline">Riprova</button></div>
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">{translations.title}</h1>
                <p className="text-slate-500">{translations.desc}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Outline */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                        <input
                            value={outline.title}
                            onChange={(e) => setOutline({ ...outline, title: e.target.value })}
                            className="text-xl font-bold mb-4 border-b pb-2 dark:border-slate-700 w-full bg-transparent focus:outline-none focus:border-primary-500 transition-colors"
                            placeholder="Titolo Articolo"
                        />
                        <div className="space-y-6">
                            {outline.sections.map((section, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <input
                                            value={section.heading}
                                            onChange={(e) => {
                                                const newSections = [...outline.sections];
                                                newSections[idx].heading = e.target.value;
                                                setOutline({ ...outline, sections: newSections });
                                            }}
                                            className="text-lg font-semibold text-primary-600 dark:text-primary-400 w-full bg-transparent focus:outline-none border-b border-transparent focus:border-primary-500 transition-all"
                                            placeholder="Titolo Sezione"
                                        />
                                        <span className="text-xs text-slate-400 uppercase tracking-wider whitespace-nowrap ml-4">{section.type}</span>
                                    </div>
                                    <ul className="list-disc pl-5 space-y-2 text-slate-600 dark:text-slate-300 text-sm">
                                        {section.prompts.map((p, i) => (
                                            <li key={i} className="flex gap-2">
                                                <div className="flex-1">
                                                    <textarea
                                                        value={p}
                                                        onChange={(e) => {
                                                            const newSections = [...outline.sections];
                                                            newSections[idx].prompts[i] = e.target.value;
                                                            setOutline({ ...outline, sections: newSections });
                                                        }}
                                                        rows={2}
                                                        className="w-full bg-transparent border border-transparent hover:border-slate-200 focus:border-primary-500 rounded p-1 focus:outline-none resize-none transition-all"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        const newSections = [...outline.sections];
                                                        newSections[idx].prompts = newSections[idx].prompts.filter((_, pi) => pi !== i);
                                                        setOutline({ ...outline, sections: newSections });
                                                    }}
                                                    className="text-slate-300 hover:text-red-500"
                                                >
                                                    ×
                                                </button>
                                            </li>
                                        ))}
                                        <button
                                            onClick={() => {
                                                const newSections = [...outline.sections];
                                                newSections[idx].prompts.push("Nuovo punto...");
                                                setOutline({ ...outline, sections: newSections });
                                            }}
                                            className="text-xs text-primary-500 underline pl-1 pt-1"
                                        >
                                            + Aggiungi punto
                                        </button>
                                    </ul>
                                    {section.suggestedSources?.length > 0 && (
                                        <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-xs space-y-1">
                                            <p className="font-semibold text-slate-500">Fonti Suggerite:</p>
                                            {section.suggestedSources.map((s, si) => (
                                                <div key={si} className="flex gap-2">
                                                    <span>🔗</span>
                                                    <a href={s.sourceUrl} target="_blank" className="text-blue-500 hover:underline truncate">{s.sourceTitle}</a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: GEO & Quality */}
                <div className="space-y-6">
                    {/* Quality Score */}
                    <div className={`p-6 rounded-xl border ${outline.qualityChecklist.hasOriginalAngle ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                        <h3 className="font-bold mb-3">Quality Check</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <span>{outline.qualityChecklist.hasOriginalAngle ? '✅' : '⚠️'}</span>
                                Original Angle
                            </li>
                            <li className="flex items-center gap-2">
                                <span>✅</span>
                                Evidence: {outline.qualityChecklist.evidenceRatio}
                            </li>
                            <li className="flex items-center gap-2">
                                <span>{outline.qualityChecklist.targetAlignment ? '✅' : '⚠️'}</span>
                                Target Fit
                            </li>
                        </ul>
                    </div>

                    {/* GEO Data */}
                    <div className="bg-slate-900 text-slate-300 rounded-xl p-6 text-sm space-y-4">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <span>✨</span> AI Optimization
                        </h3>
                        <div>
                            <strong className="block text-slate-400 text-xs uppercase">Quick Answer</strong>
                            <p className="mt-1 italic">&quot;{outline.geoSuggestions.quickAnswer}&quot;</p>
                        </div>
                        <div>
                            <strong className="block text-slate-400 text-xs uppercase">Core Definition</strong>
                            <p className="mt-1">
                                <strong>{outline.geoSuggestions.definition.term}:</strong> {outline.geoSuggestions.definition.definition}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleSave}
                            className="w-full py-3 rounded-xl border border-primary-600 text-primary-600 dark:text-primary-400 font-bold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition"
                        >
                            Salva Modifiche
                        </button>
                        <button
                            onClick={handleApprove}
                            className="w-full py-4 rounded-xl bg-primary-600 text-white font-bold text-lg hover:bg-primary-500 shadow-lg transition"
                        >
                            {translations.approve}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
