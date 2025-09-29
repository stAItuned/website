// Enhanced analytics caching with Redis-like functionality
import { db } from '@/lib/firebase/admin'

interface CacheOptions {
  ttl: number // Time to live in seconds
  staleWhileRevalidate?: number // Additional time to serve stale data
  tags?: string[] // Cache invalidation tags
}

interface CachedData<T> {
  data: T
  timestamp: number
  ttl: number
  tags?: string[]
}

class AnalyticsCache {
  private cache = new Map<string, CachedData<any>>()
  private revalidationPromises = new Map<string, Promise<any>>()

  constructor() {
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000)
  }

  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions
  ): Promise<T> {
    const cached = this.cache.get(key)
    const now = Date.now()

    // Cache hit - return immediately if not expired
    if (cached && (now - cached.timestamp) < (cached.ttl * 1000)) {
      return cached.data
    }

    // Stale-while-revalidate: return stale data, fetch in background
    if (cached && options.staleWhileRevalidate && 
        (now - cached.timestamp) < ((cached.ttl + options.staleWhileRevalidate) * 1000)) {
      
      // Start background revalidation
      if (!this.revalidationPromises.has(key)) {
        const revalidationPromise = this.fetchAndCache(key, fetcher, options)
        this.revalidationPromises.set(key, revalidationPromise)
        revalidationPromise.finally(() => this.revalidationPromises.delete(key))
      }
      
      return cached.data
    }

    // Cache miss or expired - fetch fresh data
    return this.fetchAndCache(key, fetcher, options)
  }

  private async fetchAndCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions
  ): Promise<T> {
    try {
      const data = await fetcher()
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl: options.ttl,
        tags: options.tags
      })
      return data
    } catch (error) {
      // If fetch fails and we have stale data, return it
      const cached = this.cache.get(key)
      if (cached) {
        console.warn(`Fetch failed for ${key}, returning stale data:`, error)
        return cached.data
      }
      throw error
    }
  }

  invalidate(tag: string) {
    for (const [key, cached] of Array.from(this.cache.entries())) {
      if (cached.tags?.includes(tag)) {
        this.cache.delete(key)
      }
    }
  }

  invalidateKey(key: string) {
    this.cache.delete(key)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, cached] of Array.from(this.cache.entries())) {
      // Remove entries that are expired beyond stale-while-revalidate window
      const maxAge = (cached.ttl + 3600) * 1000 // Extra hour buffer
      if ((now - cached.timestamp) > maxAge) {
        this.cache.delete(key)
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    }
  }
}

// Global cache instance
const analyticsCache = new AnalyticsCache()

// Optimized analytics queries
export class OptimizedAnalytics {
  
  // Get article analytics with aggressive caching
  static async getArticleAnalytics(slug: string) {
    return analyticsCache.get(
      `article:${slug}`,
      async () => {
        const doc = await db().collection('articles').doc(slug).get()
        if (!doc.exists) {
          return {
            pageViews: 0,
            users: 0,
            sessions: 0,
            avgTimeOnPage: 0,
            bounceRate: 0,
            likes: 0
          }
        }
        return doc.data()
      },
      {
        ttl: 3600, // 1 hour
        staleWhileRevalidate: 3600, // Additional 1 hour stale
        tags: ['analytics', `article:${slug}`]
      }
    )
  }

  // Get site-wide analytics with longer cache
  static async getSiteAnalytics() {
    return analyticsCache.get(
      'site:analytics',
      async () => {
        const doc = await db().collection('analytics').doc('daily').get()
        if (!doc.exists) {
          return {
            totalStats: { pageViews: 0, users: 0, sessions: 0 },
            topPages: [],
            updatedAt: new Date().toISOString()
          }
        }
        return doc.data()
      },
      {
        ttl: 1800, // 30 minutes
        staleWhileRevalidate: 1800, // Additional 30 minutes stale
        tags: ['analytics', 'site']
      }
    )
  }

  // Get multiple articles analytics in batch
  static async getMultipleArticlesAnalytics(slugs: string[]) {
    return analyticsCache.get(
      `articles:${slugs.sort().join(',')}`,
      async () => {
        const promises = slugs.map(slug => 
          db().collection('articles').doc(slug).get()
        )
        const docs = await Promise.all(promises)
        
        return docs.map((doc, index) => ({
          slug: slugs[index],
          data: doc.exists ? doc.data() : {
            pageViews: 0,
            users: 0,
            sessions: 0,
            avgTimeOnPage: 0,
            bounceRate: 0,
            likes: 0
          }
        }))
      },
      {
        ttl: 3600, // 1 hour
        staleWhileRevalidate: 1800, // Additional 30 minutes stale
        tags: ['analytics', 'articles-batch']
      }
    )
  }

  // Invalidate cache when analytics are updated
  static invalidateArticle(slug: string) {
    analyticsCache.invalidate(`article:${slug}`)
    analyticsCache.invalidate('articles-batch')
  }

  static invalidateSite() {
    analyticsCache.invalidate('site')
  }

  static getCacheStats() {
    return analyticsCache.getStats()
  }
}

// Enhanced Firestore query optimization
export class FirestoreOptimizer {
  
  // Batch writes for better performance
  static async batchUpdateAnalytics(updates: Array<{slug: string, data: any}>) {
    const batch = db().batch()
    
    updates.forEach(({ slug, data }) => {
      const ref = db().collection('articles').doc(slug)
      batch.set(ref, data, { merge: true })
    })

    await batch.commit()
    
    // Invalidate relevant caches
    updates.forEach(({ slug }) => {
      OptimizedAnalytics.invalidateArticle(slug)
    })
  }

  // Optimized query for top articles
  static async getTopArticles(limit: number = 10) {
    return analyticsCache.get(
      `top-articles:${limit}`,
      async () => {
        const snapshot = await db()
          .collection('articles')
          .orderBy('pageViews', 'desc')
          .limit(limit)
          .get()
        
        return snapshot.docs.map(doc => ({
          slug: doc.id,
          ...doc.data()
        }))
      },
      {
        ttl: 7200, // 2 hours
        staleWhileRevalidate: 3600, // Additional 1 hour stale
        tags: ['analytics', 'top-articles']
      }
    )
  }

  // Optimized query for recent articles with analytics
  static async getRecentArticlesWithAnalytics(limit: number = 20) {
    return analyticsCache.get(
      `recent-articles:${limit}`,
      async () => {
        // Get recent articles from contentlayer (already available)
        // Then batch fetch their analytics
        const { allPosts } = await import('@/lib/contentlayer')
        const recentPosts = allPosts
          .filter(post => post.published !== false)
          .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
          .slice(0, limit)

        const slugs = recentPosts.map(post => post.slug)
        const analytics = await OptimizedAnalytics.getMultipleArticlesAnalytics(slugs)
        
        return recentPosts.map(post => {
          const postAnalytics = analytics.find(a => a.slug === post.slug)
          return {
            ...post,
            analytics: postAnalytics?.data || {
              pageViews: 0,
              users: 0,
              sessions: 0,
              avgTimeOnPage: 0,
              bounceRate: 0,
              likes: 0
            }
          }
        })
      },
      {
        ttl: 1800, // 30 minutes
        staleWhileRevalidate: 1800, // Additional 30 minutes stale
        tags: ['articles', 'recent', 'analytics']
      }
    )
  }
}

export { analyticsCache }
