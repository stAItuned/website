import { NextResponse } from 'next/server'

// Cache delle statistiche al giorno
export const revalidate = 86400

export async function GET() {
  try {
    // Simuliamo il fetch delle metriche da Google Analytics
    // In produzione, qui faresti il fetch reale dall'API di GA4
    const statsResponse = await fetch('https://analytics.googleapis.com/v1/reports', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GOOGLE_ANALYTICS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Configuration per GA4 API
        reportRequests: [{
          viewId: process.env.GOOGLE_ANALYTICS_VIEW_ID,
          dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
          metrics: [
            { expression: 'ga:users' },
            { expression: 'ga:sessions' }
          ]
        }]
      }),
      // Cache della richiesta API con Next.js
      next: { 
        revalidate: revalidate, // Riusa la variabile invece di hardcode
        tags: ['analytics-stats'] 
      }
    })

    if (!statsResponse.ok) {
      throw new Error('Failed to fetch analytics data')
    }

    const analyticsData = await statsResponse.json()
    
    // Estrai i dati necessari
    const activeUsers = analyticsData?.reports?.[0]?.data?.totals?.[0]?.values?.[0] || 0
    const sessions = analyticsData?.reports?.[0]?.data?.totals?.[0]?.values?.[1] || 0

    const response = NextResponse.json({
      activeUsers: parseInt(activeUsers),
      sessions: parseInt(sessions),
      lastUpdated: new Date().toISOString()
    })

    // Headers per il caching
    response.headers.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200')
    
    return response

  } catch (error) {
    console.error('Analytics API error:', error)
    
    // Return fallback data in caso di errore
    return NextResponse.json({
      activeUsers: 0,
      sessions: 0,
      lastUpdated: new Date().toISOString(),
      error: 'Failed to fetch analytics data'
    }, { 
      status: 200, // 200 per evitare errori nella UI
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' // Cache più breve per errori
      }
    })
  }
}
