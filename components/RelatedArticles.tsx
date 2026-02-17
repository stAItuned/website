'use client'

import { useState, useEffect } from 'react'
import { RelatedArticleCard } from '@/components/RelatedArticleCard'

interface Article {
  title: string
  slug: string
  cover?: string
  author?: string
  date?: string
  meta?: string
  readingTime?: number
  target?: string
  topics?: string[]
}

interface RelatedArticlesProps {
  relatedArticles: Article[]
}


export function RelatedArticles({ relatedArticles }: RelatedArticlesProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [innerWidth, setInnerWidth] = useState<number | null>(null)

  useEffect(() => {
    const handleResize = () => setInnerWidth(window.innerWidth)
    const timer = window.setTimeout(handleResize, 0)
    window.addEventListener('resize', handleResize)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || relatedArticles.length <= 2 || !innerWidth || innerWidth < 768) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const maxIndex = relatedArticles.length - 2 // Always show 2 cards on desktop
        return prevIndex >= maxIndex ? 0 : prevIndex + 1
      })
    }, 5000) // 5 seconds autoplay like in Svelte

    return () => clearInterval(interval)
  }, [isAutoPlaying, relatedArticles.length, innerWidth])

  const handlePrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => {
      const maxIndex = relatedArticles.length - 2
      return prevIndex <= 0 ? maxIndex : prevIndex - 1
    })
  }

  const handleNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => {
      const maxIndex = relatedArticles.length - 2
      return prevIndex >= maxIndex ? 0 : prevIndex + 1
    })
  }

  if (!relatedArticles || relatedArticles.length === 0) {
    return null
  }

  // Render mobile view by default for SSR, then switch to appropriate view on client
  if (innerWidth === null) {
    return (
      <section className="w-full">
        <div className="my-12 sm:my-16 md:my-24 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
          <h2 className="pb-6 sm:pb-8 md:pb-12 font-bold text-xl sm:text-2xl md:text-3xl leading-tight text-gray-900 dark:text-gray-100">
            Related articles
          </h2>
          <div className="space-y-4">
            {relatedArticles.map((article) => (
              <div key={article.slug} className="w-full">
                <RelatedArticleCard article={article} />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const canSlideDesktop = relatedArticles.length > 2 && innerWidth && innerWidth >= 768

  return (
    <section className="w-full">
      <div className="my-12 sm:my-16 md:my-24 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
        <h2 className="pb-6 sm:pb-8 md:pb-12 font-bold text-xl sm:text-2xl md:text-3xl leading-tight text-gray-900 dark:text-gray-100">
          Related articles
        </h2>
        
        {/* Desktop: Carousel with 2 articles */}
        {innerWidth && innerWidth >= 768 ? (
          <div className="relative">
            {/* Navigation buttons */}
            {canSlideDesktop && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute -left-4 lg:-left-12 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 hover:bg-opacity-100 dark:hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
                  aria-label="Previous articles"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute -right-4 lg:-right-12 top-1/2 transform -translate-y-1/2 z-10 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 hover:bg-opacity-100 dark:hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
                  aria-label="Next articles"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Carousel container - shows 2 cards, slides 1 at a time */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / 2)}%)`, // Each slide moves by 50% (1 card width when showing 2)
                }}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                {relatedArticles.map((article) => (
                  <div
                    key={article.slug}
                    className="flex-shrink-0 flex justify-center items-center px-2"
                    style={{ width: '50%' }}
                  >
                    <RelatedArticleCard article={article} />
                  </div>
                ))}
              </div>
            </div>

            {/* Dots indicator */}
            {canSlideDesktop && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: relatedArticles.length - 1 }, (_, index) => ( // -1 because we show 2 cards
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index)
                      setIsAutoPlaying(false)
                    }}
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-colors duration-200 ${
                      index === currentIndex ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Mobile: Simple list with better spacing */
          <div className="space-y-4">
            {relatedArticles.map((article) => (
              <div key={article.slug} className="w-full">
                <RelatedArticleCard article={article} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
