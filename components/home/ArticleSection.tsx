'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useMultipleAnalytics, formatAnalyticsNumber } from '@/lib/hooks/useAnalytics'

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
  pageViews?: number // Add analytics data
}

interface ArticleSectionProps {
  recentArticles: Article[]
  relevantArticles: Article[]
}

function ArticleCard({ article, color, pageViews }: { 
  article: Article; 
  color: string; 
  pageViews?: number 
}) {
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
    return `/content/articles/${article.slug}/${cover}`
  }

  const imageSrc = getValidImageSrc(article.cover)
  
  return (
    <div 
      className="relative w-full md:w-1/2 sm:text-xl font-bold opacity-80 hover:opacity-100 transition group"
      style={{ background: color }}
    >
      <Link href={`/learn/${target}/${article.slug}`}>
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt="bg"
            width={400}
            height={200}
            className="w-full max-h-[200px] object-cover opacity-30"
            unoptimized={imageSrc.startsWith('http')}
            onError={(e) => {
              // Hide broken images
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-[200px] opacity-30" />
        )}
        <span className="absolute top-[30%] left-[10%] text-white">
          <span>{article.title}</span>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {article.author && (
              <span className="inline-block px-2 py-0.5 rounded-full bg-white/90 text-gray-900 text-xs font-semibold shadow-sm">
                {article.author
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ')
                }
              </span>
            )}
            {article.target && (
              <span className="inline-block px-2 py-0.5 rounded-full bg-primary-700/90 text-white text-xs font-semibold shadow-sm">
                {article.target.charAt(0).toUpperCase() + article.target.slice(1)}
              </span>
            )}
            {article.date && (
              <span className="inline-block px-2 py-0.5 rounded-full bg-gray-900/80 text-white text-xs font-normal shadow-sm">
                {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
        </span>
        
        {/* Minimal View count badge */}
        {pageViews !== undefined && pageViews > 0 && (
          <div className="absolute top-3 right-3 flex items-center bg-white/80 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full shadow-sm group-hover:bg-white group-hover:text-primary-600 transition-all">
            <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="mr-1">{formatAnalyticsNumber(pageViews)} </span>
            <span className="mr-1 lowercase">views</span>
          </div>
        )}
      </Link>
    </div>
  )
}

export function ArticleSection({ recentArticles, relevantArticles }: ArticleSectionProps) {
  const [articlesToShow, setArticlesToShow] = useState<Category>('Relevant')
  const [articlesWithAnalytics, setArticlesWithAnalytics] = useState<{
    recent: Article[]
    relevant: Article[]
  }>({
    recent: recentArticles,
    relevant: relevantArticles
  })
  
  // Fetch analytics data for all articles
  const { data: analyticsData, loading: analyticsLoading } = useMultipleAnalytics({
    startDate: '90daysAgo',
    endDate: 'today'
  })

  // Merge analytics data with articles when available
  useEffect(() => {
    if (analyticsData && analyticsData.length > 0) {
      const analyticsMap = new Map()
      analyticsData.forEach(item => {
        // Create a map of article URLs to view counts
        if (item.articleUrl) {
          analyticsMap.set(item.articleUrl, item.pageViews || 0)
        }
      })

      const enhanceArticlesWithAnalytics = (articles: Article[]) => {
        return articles.map(article => {
          const target = article.target?.toLowerCase() || 'midway'
          const articleUrl = `/learn/${target}/${article.slug}`
          const pageViews = analyticsMap.get(articleUrl) || 0
          
          return {
            ...article,
            pageViews
          }
        })
      }

      setArticlesWithAnalytics({
        recent: enhanceArticlesWithAnalytics(recentArticles),
        relevant: enhanceArticlesWithAnalytics(relevantArticles)
      })
    }
  }, [analyticsData, recentArticles, relevantArticles])
  
  const categories: Category[] = ['Relevant', 'Recent']
  const articles = articlesToShow === 'Recent' 
    ? articlesWithAnalytics.recent 
    : articlesWithAnalytics.relevant

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
            <div className="flex items-center justify-center space-x-2">
              <span>{`${category} Articles`}</span>
              {analyticsLoading && (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white opacity-50"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Article cards - matching Svelte layout exactly */}
      <div className="flex flex-wrap bg-primary-600 uppercase transition">
        {articles.map((article, idx) => (
          <ArticleCard
            key={article.slug}
            article={article}
            color={articleCardColors[idx % articleCardColors.length]}
            pageViews={article.pageViews}
          />
        ))}
      </div>

      {/* Analytics note */}
      <div className="bg-primary-600 px-4 py-2">
        <p className="text-xs text-right text-gray-300">
          {analyticsLoading 
            ? 'Loading view counts...' 
            : analyticsData && analyticsData.length > 0
              ? '* View counts from Google Analytics (last 30 days)'
              : '* View counts unavailable'
          }
        </p>
      </div>
    </section>
  )
}
