'use client'

import { useEffect, useState } from 'react'

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(Math.min(100, Math.max(0, scrollPercent)))
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress() // Initial calculation
    
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200/50 dark:bg-slate-800/50 lg:hidden">
      <div 
        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-150 ease-out shadow-lg shadow-primary-500/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
