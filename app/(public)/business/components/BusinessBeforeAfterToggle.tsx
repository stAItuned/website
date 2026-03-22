'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { SegmentedControl } from '@/components/ui/SegmentedControl'

export function BusinessBeforeAfterToggle({
  eyebrow,
  title,
  description,
  transitionCue,
  beforeLabel,
  afterLabel,
  beforePanel,
  afterPanel,
}: {
  eyebrow: string
  title: string
  description: string
  transitionCue: string
  beforeLabel: string
  afterLabel: string
  beforePanel: React.ReactNode
  afterPanel: React.ReactNode
}) {
  const [activeView, setActiveView] = useState<'before' | 'after'>('before')

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-rose-500 dark:text-rose-400">
            {eyebrow}
          </p>
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h3>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 md:items-end">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm dark:border-amber-500/20 dark:bg-slate-950 dark:text-slate-200">
            <span className="relative flex h-4 w-4 items-center justify-center" aria-hidden>
              <span className="absolute inset-0 rounded-full bg-amber-400/40 blur-sm animate-pulse" />
              <ArrowRight className="relative h-3.5 w-3.5 text-amber-500" />
            </span>
            <span>{transitionCue}</span>
          </div>

          <SegmentedControl
            size="sm"
            value={activeView}
            onChange={(value) => setActiveView(value === 'after' ? 'after' : 'before')}
            options={[
              { value: 'before', label: beforeLabel },
              { value: 'after', label: afterLabel },
            ]}
          />
        </div>
      </div>

      <div className="w-full">{activeView === 'before' ? beforePanel : afterPanel}</div>
    </div>
  )
}
