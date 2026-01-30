"use client"

import { QuickAnswerCard } from './QuickAnswerCard'
import { ActionChecklist } from './ActionChecklist'
import { TimelineStepper } from './TimelineStepper'
import { DecisionRules } from '@/components/geo/DecisionRules'
import { AudienceFit } from './AudienceFit'
import { ArticleTOC } from '@/components/ArticleTOC'

interface GeoPlaybookRailProps {
    geo: any // Typed as any for now, matches contentlayer config
    articleSlug: string
    toc: any[]
    onTOCClick: (slug: string) => void
}

export function GeoPlaybookRail({
    geo,
    articleSlug,
    toc,
    onTOCClick
}: GeoPlaybookRailProps) {
    if (!geo) return null

    return (
        <div className="flex flex-col gap-6 sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">

            {/* TOC - Primary Navigation */}
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">On this page</h3>
                <ArticleTOC
                    toc={toc}
                    enableScrollSpy={true}
                    onLinkClick={onTOCClick}
                    sticky={false}
                />
            </div>

            {/* Persistent Tools (Checklist) - Only keeping the checklist as a side-widget */}
            {geo.checklist && geo.checklist.items && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Progress</h3>
                    </div>
                    <div className="p-2">
                        <ActionChecklist
                            title={geo.checklist.title}
                            items={geo.checklist.items}
                            articleSlug={articleSlug}
                            className="border-none shadow-none"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
