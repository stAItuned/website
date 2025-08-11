'use client'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="animate-fadeIn">
      {children}
    </div>
  )
}
