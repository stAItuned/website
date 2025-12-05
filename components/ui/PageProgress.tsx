'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Top Loading Bar - Shows progress during page navigation
 */
export function TopLoadingBar() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Start loading
    setIsLoading(true)
    setProgress(20)
    
    // Simulate progress
    const timer1 = setTimeout(() => setProgress(40), 100)
    const timer2 = setTimeout(() => setProgress(60), 200)
    const timer3 = setTimeout(() => setProgress(80), 300)
    const timer4 = setTimeout(() => setProgress(100), 400)
    
    // Complete and hide
    const timer5 = setTimeout(() => {
      setIsLoading(false)
      setProgress(0)
    }, 600)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      clearTimeout(timer5)
    }
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100] pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 transition-all duration-300 ease-out shadow-lg shadow-primary-500/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
