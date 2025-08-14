'use client'


import Image from 'next/image'
import { useAnalytics, formatAnalyticsNumber } from '@/lib/hooks/useAnalytics'

interface ArticleCardProps {
  article: {
    title: string
    slug: string
    cover?: string
    author?: string
    date?: string
    meta?: string
    readingTime?: number
    target?: string
    language?: string
    topics?: string[]
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  // Fetch analytics for this article (from cache if present)
  const { data: analyticsData, loading: analyticsLoading } = useAnalytics({ slug: article.slug })
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
    return `/content/articles/${article.slug}/${cleanCover}`
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
    return `/content/team/${authorSlug}/propic.jpg`
  }

  const getTargetStyle = (target?: string) => {
    const targetStyles = {
      'Newbie': 'bg-green-500 text-white',
      'Midway': 'bg-yellow-500 text-white', 
      'Expert': 'bg-red-500 text-white',
      'General': 'bg-gray-500 text-white'
    }
    return targetStyles[target as keyof typeof targetStyles] || targetStyles.General
  }

  const imageSrc = getValidImageSrc(article.cover)
  const authorImageSrc = getAuthorImageSrc(article.author)

  const target = article.target?.toLowerCase() || article.topics?.[0]?.toLowerCase() || 'general'

  return (
    <div
      onClick={() => window.location.href = `/learn/${target}/${article.slug}`}
      className="w-full sm:w-1/2 lg:w-1/3 p-2 sm:p-4 text-primary-600 hover:cursor-pointer rounded-lg"
    >
      <div className="relative">
        <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={article.title}
              fill
              className="article-card-image"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
              quality={75}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              loading="lazy"
            />
          )}

          {/* Views Badge */}
          <div className="absolute top-2 left-2 z-20 flex items-center bg-white/90 text-gray-800 rounded-full px-2 py-1 shadow text-xs font-semibold gap-1">
            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {analyticsLoading ? '...' : formatAnalyticsNumber(analyticsData?.pageViews || 0)}
            <span className="ml-1">views</span>
          </div>
        </div>
        {/* Target Level Overlay */}
        {article.target && (
          <div className={`absolute -top-8 sm:-top-1 right-0 px-2 py-1 rounded-bl-lg rounded-tr-lg text-xs font-semibold z-20 ${getTargetStyle(article.target)}`}>
            {article.target}
          </div>
        )}
        {/* Post Info */}
        <div className="relative mx-2 sm:mx-4 h-2/3 justify-between bg-slate-100 rounded-lg p-3 sm:p-4 z-10">
          {/* Date */}
          <div className="absolute -top-6 sm:-top-10 left-0 w-full px-3 sm:px-4 py-1 flex space-x-2 font-semibold text-white bg-slate-700 bg-opacity-40 rounded-lg">
            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
            </svg>
            <p className="text-sm sm:text-md m-0">{formatDate(article.date)}</p>
          </div>
          {/* Main Info */}
          <div className="space-y-4 sm:space-y-6 flex flex-col justify-between h-full">
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
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <p className="text-sm sm:text-lg mb-0 font-semibold truncate">{article.author}</p>
              </div>
              {/* Reading Time */}
              {article.readingTime && (
                <div className="flex space-x-2">
                  <p className="text-sm sm:text-md mb-0 font-semibold">{article.readingTime} min</p>
                </div>
              )}
            </div>
            {/* Title */}
            <div className="space-y-2">
              <h1 className="font-bold text-base sm:text-lg leading-tight">{article.title}</h1>
              <p className="text-xs sm:text-sm leading-4 line-clamp-3">
                {article.meta || 'No description available'}
              </p>
            </div>
            {/* Footer */}
            <div className="px-8 sm:px-16">
              <button className="py-2 w-full bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm sm:text-base">
                Read more
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
