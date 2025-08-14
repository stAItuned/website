import { ANALYTICS_CONFIG, logCacheOperation, getCacheKey } from './analytics-config'

// In-memory cache for production (you might want to use Redis in production)
interface CacheEntry {
  data: unknown
  timestamp: number
  lastFetched: string // Date string YYYY-MM-DD
}

class AnalyticsCache {
  private cache = new Map<string, CacheEntry>()
  private dailyCallCount = new Map<string, number>()
  private readonly MAX_CALLS_PER_DAY = ANALYTICS_CONFIG.MAX_DAILY_API_CALLS
  private readonly CACHE_DURATION_MS = ANALYTICS_CONFIG.CACHE_DURATION_MS

  private getTodayString(): string {
    return new Date().toISOString().split('T')[0]
  }

  private getCacheKey(articleSlug?: string, startDate?: string, endDate?: string): string {
    const today = this.getTodayString()
    const baseKey = `analytics_${articleSlug || 'global'}_${startDate || '30daysAgo'}_${endDate || 'today'}_${today}`
    return getCacheKey(baseKey)
  }

  private getDailyCountKey(): string {
    return getCacheKey(`daily_calls_${this.getTodayString()}`)
  }

  canMakeAPICall(): boolean {
    if (ANALYTICS_CONFIG.FORCE_MOCK_DATA || !ANALYTICS_CONFIG.ENABLE_ANALYTICS_API) {
      logCacheOperation('API_DISABLED', { 
        forceMock: ANALYTICS_CONFIG.FORCE_MOCK_DATA,
        apiEnabled: ANALYTICS_CONFIG.ENABLE_ANALYTICS_API 
      })
      return false
    }

    const today = this.getDailyCountKey()
    const callsToday = this.dailyCallCount.get(today) || 0
    const canCall = callsToday < this.MAX_CALLS_PER_DAY
    
    logCacheOperation('API_LIMIT_CHECK', {
      callsToday,
      maxCalls: this.MAX_CALLS_PER_DAY,
      canCall,
      date: this.getTodayString()
    })
    
    return canCall
  }

  recordAPICall(): void {
    const today = this.getDailyCountKey()
    const callsToday = this.dailyCallCount.get(today) || 0
    const newCount = callsToday + 1
    this.dailyCallCount.set(today, newCount)
    
    logCacheOperation('API_CALL_RECORDED', {
      date: this.getTodayString(),
      callCount: newCount,
      maxCalls: this.MAX_CALLS_PER_DAY
    })
  }

  get(articleSlug?: string, startDate?: string, endDate?: string): unknown | null {
    const key = this.getCacheKey(articleSlug, startDate, endDate)
    const entry = this.cache.get(key)
    
    if (!entry) {
      logCacheOperation('CACHE_MISS', { key, articleSlug })
      return null
    }

    const now = Date.now()
    const isExpired = now - entry.timestamp > this.CACHE_DURATION_MS
    
    if (isExpired) {
      this.cache.delete(key)
      logCacheOperation('CACHE_EXPIRED', { key, articleSlug, age: now - entry.timestamp })
      return null
    }

    logCacheOperation('CACHE_HIT', { key, articleSlug, age: now - entry.timestamp })
    return entry.data
  }

  set(data: unknown, articleSlug?: string, startDate?: string, endDate?: string): void {
    const key = this.getCacheKey(articleSlug, startDate, endDate)
    const today = this.getTodayString()
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      lastFetched: today
    })
    
    logCacheOperation('CACHE_SET', { key, articleSlug, cacheSize: this.cache.size })
  }

  // Clean up old entries
  cleanup(): void {
    const now = Date.now()
    let cleanedCount = 0

    // Clean cache - convert to array first for iteration
    Array.from(this.cache.entries()).forEach(([key, entry]) => {
      if (now - entry.timestamp > this.CACHE_DURATION_MS) {
        this.cache.delete(key)
        cleanedCount++
      }
    })

    // Clean daily call counts (keep only today's data)
    const today = this.getTodayString()
    const todayKey = getCacheKey(`daily_calls_${today}`)
    
    Array.from(this.dailyCallCount.keys()).forEach(dateKey => {
      if (dateKey !== todayKey) {
        this.dailyCallCount.delete(dateKey)
        cleanedCount++
      }
    })
    
    if (cleanedCount > 0) {
      logCacheOperation('CLEANUP', { cleanedEntries: cleanedCount, remainingSize: this.cache.size })
    }
  }

  getStats(): { cacheSize: number; callsToday: number; maxCalls: number; config: typeof ANALYTICS_CONFIG } {
    const today = this.getDailyCountKey()
    return {
      cacheSize: this.cache.size,
      callsToday: this.dailyCallCount.get(today) || 0,
      maxCalls: this.MAX_CALLS_PER_DAY,
      config: ANALYTICS_CONFIG
    }
  }
}

// Global cache instance
const analyticsCache = new AnalyticsCache()

// Cleanup every hour
setInterval(() => {
  analyticsCache.cleanup()
}, 60 * 60 * 1000)

export { analyticsCache }
