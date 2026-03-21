'use client'

import { useState } from 'react'
import { SegmentedControl } from '@/components/ui/SegmentedControl'

export function BusinessBeforeAfterToggle({
  beforeLabel,
  afterLabel,
  beforePanel,
  afterPanel,
}: {
  beforeLabel: string
  afterLabel: string
  beforePanel: React.ReactNode
  afterPanel: React.ReactNode
}) {
  const [activeView, setActiveView] = useState<'before' | 'after'>('before')

  return (
    <div className="space-y-5">
      <div className="flex justify-start">
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

      <div>{activeView === 'before' ? beforePanel : afterPanel}</div>
    </div>
  )
}
