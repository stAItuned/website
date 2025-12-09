"use client"
import { useEffect, useState } from 'react'

export function BackToTopButton() {
  const [showTop, setShowTop] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 300)
      if (window.scrollY < 10) {
        console.log('[BackToTop] Window at top (scrollY < 10)')
      }
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
        console.log('[BackToTop] Window at bottom (scrollY + innerHeight >= body.offsetHeight)')
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!showTop) return null
  return (
    <button
      onClick={() => {
        console.log('[BackToTop] Clicked Back to Top button')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      className="fixed bottom-40 right-4 lg:bottom-8 lg:right-8 z-40 bg-primary-600 text-white rounded-full shadow-lg p-2.5 lg:p-3 hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400"
      aria-label="Back to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  )
}
