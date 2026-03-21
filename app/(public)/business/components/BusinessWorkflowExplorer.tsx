'use client'

import { useMemo, useState } from 'react'
import {
  WorkflowScreensCarousel,
  type WorkflowScreen,
  type WorkflowScreenRole,
} from '@/components/business/WorkflowScreensCarousel'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { BusinessLocale, BusinessTranslations } from '@/lib/i18n/business-translations'

const ROLE_ORDER: WorkflowScreenRole[] = ['operator', 'manager', 'admin']

type BusinessWorkflowExplorerProps = {
  flow: BusinessTranslations['flow']
  locale: BusinessLocale
  screens: WorkflowScreen[]
}

export function BusinessWorkflowExplorer({
  flow,
  locale,
  screens,
}: BusinessWorkflowExplorerProps) {
  const [activeRole, setActiveRole] = useState<WorkflowScreenRole>('operator')

  const filteredScreens = useMemo(
    () => screens.filter((screen) => screen.role === activeRole),
    [activeRole, screens],
  )

  const roleConfig = flow.roles[activeRole]

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-stretch">
      <article className="h-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-500 dark:text-amber-300">
              {flow.selectorLabel}
            </p>
            <SegmentedControl
              options={ROLE_ORDER.map((role) => ({
                value: role,
                label: flow.roles[role].label,
              }))}
              value={activeRole}
              onChange={(value) => setActiveRole(value as WorkflowScreenRole)}
              size="sm"
              className="w-full max-w-max"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  {roleConfig.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {roleConfig.summary}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {roleConfig.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <p className="text-sm font-medium leading-6 text-slate-700 dark:text-slate-200">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>

      <WorkflowScreensCarousel key={activeRole} screens={filteredScreens} locale={locale} />
    </div>
  )
}
