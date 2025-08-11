'use client'

import Image from 'next/image'

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
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
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
    <div
      onClick={() => window.location.href = `/learn/${article.target?.toLowerCase() || 'general'}/${article.slug}`}
      className="w-full md:w-1/2 xl:w-1/3 py-4 md:p-4 text-primary-600 hover:cursor-pointer rounded-lg"
    >
      <div className="relative h-[420px] flex flex-col justify-end hover:scale-105 transition duration-300 my-16">
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                    className="max-h-8 rounded-full"
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
                {article.meta || 'No description available'}
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
  )
}
