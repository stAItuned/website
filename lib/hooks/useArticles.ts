import { useState, useEffect, useCallback } from 'react'

interface ArticleData {
  slug: string
  title: string
  author?: string
  target: string
  topics: string[]
  date?: string
  cover?: string
  published?: boolean
  readingTime: number
  url: string
}

interface ArticleStats {
  total: number
  published: number
  drafts: number
  byAuthor: Record<string, number>
  byTarget: Record<string, number>
  byTopic: Record<string, number>
}

interface UseArticlesOptions {
  target?: 'newbie' | 'midway' | 'expert' | 'all'
  author?: string
  published?: boolean
  limit?: number
  enabled?: boolean
}

interface UseArticlesResult {
  data: ArticleData[]
  loading: boolean
  error: string | null
  total: number
  refetch: () => void
}

interface UseArticleStatsResult {
  data: ArticleStats | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useArticles(options: UseArticlesOptions = {}): UseArticlesResult {
  const {
    target = 'all',
    author,
    published = true,
    limit,
    enabled = true
  } = options

  const [data, setData] = useState<ArticleData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchArticles = useCallback(async () => {
    if (!enabled) return

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (target !== 'all') params.append('target', target)
      if (author) params.append('author', author)
      if (published !== undefined) params.append('published', published.toString())
      if (limit) params.append('limit', limit.toString())

      const response = await fetch(`/api/articles?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setData(result.data)
        setTotal(result.total)
      } else {
        setError(result.error || 'Failed to fetch articles')
        setData([])
        setTotal(0)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [target, author, published, limit, enabled])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  return {
    data,
    loading,
    error,
    total,
    refetch: fetchArticles
  }
}

export function useArticleStats(): UseArticleStatsResult {
  const [data, setData] = useState<ArticleStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'stats' }),
      })

      const result = await response.json()

      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || 'Failed to fetch article statistics')
        setData(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchStats
  }
}

// Utility function to get article by slug
export function useArticle(slug: string): UseArticlesResult {
  return useArticles({
    limit: 1,
    enabled: !!slug
  })
}

// Helper to format article title for display
export function formatArticleTitle(title: string, maxLength: number = 60): string {
  if (title.length <= maxLength) return title
  return title.substring(0, maxLength - 3) + '...'
}

// Helper to get article URL
export function getArticleUrl(article: ArticleData): string {
  return article.url
}

// Helper to format reading time
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return '< 1 min'
  if (minutes === 1) return '1 min'
  return `${minutes} min`
}

// Helper to format publication date
export function formatPublicationDate(dateString?: string): string {
  if (!dateString) return 'No date'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return 'Invalid date'
  }
}

// Helper to get target display name
export function getTargetDisplayName(target: string): string {
  switch (target.toLowerCase()) {
    case 'newbie': return 'Newbie'
    case 'midway': return 'Midway'
    case 'expert': return 'Expert'
    default: return 'All Levels'
  }
}

// Helper to get target color class
export function getTargetColor(target: string): string {
  switch (target.toLowerCase()) {
    case 'newbie': return 'bg-green-100 text-green-800'
    case 'midway': return 'bg-yellow-100 text-yellow-800'
    case 'expert': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}
