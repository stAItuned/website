'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

function RelatedArticleCard({ article }: { article: Article }) {
  const target = article.target?.toLowerCase() || 'general'
  
  const getValidImageSrc = (cover?: string) => {
    if (!cover) return null
    if (cover.startsWith('http://') || cover.startsWith('https://')) {
      return cover
    }
    if (cover.startsWith('/')) {
      return cover
    }
    // Handle cases where cover has nested paths like "./cover.jpeg"
    const cleanCover = cover.replace(/^\.\//, '')
    return `/cms/articles/${article.slug}/${cleanCover}`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    })
  }

  const getAuthorImageSrc = (author?: string) => {
    if (!author) return null
    const authorSlug = author.replaceAll(' ', '-')
    return `/cms/team/${authorSlug}/propic.jpg`
  }

  const imageSrc = getValidImageSrc(article.cover)
  const authorImageSrc = getAuthorImageSrc(article.author)

  return (
    <div className="max-w-4xl mx-auto p-3">
      <Link href={`/learn/${target}/${article.slug}`}>
        <div className="w-full py-2 text-primary-600 hover:cursor-pointer rounded-lg">
          <div className="relative h-[420px] flex flex-col justify-end hover:scale-105 transition duration-300 my-16">
            {/* Cover Image */}
            {imageSrc && (
              <Image
                src={imageSrc}
                alt="background"
                width={400}
                height={280}
                className="h-2/3 absolute -top-16 w-full rounded-lg object-cover"
                unoptimized={imageSrc.startsWith('http')}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            
            {/* Post Info */}
            <div className="relative mx-4 h-2/3 justify-between bg-slate-100 rounded-lg p-4 z-10">
              {/* Date */}
              <div className="absolute -top-10 left-0 w-full px-4 py-1 flex space-x-2 font-semibold text-white bg-slate-700 bg-opacity-40 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                </svg>
                <p className="text-md m-0">{formatDate(article.date)}</p>
              </div>
              
              {/* Main Info */}
              <div className="space-y-6 flex flex-col justify-between h-full">
                {/* Header */}
                <div className="flex justify-between items-center">
                  {/* Author */}
                  <div className="flex space-x-2 items-center">
                    {authorImageSrc && (
                      <Image
                        src={authorImageSrc}
                        alt="avatar"
                        width={32}
                        height={32}
                        className="max-h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <p className="text-lg mb-0 font-semibold">{article.author}</p>
                  </div>
                  
                  {/* Reading Time */}
                  {article.readingTime && (
                    <div className="flex space-x-2">
                      <p className="text-md mb-0 font-semibold">{article.readingTime} min</p>
                    </div>
                  )}
                </div>
                
                {/* Title */}
                <div className="space-y-2">
                  <h1 className="font-bold text-lg leading-5">{article.title}</h1>
                  <p className="text-sm leading-4 line-clamp-3">
                    {article.meta}
                  </p>
                </div>

                {/* Footer */}
                <div className="px-16">
                  <button className="py-2 w-full bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                    Read more
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
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
                    className="flex-shrink-0" 
                    style={{ width: '50%' }} // Each card takes exactly 50% so 2 are visible
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
              <li key={article.slug}>
                <RelatedArticleCard article={article} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
