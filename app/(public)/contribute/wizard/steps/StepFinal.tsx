'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthContext'
import { Contribution, GeneratedOutline, InterviewQnA } from '@/lib/types/contributor'

interface StepFinalProps {
    contribution: Contribution
}

export function StepFinal({ contribution }: StepFinalProps) {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState<'outline' | 'qna'>('outline')
    const [outline, setOutline] = useState<GeneratedOutline | null>(contribution.generatedOutline || null)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const interview = contribution.interviewHistory

    const handleSave = async () => {
        if (!user || !outline) return
        setSaving(true)
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
                        generatedOutline: outline
                    }
                })
            })
            // Could add a toast here
        } catch (e) {
            console.error("Save failed", e)
        } finally {
            setSaving(false)
        }
    }

    // Helper to render text with pseudo-markdown bold support
    const renderTextWithBold = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g)
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-bold text-slate-800 dark:text-slate-200">{part.slice(2, -2)}</strong>
            }
            return part
        })
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Ottimo lavoro! Contributo Salvato.
                </h1>
                <p className="text-slate-600 dark:text-slate-300">
                    Il tuo contributo è stato salvato correttamente. Da qui puoi rivedere la struttura generata e le tue risposte.
                </p>
                <Link
                    href="/contributor-dashboard"
                    className="inline-block px-6 py-2 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-500 transition"
                >
                    Torna alla Dashboard
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex justify-center border-b border-slate-200 dark:border-slate-700">
                <button
                    onClick={() => setActiveTab('outline')}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'outline'
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    Struttura Articolo
                </button>
                <button
                    onClick={() => setActiveTab('qna')}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === 'qna'
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    Le tue Risposte ({interview?.length || 0})
                </button>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {activeTab === 'outline' && outline && (
                    <motion.div
                        key="outline"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
                            {/* Decorative top border */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-500 via-purple-500 to-amber-500" />

                            <div className="flex justify-between items-start mb-8">
                                {isEditing ? (
                                    <input
                                        value={outline.title}
                                        onChange={(e) => setOutline({ ...outline, title: e.target.value })}
                                        className="text-3xl font-bold border-b-2 border-slate-100 dark:border-slate-700 pb-2 w-full bg-transparent focus:outline-none focus:border-primary-500 transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-600 mr-4"
                                        placeholder="Titolo Articolo"
                                    />
                                ) : (
                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white pb-2 border-b-2 border-transparent">
                                        {outline.title}
                                    </h2>
                                )}

                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${isEditing
                                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                        : 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30'
                                        }`}
                                >
                                    {isEditing ? 'Annulla' : '✏️ Modifica'}
                                </button>
                            </div>

                            <div className="space-y-12">
                                {outline.sections.map((section, idx) => (
                                    <div key={idx} className="group relative pl-4 border-l-2 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-baseline gap-4">
                                                {isEditing ? (
                                                    <input
                                                        value={section.heading}
                                                        onChange={(e) => {
                                                            const newSections = [...outline.sections];
                                                            newSections[idx].heading = e.target.value;
                                                            setOutline({ ...outline, sections: newSections });
                                                        }}
                                                        className="text-xl font-bold text-slate-800 dark:text-slate-100 w-full bg-transparent focus:outline-none focus:text-primary-600 dark:focus:text-primary-400 transition-colors"
                                                        placeholder="Titolo Sezione"
                                                    />
                                                ) : (
                                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                                        {section.heading}
                                                    </h3>
                                                )}
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                                                    {section.type}
                                                </span>
                                            </div>

                                            <ul className="space-y-3">
                                                {section.prompts.map((p, i) => (
                                                    <li key={i} className="flex gap-3 group/item">
                                                        <span className="text-primary-400 mt-1.5">•</span>
                                                        <div className="flex-1 relative">
                                                            {isEditing ? (
                                                                <textarea
                                                                    value={p}
                                                                    onChange={(e) => {
                                                                        const newSections = [...outline.sections];
                                                                        newSections[idx].prompts[i] = e.target.value;
                                                                        setOutline({ ...outline, sections: newSections });
                                                                    }}
                                                                    rows={Math.max(2, Math.ceil(p.length / 80))}
                                                                    className="w-full bg-transparent border-0 p-0 text-slate-600 dark:text-slate-300 focus:ring-0 resize-none font-medium leading-relaxed"
                                                                />
                                                            ) : (
                                                                <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                                                    {renderTextWithBold(p)}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {isEditing && (
                                                            <button
                                                                onClick={() => {
                                                                    const newSections = [...outline.sections];
                                                                    newSections[idx].prompts = newSections[idx].prompts.filter((_, pi) => pi !== i);
                                                                    setOutline({ ...outline, sections: newSections });
                                                                }}
                                                                className="opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-red-500 transition-opacity"
                                                            >
                                                                ×
                                                            </button>
                                                        )}
                                                    </li>
                                                ))}
                                                {isEditing && (
                                                    <button
                                                        onClick={() => {
                                                            const newSections = [...outline.sections];
                                                            newSections[idx].prompts.push("Nuovo punto...");
                                                            setOutline({ ...outline, sections: newSections });
                                                        }}
                                                        className="text-sm font-bold text-primary-500 hover:text-primary-600 flex items-center gap-1 mt-2 opacity-50 hover:opacity-100 transition-opacity"
                                                    >
                                                        <span>+</span> Aggiungi punto
                                                    </button>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sticky Save Action */}
                        {isEditing && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="sticky bottom-6 flex justify-end"
                            >
                                <button
                                    onClick={() => {
                                        handleSave();
                                        setIsEditing(false);
                                    }}
                                    disabled={saving}
                                    className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {saving ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Salvataggio...
                                        </>
                                    ) : (
                                        <>
                                            💾 Salva e Chiudi
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'qna' && interview && (
                    <motion.div
                        key="qna"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        {interview.map((qna, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                                <p className="font-bold text-slate-900 dark:text-white mb-2">{qna.question}</p>
                                <div className="pl-4 border-l-4 border-primary-200 dark:border-primary-900/50">
                                    <p className="text-slate-600 dark:text-slate-300 italic">
                                        "{qna.answer}"
                                    </p>
                                </div>
                                <div className="mt-3 flex justify-end">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">
                                        Impact: {qna.dataPoint}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
