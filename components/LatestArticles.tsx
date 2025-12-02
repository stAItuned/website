import { ArticleCard } from '@/components/ArticleCard'

interface Article {
  title: string
  slug: string
  cover?: string
  author?: string
  date: string
  meta?: string
  readingTime?: number
  target?: string
  language?: string
  published?: boolean
}

interface LatestArticlesProps {
  articles: Article[]
  maxArticles?: number
  title?: string
  description?: string
}

export function LatestArticles({ 
  articles, 
  maxArticles = 6,
  title = "Latest Articles",
  description = "Stay updated with our most recent content"
}: LatestArticlesProps) {
  const displayArticles = articles.slice(0, maxArticles)

  if (displayArticles.length === 0) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-100 dark:via-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-base lg:text-lg text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 items-stretch">
        {displayArticles.map((article) => (
          <div className="h-full" key={article.slug}>
            <ArticleCard 
              article={{
                title: article.title,
                slug: article.slug,
                cover: article.cover,
                author: article.author,
                date: article.date,
                meta: article.meta,
                readingTime: article.readingTime,
                target: article.target,
                language: article.language
              }} 
            />
          </div>
        ))}
      </div>
    </div>
  )
}
