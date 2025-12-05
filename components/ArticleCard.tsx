'use client'


import Image from 'next/image'
import { useFastAnalytics, formatAnalyticsNumber } from '@/lib/hooks/useFastAnalytics'

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
  // Fetch analytics for this article (fast endpoint)
  const { data: analyticsData, loading: analyticsLoading } = useFastAnalytics({ slug: article.slug })
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
      onClick={() => (window.location.href = `/learn/${target}/${article.slug}`)}
      className="text-primary-600 hover:cursor-pointer h-full group"
    >
      <div
        className="relative flex flex-col h-full min-h-[480px] max-h-[480px] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md bg-white dark:bg-gray-800 overflow-hidden transition-all duration-400 ease-out hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] hover:border-primary-400 dark:hover:border-primary-500"
      >
        <div className="relative w-full h-48 overflow-hidden shrink-0">
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={article.title}
              width={600}
              height={338}
              className="article-card-image object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={false}
              loading="lazy"
              quality={60}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          )}
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

          {/* Views Badge */}
          <div className="absolute top-2 left-2 z-20 flex items-center bg-white/95 dark:bg-gray-800/95 text-gray-800 dark:text-gray-200 rounded-full px-3 py-1.5 shadow-lg text-xs font-semibold gap-1.5 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-primary-500 group-hover:text-white">
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {analyticsLoading ? '...' : formatAnalyticsNumber(analyticsData?.pageViews || 0)}
            <span className="ml-1">views</span>
          </div>
        </div>
        {/* Target Level Overlay */}
        {article.target && (
          <div className={`absolute -top-8 sm:-top-1 right-0 px-3 py-1.5 rounded-bl-lg rounded-tr-lg text-xs font-bold z-20 shadow-lg transition-all duration-300 group-hover:scale-110 ${getTargetStyle(article.target)}`}>
            {article.target}
          </div>
        )}
        {/* Post Info fills remaining height */}
        <div className="relative bg-slate-50 dark:bg-gray-800 rounded-b-2xl p-3 sm:p-4 z-10 flex flex-col flex-1 w-full h-full transition-colors duration-300 group-hover:bg-slate-100 dark:group-hover:bg-gray-750">
          {/* Date */}
          <div className="absolute -top-6 sm:-top-10 left-0 w-full px-3 sm:px-4 py-1 flex space-x-2 font-semibold text-white bg-slate-700/60 dark:bg-gray-900/70 backdrop-blur-sm rounded-lg transition-all duration-300 group-hover:bg-primary-600/80">
            <svg className="w-4 h-4 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
            </svg>
            <p className="text-sm sm:text-md m-0">{formatDate(article.date)}</p>
          </div>
          {/* Main Info */}
          <div className="flex flex-col gap-4 sm:gap-6 flex-1">
            {/* Header */}
            <div className="flex justify-between items-center">
              {/* Author */}
              <div className="flex space-x-2 items-center transition-transform duration-300 group-hover:translate-x-1">
                {authorImageSrc && (
                  <Image
                    src={authorImageSrc}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-transparent transition-all duration-300 group-hover:ring-primary-400 group-hover:scale-110"
                    loading="lazy"
                    priority={false}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <p className="text-sm sm:text-lg mb-0 font-semibold truncate dark:text-gray-200">{article.author}</p>
              </div>
              {/* Reading Time */}
              {article.readingTime && (
                <div className="flex space-x-2 items-center transition-all duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm sm:text-md mb-0 font-semibold">{article.readingTime} min</p>
                </div>
              )}
            </div>
            {/* Title & Meta with fixed heights and overflow handling */}
            <div className="space-y-2">
              <h1
                className="font-bold text-base sm:text-lg leading-tight line-clamp-2 overflow-hidden transition-colors duration-300 group-hover:text-primary-600 dark:text-gray-100 dark:group-hover:text-primary-400"
                title={article.title}
              >
                {article.title}
              </h1>
              <p
                className="text-xs sm:text-sm leading-4 line-clamp-3 overflow-hidden text-gray-600 dark:text-gray-400 transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                title={article.meta || 'No description available'}
              >
                {article.meta || 'No description available'}
              </p>
            </div>
            {/* Footer pinned to bottom of the info box */}
            <div className="px-8 sm:px-16 mt-auto">
              <button className="py-2 w-full bg-primary-600 text-white rounded-lg font-semibold transition-all duration-300 hover:bg-primary-700 hover:shadow-lg hover:scale-105 active:scale-95 group-hover:bg-primary-500 text-sm sm:text-base">
                Read more
                <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
