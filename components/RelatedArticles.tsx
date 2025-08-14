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
  const [innerWidth, setInnerWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => setInnerWidth(window.innerWidth)
    handleResize() // Set initial value
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || relatedArticles.length <= 2 || innerWidth < 768) return

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

  const canSlideDesktop = relatedArticles.length > 2 && innerWidth >= 768

  return (
    <section>
      <div className="my-24 px-4 max-w-4xl mx-auto">
        <h2 className="pb-12 font-bold text-2xl leading-5">Related articles:</h2>
        
        {/* Desktop: Carousel with 2 articles */}
        {innerWidth >= 768 ? (
          <div className="relative">
            {/* Navigation buttons */}
            {canSlideDesktop && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
                  aria-label="Previous articles"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all duration-200"
                  aria-label="Next articles"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentIndex ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Mobile: Simple list like Svelte */
          <ul className="space-y-0">
            {relatedArticles.map((article) => (
              <li key={article.slug} className="flex justify-center py-2">
                <RelatedArticleCard article={article} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
