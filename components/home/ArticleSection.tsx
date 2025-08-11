'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// Function to calculate reading time based on content
function calculateReadingTime(content?: string): number {
  if (!content) return 1
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

type Category = 'Relevant' | 'Recent'

const articleCardColors = [
  '#ff6347', // Tomato Red
  '#ff4500', // Orange-Red
  '#ff7f50', // Coral
  '#ffa07a', // Light Coral
  '#ffb347', // Vibrant Orange
  '#ffd700', // Gold
  '#b9dd77', // Lime Green
  '#77dd77', // Light Green
  '#32cd32', // Green
  '#66b2b2', // Teal
  '#47efff', // Aqua Blue
  '#87ceeb', // Sky Blue
  '#4682b4', // Steel Blue
  '#1e90ff', // Dodger Blue
  '#0000ff', // Blue
  '#6a5acd', // Slate Blue
  '#8a2be2', // Blue Violet
  '#9932cc', // Dark Orchid
  '#c39bd3', // Lavender Purple
  '#d5a6bd', // Rose Pink
  '#f4b1a7', // Soft Pink
  '#dd8677', // Coral Brown
  '#b38b6d', // Earth Brown
] as const

interface Article {
  title: string
  slug: string
  url: string
  cover?: string
  author?: string
  date?: string
  topics?: string[]
  meta?: string
  target?: string
  readingTime?: number
}

interface ArticleSectionProps {
  recentArticles: Article[]
  relevantArticles: Article[]
}

function ArticleCard({ article, color }: { article: Article; color: string }) {
  const target = article.target?.toLowerCase() || article.topics?.[0]?.toLowerCase() || 'general'
  
  const getValidImageSrc = (cover?: string) => {
    if (!cover) return null
    
    // If it's already a valid absolute URL, return as is
    if (cover.startsWith('http://') || cover.startsWith('https://')) {
      return cover
    }
    
    // If it's already an absolute path, return as is
    if (cover.startsWith('/')) {
      return cover
    }
    
    // If it's a relative path, convert to absolute path
    // Images are directly in the article directory, not in a subdirectory
    return `/cms/articles/${article.slug}/${cover}`
  }

  const getAuthorImageSrc = (author?: string) => {
    if (!author) return '/assets/general/avatar.png'
    
    // Convert author name to file format (replace spaces with hyphens, lowercase)
    const authorSlug = author.toLowerCase().replace(/\s+/g, '-')
    // Try to get author image, fallback to default avatar
    return `/assets/team/${authorSlug}.jpg`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const imageSrc = getValidImageSrc(article.cover)
  const authorImageSrc = getAuthorImageSrc(article.author)
  
  // Calculate reading time if not provided
  const readingTime = article.readingTime || calculateReadingTime(article.meta)
  
  return (
    <div className="relative w-full md:w-1/2 lg:w-1/3 p-4">
      <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
        {/* Image and Date Overlay */}
        <div className="relative h-48 overflow-hidden">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt="Article cover"
              width={400}
              height={200}
              className="w-full h-full object-cover"
              unoptimized={imageSrc.startsWith('http')}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-white"
              style={{ background: color }}
            >
              <span className="text-lg font-bold">{article.title}</span>
            </div>
          )}
          
          {/* Date Overlay */}
          {article.date && (
            <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm">
              {formatDate(article.date)}
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4">
          {/* Author Section */}
          {article.author && (
            <div className="flex items-center mb-3">
              <Image
                src={authorImageSrc}
                alt={article.author}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover mr-3"
                onError={(e) => {
                  e.currentTarget.src = '/assets/general/avatar.png'
                }}
              />
              <span className="text-sm text-gray-600 font-medium">{article.author}</span>
              
              {/* Reading Time */}
              {readingTime && (
                <div className="ml-auto flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {readingTime}m read
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {article.title}
          </h3>

          {/* Meta Description */}
          {article.meta && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
              {article.meta}
            </p>
          )}

          {/* Topics */}
          {article.topics && article.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.topics.slice(0, 2).map((topic) => (
                <span
                  key={topic}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}

          {/* Read More Button */}
          <Link href={`/learn/${target}/${article.slug}`}>
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
              Read More
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export function ArticleSection({ recentArticles, relevantArticles }: ArticleSectionProps) {
  const [articlesToShow, setArticlesToShow] = useState<Category>('Relevant')
  
  const categories: Category[] = ['Relevant', 'Recent']
  const articles = articlesToShow === 'Recent' ? recentArticles : relevantArticles

  return (
    <section className="bg-white text-white py-5">
      {/* Category tabs */}
      <div className="text-center flex sm:text-xl font-bold pb-5 uppercase">
        {categories.map((category) => (
          <div
            key={category}
            className={`w-full text-center bg-primary-600 py-4 uppercase cursor-pointer hover:text-secondary-600 transition ${
              articlesToShow === category 
                ? 'text-secondary-600' 
                : 'text-gray-400'
            }`}
            onClick={() => setArticlesToShow(category)}
          >
            {`${category} Articles`}
          </div>
        ))}
      </div>

      {/* Article cards */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, idx) => (
              <ArticleCard
                key={article.slug}
                article={article}
                color={articleCardColors[idx % articleCardColors.length]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
