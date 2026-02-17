'use client'

import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()

  return (
    <div
      key={pathname}
      className="animate-fade-in"
    >
      {children}
    </div>
  )
}

/**
 * Loading Bar Component - Shows at top of page during transitions
 */
export function LoadingBar({ progress = 0 }: { progress?: number }) {
  return (
    <div 
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 z-[100] transition-all duration-300 ease-out shadow-lg shadow-primary-500/50"
      style={{ 
        width: `${progress}%`,
        opacity: progress > 0 && progress < 100 ? 1 : 0 
      }}
    />
  )
}

/**
 * Page Loading Indicator - Full screen during route changes
 */
export function PageLoadingIndicator() {
  return (
    <div className="fixed inset-0 z-[99] bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-900 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-600 rounded-full animate-spin" />
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
