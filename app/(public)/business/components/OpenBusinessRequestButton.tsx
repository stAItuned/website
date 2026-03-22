'use client'

import type { ReactNode } from 'react'

export function OpenBusinessRequestButton({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent('open-business-request-modal'))
      }}
      className={className}
    >
      {children}
    </button>
  )
}
