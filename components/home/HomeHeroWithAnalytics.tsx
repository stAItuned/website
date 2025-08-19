'use client'

import { useEffect, useState } from 'react'
import { HomeHero } from '@/components/home/HomeHero'

interface HomeHeroWithAnalyticsProps {
  totalArticles: number
  totalWriters: number
  initialActiveUsers?: number
  initialSessions?: number
}

export function HomeHeroWithAnalytics({
  totalArticles,
  totalWriters,
  initialActiveUsers = 0,
  initialSessions = 0
}: HomeHeroWithAnalyticsProps) {
  const [activeUsers, setActiveUsers] = useState<number | null>(null)
  const [sessions, setSessions] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setActiveUsers(null);
    setSessions(null);
    setLoading(true);
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics/fast')
        if (response.ok) {
          const json = await response.json()
          // Extract users and sessions from Firestore-backed response
          const totalStats = json?.data?.totalStats || {}
          setActiveUsers(typeof totalStats.users === 'number' ? totalStats.users : 0)
          setSessions(typeof totalStats.sessions === 'number' ? totalStats.sessions : 0)
        }
      } catch (error) {
        console.error('No data available:', error)
        // Keep as null on error
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [])

  return (
    <HomeHero
      totalArticles={totalArticles}
      totalWriters={totalWriters}
      activeUsers={loading ? '...' : activeUsers ?? 0}
      sessions={loading ? '...' : sessions ?? 0}
    />
  )
}
