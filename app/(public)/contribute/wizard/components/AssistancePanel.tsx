import { motion, AnimatePresence } from 'framer-motion'
import { AssistanceSuggestion, AssistanceType } from '@/lib/types/contributor'

interface AssistancePanelProps {
    isOpen: boolean
    onClose: () => void
    isLoading: boolean
    suggestions: AssistanceSuggestion[]
    onSelect: (text: string) => void
    onGenerateAnswer: () => void
    generatedAnswer: string | null
    isGeneratingAnswer: boolean
    cached: boolean
    model: string | null
    translations: any
    type: AssistanceType
}

export function AssistancePanel({
    isOpen,
    onClose,
    isLoading,
    suggestions,
    onSelect,
    onGenerateAnswer,
    generatedAnswer,
    isGeneratingAnswer,
    cached,
    model,
    translations,
    type
}: AssistancePanelProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-gradient-to-r from-primary-50/30 to-transparent dark:from-primary-950/10">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black tracking-tight dark:text-white flex items-center gap-2">
                                    <span className="text-2xl">✨</span>
                                    {translations.panelTitle}
                                </h3>
                                <div className="flex items-center gap-3">
                                    <p className="text-sm font-medium text-primary-600 dark:text-primary-400 uppercase tracking-widest">
                                        Focus: {translations.types?.[type] || type}
                                    </p>
                                    {cached && (
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-300 font-black uppercase tracking-tighter bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-700/50">
                                            {translations.cachedLabel || 'Da cache'}
                                        </span>
                                    )}
                                    {model && (
                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-700/50">
                                            Model: {model}
                                        </span>
                                    )}
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-slate-700/50">
                                        Powered by {(type === 'drafting' || type === 'definition') ? 'Gemini' : 'Perplexity'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-full space-y-6 py-20">
                                    <div className="relative">
                                        <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                                            <span className="text-2xl">🔍</span>
                                        </div>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                                            {(type === 'drafting' || type === 'definition') ? translations.draftLoading : translations.loading}
                                        </p>
                                        <p className="text-sm text-slate-500 max-w-[250px]">
                                            {(type === 'drafting' || type === 'definition')
                                                ? 'Il Writing Coach sta preparando 3 bozze di risposta basate sul tuo brief...'
                                                : 'Stiamo interrogando database autorevoli per trovare dati verificati.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            ) : suggestions.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex gap-3 text-sm text-blue-800 dark:text-blue-200">
                                        <span className="text-xl">ℹ️</span>
                                        <p>
                                            {(type === 'drafting' || type === 'definition')
                                                ? 'Scegli la bozza che preferisci. Potrai modificarla liberamente nell\'editor.'
                                                : 'Seleziona un suggerimento per integrarlo nella tua risposta. Ogni dato include il punteggio di autorità della fonte.'}
                                        </p>
                                    </div>

                                    {(type !== 'drafting' && type !== 'definition') && (
                                        <div className="space-y-3">
                                            <button
                                                onClick={onGenerateAnswer}
                                                disabled={isGeneratingAnswer}
                                                className="w-full py-3 rounded-xl font-black bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-lg"
                                            >
                                                {isGeneratingAnswer ? (translations.generatingAnswer || 'Sto generando una risposta...') : (translations.generateAnswerButton || 'Genera risposta dalle fonti')}
                                            </button>
                                            {generatedAnswer && (
                                                <div className="bg-white dark:bg-slate-800/40 rounded-2xl border border-primary-200 dark:border-primary-700/60 shadow-sm overflow-hidden">
                                                    <div className="px-5 py-3 border-b border-primary-100 dark:border-primary-800/60 bg-primary-50/60 dark:bg-primary-900/20">
                                                        <span className="text-[10px] font-black text-primary-700 dark:text-primary-300 uppercase tracking-widest">
                                                            {translations.generatedAnswerTitle || 'Risposta suggerita'}
                                                        </span>
                                                    </div>
                                                    <div className="p-5 space-y-4">
                                                        <p className="text-slate-900 dark:text-white font-semibold leading-relaxed">
                                                            "{generatedAnswer}"
                                                        </p>
                                                        <button
                                                            onClick={() => onSelect(generatedAnswer)}
                                                            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-black hover:opacity-90 transition transform active:scale-[0.98] shadow-lg shadow-slate-200 dark:shadow-none"
                                                        >
                                                            {translations.generatedAnswerUse || translations.useThis}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {suggestions.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary-400 dark:hover:border-primary-600 transition-all shadow-sm hover:shadow-md overflow-hidden"
                                        >
                                            {/* Card Header with Authority Score */}
                                            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/30">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <span className="text-base leading-none">🏢</span>
                                                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate">
                                                        {item.sourceTitle || ((type === 'drafting' || type === 'definition') ? 'Draft Option' : 'Fonte Esterna')}
                                                    </span>
                                                </div>
                                                {item.authorityScore !== undefined && (
                                                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                                                        <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${item.authorityScore > 80
                                                            ? 'bg-emerald-500 shadow-emerald-500/50'
                                                            : item.authorityScore > 50
                                                                ? 'bg-amber-500 shadow-amber-500/50'
                                                                : 'bg-slate-400 shadow-slate-400/50'
                                                            }`} />
                                                        <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">
                                                            {item.authorityScore}% Authority
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-5 space-y-4">
                                                <div className="space-y-2">
                                                    <p className="text-slate-900 dark:text-white font-semibold leading-relaxed">
                                                        "{item.text}"
                                                    </p>
                                                    {item.context && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800/50">
                                                            <span className="font-bold text-primary-600 dark:text-primary-400 not-italic mr-1">
                                                                {(type === 'drafting' || type === 'definition') ? translations.fitLabel : translations.relevanceLabel}:
                                                            </span>
                                                            {item.context}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                                                    {item.source && (
                                                        <a
                                                            href={item.source}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between group/link px-1"
                                                        >
                                                            <div className="flex items-center gap-2 overflow-hidden">
                                                                <span className="text-lg">📄</span>
                                                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate group-hover/link:text-primary-600 transition-colors">
                                                                    Vedi Fonte Originale
                                                                </span>
                                                            </div>
                                                            <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover/link:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                        </a>
                                                    )}

                                                    <button
                                                        onClick={() => onSelect(item.text)}
                                                        className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-black hover:opacity-90 transition transform active:scale-[0.98] shadow-lg shadow-slate-200 dark:shadow-none flex items-center justify-center gap-2"
                                                    >
                                                        {translations.useThis}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20 grayscale opacity-40">
                                    <span className="text-6xl">🏜️</span>
                                    <p className="text-slate-500 font-medium max-w-[200px]">{translations.noResults}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
