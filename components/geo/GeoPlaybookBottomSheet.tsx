"use client"

import { useEffect, useMemo, useState } from 'react'
import { Pitfalls, Pitfall } from './Pitfalls'
import { DecisionRules, DecisionRule } from './DecisionRules'
import { X, AlertTriangle, Sparkles } from 'lucide-react'

interface GeoData {
    pitfalls?: Pitfall[]
    decisionRules?: { rules: DecisionRule[] }
}

interface GeoPlaybookBottomSheetProps {
    geo?: GeoData
    articleSlug: string
    isOpen: boolean
    onClose: () => void
}

/**
 * Mobile-first playbook drawer opened from the action bar.
 * Focused on strategic execution: decision rules + pitfalls.
 * Discovery content (audience/definition/takeaways) lives above the article.
 */
export function GeoPlaybookBottomSheet({
    geo,
    articleSlug,
    isOpen,
    onClose
}: GeoPlaybookBottomSheetProps) {
    const tabs = useMemo(() => ([
        geo?.decisionRules?.rules?.length ? 'framework' : null,
        geo?.pitfalls?.length ? 'pitfalls' : null
    ].filter(Boolean) as Array<'framework' | 'pitfalls'>), [geo])

    const [activeTab, setActiveTab] = useState<'framework' | 'pitfalls'>(tabs[0] ?? 'framework')

    useEffect(() => {
        if (tabs.length && !tabs.includes(activeTab)) {
            setActiveTab(tabs[0])
        }
    }, [tabs, activeTab])

    if (!geo || tabs.length === 0) return null

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sheet */}
            <div className={`fixed bottom-0 left-0 right-0 z-[101] bg-white dark:bg-slate-900 rounded-t-2xl shadow-2xl transform transition-transform duration-300 max-h-[85vh] flex flex-col ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>

                {/* Handle */}
                <div className="flex justify-center p-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mb-1" />
                </div>

                {/* Header with Tabs */}
                <div className="px-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary-500" />
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Strategic Execution</h2>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 overflow-x-auto pb-0 -mb-px scrollbar-none">
                        {tabs.includes('framework') && (
                            <button
                                onClick={() => setActiveTab('framework')}
                                className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'framework' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
                            >
                                <Sparkles className="w-4 h-4" />
                                Framework
                            </button>
                        )}
                        {tabs.includes('pitfalls') && (
                            <button
                                onClick={() => setActiveTab('pitfalls')}
                                className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'pitfalls' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
                            >
                                <AlertTriangle className="w-4 h-4" />
                                Pitfalls
                            </button>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="overflow-y-auto p-4 pb-8 flex-1">
                    {activeTab === 'framework' && geo.decisionRules?.rules?.length ? (
                        <DecisionRules rules={geo.decisionRules.rules} />
                    ) : null}

                    {activeTab === 'pitfalls' && geo.pitfalls?.length ? (
                        <Pitfalls
                            pitfalls={geo.pitfalls}
                        />
                    ) : null}
                </div>
            </div>
        </>
    )
}
