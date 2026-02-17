'use client'

import { useState, useEffect } from 'react'
import { ANALYTICS_CONFIG } from '../../lib/analytics-config'

interface CacheStats {
  cacheSize: number
  callsToday: number
  maxCalls: number
  config: typeof ANALYTICS_CONFIG
}

export default function AnalyticsCacheStatus() {
  const [stats, setStats] = useState<CacheStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/analytics/cache-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch cache stats:', error)
    }
  }

  const clearCache = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/analytics/clear-cache', { method: 'POST' })
      if (response.ok) {
        await fetchStats() // Refresh stats
      }
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchStats()
    }, 0)
    const interval = setInterval(fetchStats, 30000) // Refresh every 30 seconds
    return () => {
      window.clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  if (!stats) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Analytics Cache Status</h3>
        <p>Loading...</p>
      </div>
    )
  }

  const isAtLimit = stats.callsToday >= stats.maxCalls

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Analytics Cache Status</h3>
      
      {/* API Call Limits */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-3 rounded">
          <div className="text-sm text-gray-600">API Calls Today</div>
          <div className={`text-2xl font-bold ${isAtLimit ? 'text-red-600' : 'text-green-600'}`}>
            {stats.callsToday}/{stats.maxCalls}
          </div>
        </div>
        <div className="bg-white p-3 rounded">
          <div className="text-sm text-gray-600">Cache Entries</div>
          <div className="text-2xl font-bold text-blue-600">
            {stats.cacheSize}
          </div>
        </div>
      </div>

      {/* Configuration Details */}
      <div className="bg-white p-3 rounded mb-4">
        <h4 className="font-semibold mb-2">Configuration</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Cache Duration:</span>
            <span>{Math.round(stats.config.CACHE_DURATION_MS / (1000 * 60 * 60))}h</span>
          </div>
          <div className="flex justify-between">
            <span>Client Cache:</span>
            <span>{Math.round(stats.config.CLIENT_CACHE_DURATION_MS / (1000 * 60))}min</span>
          </div>
          <div className="flex justify-between">
            <span>API Enabled:</span>
            <span className={stats.config.ENABLE_ANALYTICS_API ? 'text-green-600' : 'text-red-600'}>
              {stats.config.ENABLE_ANALYTICS_API ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Force Mock Data:</span>
            <span className={stats.config.FORCE_MOCK_DATA ? 'text-yellow-600' : 'text-gray-600'}>
              {stats.config.FORCE_MOCK_DATA ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Verbose Logging:</span>
            <span className={stats.config.VERBOSE_LOGGING ? 'text-blue-600' : 'text-gray-600'}>
              {stats.config.VERBOSE_LOGGING ? 'On' : 'Off'}
            </span>
          </div>
        </div>
      </div>

      {/* Status Messages */}
      <div className="mb-4">
        {isAtLimit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
            ⚠️ Daily API limit reached. Using cached data only.
          </div>
        )}
        {stats.config.FORCE_MOCK_DATA && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm">
            🔧 Using mock data (development mode)
          </div>
        )}
        {!stats.config.ENABLE_ANALYTICS_API && (
          <div className="bg-gray-100 border border-gray-400 text-gray-700 px-3 py-2 rounded text-sm">
            📴 Analytics API disabled
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={clearCache}
          disabled={isLoading}
          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading ? 'Clearing...' : 'Clear Cache'}
        </button>
        <button
          onClick={fetchStats}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}
