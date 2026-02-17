'use client'

import { usePathname } from 'next/navigation'

/**
 * Top Loading Bar - Shows progress during page navigation
 */
export function TopLoadingBar() {
  const pathname = usePathname()

  return (
    <div key={pathname} className="fixed top-0 left-0 right-0 h-1 z-[100] pointer-events-none">
      <div 
        className="h-full w-full bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 shadow-lg shadow-primary-500/50 animate-[fade-out_700ms_ease-out_forwards]"
      />
    </div>
  )
}
