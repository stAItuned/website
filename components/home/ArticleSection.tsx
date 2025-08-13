'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ArticleAnalyticsCard from '@/components/analytics/ArticleAnalyticsCard'

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
    return `/content/articles/${article.slug}/${cover}`
  }

  const imageSrc = getValidImageSrc(article.cover)
  
  return (
    <div 
      className="relative w-full md:w-1/2 sm:text-xl font-bold opacity-80 hover:opacity-100 transition"
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
        <div className="absolute top-[20%] left-[10%] text-white space-y-2">
          <div className="text-base sm:text-xl font-bold">
            {article.title}
          </div>
          <div className="text-xs opacity-80">
            <ArticleAnalyticsCard 
              slug={article.slug} 
              target={target}
              className="text-white"
              showLabel={true}
            />
          </div>
        </div>
      </Link>
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

      {/* Article cards - matching Svelte layout exactly */}
      <div className="flex flex-wrap bg-primary-600 uppercase transition">
        {articles.map((article, idx) => (
          <ArticleCard
            key={article.slug}
            article={article}
            color={articleCardColors[idx % articleCardColors.length]}
          />
        ))}
      </div>
    </section>
  )
}
