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

/**
 * StepOutline - Renders the outline editor and planning sidebar.
 */
export function StepOutline({ contribution, onNext, translations }: StepOutlineProps) {
    const { user } = useAuth()
    const { getRemaining, refreshUsage, getResetTime, loading: usageLoading } = useAIUsage()
    const [outline, setOutline] = useState<GeneratedOutline | null>(contribution.generatedOutline || null)
    const [loading, setLoading] = useState(false)
    const [limitReached, setLimitReached] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [draftOutline, setDraftOutline] = useState<GeneratedOutline | null>(contribution.generatedOutline || null)

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
                    contributionId: contribution.id,
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

    const handleStartEdit = () => {
        if (!outline) return
        setDraftOutline(outline)
        setIsEditing(true)
    }

    const handleCancelEdit = () => {
        setDraftOutline(outline)
        setIsEditing(false)
    }

    const handleSaveEdit = async () => {
        if (!draftOutline) return
        setOutline(draftOutline)
        setIsEditing(false)
        await handleSave()
    }

    const handleExportMD = () => {
        if (!outline) return

        let md = `# ${outline.title}\n\n`

        outline.sections.forEach(section => {
            const sectionSources = section.suggestedSources?.length
                ? section.suggestedSources
                : section.integratedSources || [];
            md += `## ${section.heading}\n`
            md += `*Type: ${section.type}*\n\n`
            section.prompts.forEach(prompt => {
                md += `- ${prompt}\n`
            })
            if (sectionSources.length > 0) {
                md += `\n**Suggested Sources:**\n`
                sectionSources.forEach(s => {
                    md += `- [${s.sourceTitle}](${s.sourceUrl})\n`
                })
            }
            md += `\n`
        })

        md += `---\n\n`
        md += `### AI Optimization & Quality\n\n`
        md += `#### GEO Suggestions\n`
        md += `- **Quick Answer:** ${outline.geoSuggestions.quickAnswer}\n`
        md += `- **Core Definition (${outline.geoSuggestions.definition.term}):** ${outline.geoSuggestions.definition.definition}\n\n`

        md += `#### Quality Check\n`
        md += `- **Original Angle:** ${outline.qualityChecklist.hasOriginalAngle ? '✅ Yes' : '❌ No'}\n`
        md += `- **Evidence Ratio:** ${outline.qualityChecklist.evidenceRatio}\n`
        md += `- **Target Alignment:** ${outline.qualityChecklist.targetAlignment ? '✅ Yes' : '❌ No'}\n`

        const blob = new Blob([md], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `outline-${outline.title.toLowerCase().replace(/\s+/g, '-')}.md`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
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
        if (limitReached || (!usageLoading && getRemaining('gemini', 'outlineGeneration') === 0)) {
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

    const activeOutline = isEditing ? draftOutline : outline
    if (!activeOutline) return null

    const sectionCount = activeOutline.sections.length
    const totalSources = activeOutline.sections.reduce((acc, section) => {
        const sources = section.suggestedSources?.length
            ? section.suggestedSources
            : section.integratedSources || []
        return acc + sources.length
    }, 0)

    return (
        <div className="space-y-10 max-w-6xl xl:max-w-7xl mx-auto animate-fade-in">
            <div className="relative overflow-hidden rounded-3xl stai-glass-panel">
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'var(--stai-glow-layer)', opacity: 'var(--stai-glow-strength)' }} />
                <div className="relative p-8 md:p-10 space-y-6">
                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[color:var(--stai-accent)]">
                            Outline + Planning
                        </p>
                        <h1 className="text-3xl md:text-4xl font-bold stai-text">
                            {translations.title}
                        </h1>
                        <p className="stai-text-muted max-w-2xl">
                            {translations.desc}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <div className="px-4 py-2 rounded-full text-sm font-semibold stai-glass-panel">
                            Sezioni: {sectionCount}
                        </div>
                        <div className="px-4 py-2 rounded-full text-sm font-semibold stai-glass-panel">
                            Fonti: {totalSources}
                        </div>
                        <div className="px-4 py-2 rounded-full text-sm font-semibold stai-glass-panel">
                            Evidence: {outline.qualityChecklist.evidenceRatio}
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={handleStartEdit}
                                    className="px-5 py-3 rounded-xl bg-[color:var(--stai-accent)] text-white font-semibold shadow-lg shadow-[rgba(20,24,49,0.2)] hover:opacity-90 transition-all duration-300"
                                >
                                    Modifica Outline
                                </button>
                                <button
                                    onClick={handleApprove}
                                    className="px-5 py-3 rounded-xl border stai-border stai-text font-semibold hover:bg-[rgba(var(--stai-surface-rgb),0.7)] transition-all duration-300"
                                >
                                    {translations.approve}
                                </button>
                                <button
                                    onClick={handleExportMD}
                                    className="px-5 py-3 rounded-xl stai-glass-panel font-semibold hover:translate-y-0.5 transition-all duration-300"
                                >
                                    {translations.exportMD || 'Esporta MD'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-5 py-3 rounded-xl bg-[color:var(--stai-accent)] text-white font-semibold shadow-lg shadow-[rgba(20,24,49,0.2)] hover:opacity-90 transition-all duration-300"
                                >
                                    Salva Modifiche
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="px-5 py-3 rounded-xl stai-glass-panel font-semibold hover:translate-y-0.5 transition-all duration-300"
                                >
                                    Annulla
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-10">
                <div className="space-y-6">
                    <div className="stai-glass-panel rounded-3xl p-6 md:p-8">
                        {isEditing ? (
                            <input
                                value={activeOutline.title}
                                onChange={(e) => setDraftOutline(prev => prev ? { ...prev, title: e.target.value } : prev)}
                                className="text-2xl md:text-3xl font-bold mb-6 border-b stai-border w-full bg-transparent focus:outline-none focus:border-[color:var(--stai-accent)] transition-all duration-300"
                                placeholder="Titolo Articolo"
                            />
                        ) : (
                            <h2 className="text-2xl md:text-3xl font-bold mb-6 stai-text">
                                {activeOutline.title}
                            </h2>
                        )}
                        <div className="space-y-8">
                            {activeOutline.sections.map((section, idx) => {
                                const sectionSources = section.suggestedSources?.length
                                    ? section.suggestedSources
                                    : section.integratedSources || []

                                return (
                                    <div
                                        key={idx}
                                        className="rounded-2xl stai-glass-panel p-5 md:p-6 space-y-4 transition-all duration-300 hover:-translate-y-0.5"
                                    >
                                        <div className="h-1 w-12 rounded-full bg-[color:var(--stai-accent-strong)]" />
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            {isEditing ? (
                                                <input
                                                    value={section.heading}
                                                    onChange={(e) => {
                                                        if (!draftOutline) return
                                                        const newSections = [...draftOutline.sections];
                                                        newSections[idx].heading = e.target.value;
                                                        setDraftOutline({ ...draftOutline, sections: newSections });
                                                    }}
                                                    className="text-lg md:text-xl font-semibold stai-text w-full bg-transparent focus:outline-none border-b border-transparent focus:border-[color:var(--stai-accent)] transition-all duration-300"
                                                    placeholder="Titolo Sezione"
                                                />
                                            ) : (
                                                <h3 className="text-lg md:text-xl font-semibold stai-text">
                                                    {section.heading}
                                                </h3>
                                            )}
                                            <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-[rgba(var(--stai-surface-strong-rgb),0.7)] stai-text-muted">
                                                {section.type}
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            {section.prompts.map((p, i) => (
                                                <div key={i} className="flex items-start gap-3 rounded-xl border stai-border bg-[rgba(var(--stai-surface-rgb),0.7)] p-3 shadow-sm">
                                                    <span className="mt-2 h-2 w-2 rounded-full bg-[color:var(--stai-accent)]" />
                                                    {isEditing ? (
                                                        <>
                                                            <textarea
                                                                value={p}
                                                                onChange={(e) => {
                                                                    if (!draftOutline) return
                                                                    const newSections = [...draftOutline.sections];
                                                                    newSections[idx].prompts[i] = e.target.value;
                                                                    setDraftOutline({ ...draftOutline, sections: newSections });
                                                                }}
                                                                rows={Math.max(2, Math.ceil(p.length / 90))}
                                                                className="w-full bg-[rgba(var(--stai-surface-strong-rgb),0.8)] border stai-border rounded-xl p-3 text-sm md:text-base stai-text focus:outline-none focus:border-[color:var(--stai-accent)] transition-all duration-300 resize-none shadow-sm"
                                                            />
                                                            <button
                                                                onClick={() => {
                                                                    if (!draftOutline) return
                                                                    const newSections = [...draftOutline.sections];
                                                                    newSections[idx].prompts = newSections[idx].prompts.filter((_, pi) => pi !== i);
                                                                    setDraftOutline({ ...draftOutline, sections: newSections });
                                                                }}
                                                                className="mt-2 stai-text-muted hover:text-red-500 transition-colors"
                                                                aria-label="Rimuovi punto"
                                                            >
                                                                ×
                                                            </button>
                                                        </>
                                                    ) : (
                                                    <p className="text-sm md:text-base stai-text">
                                                        {p}
                                                    </p>
                                                    )}
                                                </div>
                                            ))}
                                            {isEditing && (
                                                <button
                                                    onClick={() => {
                                                        if (!draftOutline) return
                                                        const newSections = [...draftOutline.sections];
                                                        newSections[idx].prompts.push('Nuovo punto...');
                                                        setDraftOutline({ ...draftOutline, sections: newSections });
                                                    }}
                                                    className="text-sm font-semibold text-[color:var(--stai-accent)] hover:opacity-80 transition-colors"
                                                >
                                                    + Aggiungi punto
                                                </button>
                                            )}
                                        </div>
                                        {sectionSources.length > 0 && (
                                            <div className="rounded-xl border stai-border bg-[rgba(var(--stai-surface-strong-rgb),0.85)] p-4 space-y-2 text-xs shadow-sm">
                                                <p className="font-semibold stai-text-muted uppercase tracking-wider">Fonti</p>
                                                {sectionSources.map((s, si) => (
                                                    <div key={si} className="space-y-1">
                                                        <a
                                                            href={s.sourceUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="block text-[color:var(--stai-accent)] hover:opacity-80 transition-colors truncate"
                                                        >
                                                            {s.sourceTitle}
                                                        </a>
                                                        {s.context && (
                                                            <p className="stai-text-muted">{s.context}</p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="stai-glass-panel rounded-3xl p-6">
                        <h3 className="text-sm font-semibold uppercase tracking-widest stai-text-muted mb-4">Quality Check</h3>
                        <div className="space-y-3 text-sm stai-text">
                            <div className="flex items-center justify-between">
                                <span>Original Angle</span>
                                <span className="font-semibold">{outline.qualityChecklist.hasOriginalAngle ? 'OK' : 'Check'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Evidence Ratio</span>
                                <span className="font-semibold">{outline.qualityChecklist.evidenceRatio}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Target Fit</span>
                                <span className="font-semibold">{outline.qualityChecklist.targetAlignment ? 'OK' : 'Check'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl stai-glass-panel p-6 space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-widest stai-text-muted">AI Optimization</h3>
                        <div>
                            <p className="text-xs uppercase tracking-widest stai-text-muted">Quick Answer</p>
                            <p className="mt-2 text-sm italic stai-text">&quot;{outline.geoSuggestions.quickAnswer}&quot;</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-widest stai-text-muted">Core Definition</p>
                            <p className="mt-2 text-sm stai-text">
                                <span className="font-semibold">{outline.geoSuggestions.definition.term}:</span>{' '}
                                {outline.geoSuggestions.definition.definition}
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}
