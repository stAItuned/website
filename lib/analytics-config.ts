// Environment variables for analytics caching configuration
export const ANALYTICS_CONFIG = {
  // Maximum number of Google Analytics API calls per day
  MAX_DAILY_API_CALLS: parseInt(process.env.ANALYTICS_MAX_DAILY_CALLS || '1'),
  
  // Cache duration in milliseconds (24 hours)
  CACHE_DURATION_MS: parseInt(process.env.ANALYTICS_CACHE_DURATION || '86400000'),
  
  // Client-side cache duration in milliseconds (24 hours)
  CLIENT_CACHE_DURATION_MS: parseInt(process.env.ANALYTICS_CLIENT_CACHE_DURATION || '86400000'),
  
  // Enable/disable analytics API calls entirely
  ENABLE_ANALYTICS_API: process.env.ENABLE_ANALYTICS_API !== 'false',
  
  // Enable verbose logging for cache operations
  VERBOSE_LOGGING: process.env.ANALYTICS_VERBOSE_LOGGING === 'true',
  
  // Force use of mock data (useful for development)
  FORCE_MOCK_DATA: process.env.FORCE_ANALYTICS_MOCK === 'true'
} as const

// Helper function to log cache operations
export function logCacheOperation(operation: string, details: Record<string, unknown>) {
  if (ANALYTICS_CONFIG.VERBOSE_LOGGING) {
    console.log(`📊 Analytics Cache [${operation}]:`, details)
  }
}

// Helper function to check if we're in development mode
export function isDevelopmentMode(): boolean {
  return process.env.NODE_ENV === 'development'
}

// Helper function to get cache key with environment-specific prefix
export function getCacheKey(base: string): string {
  const env = isDevelopmentMode() ? 'dev' : 'prod'
  return `${env}_${base}`
}
