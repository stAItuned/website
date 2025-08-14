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
  const [activeUsers, setActiveUsers] = useState(initialActiveUsers)
  const [sessions, setSessions] = useState(initialSessions)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/analytics/stats')
        if (response.ok) {
          const data = await response.json()
          setActiveUsers(data.activeUsers || 0)
          setSessions(data.sessions || 0)
        }
      } catch (error) {
        console.error('Failed to load analytics:', error)
        // Keep initial values on error
      }
    }

    // Load analytics after component mounts
    fetchAnalytics()
  }, [])

  return (
    <HomeHero
      totalArticles={totalArticles}
      totalWriters={totalWriters}
      activeUsers={activeUsers}
      sessions={sessions}
    />
  )
}
