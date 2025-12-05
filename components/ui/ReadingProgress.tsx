'use client'

import { useEffect, useState } from 'react'

/**
 * Reading Progress Bar - Shows how far user has scrolled through article
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      
      const totalScroll = documentHeight - windowHeight
      const currentProgress = (scrollTop / totalScroll) * 100
      
      setProgress(Math.min(100, Math.max(0, currentProgress)))
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress() // Initial calculation

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-[90]">
      <div 
        className="h-full bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 transition-all duration-150 ease-out shadow-md shadow-primary-500/30"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

/**
 * Circular Progress Indicator - Shows progress as a ring (can wrap back-to-top button)
 */
export function CircularProgress({ size = 48 }: { size?: number }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      
      const totalScroll = documentHeight - windowHeight
      const currentProgress = (scrollTop / totalScroll) * 100
      
      setProgress(Math.min(100, Math.max(0, currentProgress)))
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg 
      width={size} 
      height={size} 
      className="transform -rotate-90 absolute inset-0"
    >
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        className="text-gray-200 dark:text-gray-700"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-primary-600 dark:text-primary-400 transition-all duration-150 ease-out"
      />
    </svg>
  )
}

/**
 * Section Progress - Shows which section user is currently reading
 */
export function SectionProgress({ sections }: { sections: string[] }) {
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sections.indexOf(entry.target.id)
            if (index !== -1) {
              setActiveSection(index)
            }
          }
        })
      },
      { threshold: 0.5, rootMargin: '-20% 0px -80% 0px' }
    )

    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [sections])

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="flex flex-col gap-3">
        {sections.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === activeSection
                ? 'bg-primary-600 scale-150 shadow-lg shadow-primary-500/50'
                : index < activeSection
                ? 'bg-primary-400'
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Estimated Time Remaining
 */
export function EstimatedTimeRemaining({ wordsPerMinute = 200 }: { wordsPerMinute?: number }) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  useEffect(() => {
    const calculateTime = () => {
      const articleContent = document.querySelector('article')
      if (!articleContent) return

      const text = articleContent.textContent || ''
      const totalWords = text.trim().split(/\s+/).length
      const totalMinutes = totalWords / wordsPerMinute

      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      
      const percentageRead = scrollTop / (documentHeight - windowHeight)
      const minutesRemaining = totalMinutes * (1 - percentageRead)
      
      setTimeRemaining(Math.max(0, Math.ceil(minutesRemaining)))
    }

    window.addEventListener('scroll', calculateTime, { passive: true })
    calculateTime()

    return () => window.removeEventListener('scroll', calculateTime)
  }, [wordsPerMinute])

  if (timeRemaining === null || timeRemaining === 0) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-lg border-2 border-primary-200 dark:border-primary-800 z-40 animate-fade-in">
      <div className="flex items-center gap-2 text-sm">
        <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {timeRemaining} min left
        </span>
      </div>
    </div>
  )
}
