"use client"

import { useState } from 'react'
import { QuickAnswerCard } from './QuickAnswerCard'
import { ActionChecklist } from './ActionChecklist'
import { TimelineStepper } from './TimelineStepper'
import { Pitfalls } from './Pitfalls'
import { AudienceFit } from './AudienceFit'
import { X, ListTodo, Zap, Calendar, AlertTriangle } from 'lucide-react'

interface GeoPlaybookBottomSheetProps {
    geo: any
    articleSlug: string
    isOpen: boolean
    onClose: () => void
}

export function GeoPlaybookBottomSheet({
    geo,
    articleSlug,
    isOpen,
    onClose
}: GeoPlaybookBottomSheetProps) {
    const [activeTab, setActiveTab] = useState<'answer' | 'checklist' | 'timeline' | 'pitfalls'>('answer')

    if (!geo) return null

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
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Key Resources</h2>
                        <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 overflow-x-auto pb-0 -mb-px scrollbar-none">
                        {geo.quickAnswer && (
                            <button
                                onClick={() => setActiveTab('answer')}
                                className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'answer' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
                            >
                                <Zap className="w-4 h-4" />
                                Quick Answer
                            </button>
                        )}
                        {geo.checklist && (
                            <button
                                onClick={() => setActiveTab('checklist')}
                                className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'checklist' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
                            >
                                <ListTodo className="w-4 h-4" />
                                Checklist
                            </button>
                        )}
                        {geo.timeline && (
                            <button
                                onClick={() => setActiveTab('timeline')}
                                className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'timeline' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}
                            >
                                <Calendar className="w-4 h-4" />
                                Timeline
                            </button>
                        )}
                        {geo.pitfalls && (
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
                    {activeTab === 'answer' && geo.quickAnswer && (
                        <div className="flex flex-col gap-6">
                            {geo.audience && (
                                <AudienceFit
                                    title={geo.audience.title}
                                    description={geo.audience.description}
                                />
                            )}
                            <QuickAnswerCard
                                title={geo.quickAnswer.title}
                                bullets={geo.quickAnswer.bullets}
                                oneThing={geo.quickAnswer.oneThing}
                            />
                        </div>
                    )}
                    {activeTab === 'checklist' && geo.checklist && (
                        <ActionChecklist
                            items={geo.checklist.items}
                            articleSlug={articleSlug}
                        />
                    )}
                    {activeTab === 'timeline' && geo.timeline && (
                        <TimelineStepper
                            steps={geo.timeline.steps}
                        />
                    )}
                    {activeTab === 'pitfalls' && geo.pitfalls && (
                        <Pitfalls
                            pitfalls={geo.pitfalls}
                        />
                    )}
                </div>
            </div>
        </>
    )
}
