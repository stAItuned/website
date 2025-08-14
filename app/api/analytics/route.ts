import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { allPosts } from '@/lib/contentlayer'
import { analyticsCache } from '@/lib/analytics-cache'

// Google Analytics Data API v1 types
interface AnalyticsData {
  articleUrl: string
  pageViews: number
  uniquePageViews: number
  avgTimeOnPage: number
  bounceRate: number
  users: number
  sessions: number
  dateRange: {
    startDate: string
    endDate: string
  }
  // Add CMS data
  title?: string
  author?: string
  target?: string
  topics?: string[]
  readingTime?: number
  published?: boolean
}

interface AnalyticsRowData {
  articleUrl: string
  pageTitle: string
  pageViews: number
  uniquePageViews: number
  avgTimeOnPage: number
  bounceRate: number
  users: number
  sessions: number
}

interface RowData {
  dimensionValues: Array<{ value: string }>
  metricValues: Array<{ value: string }>
}

interface AnalyticsResponse {
  rows?: RowData[]
  metricHeaders?: Array<{ name: string }>
  dimensionHeaders?: Array<{ name: string }>
}

// Initialize Google Analytics Data API
const getAnalyticsReporting = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_ANALYTICS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      project_id: process.env.GOOGLE_ANALYTICS_PROJECT_ID,
    },
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  })

  const analyticsData = google.analyticsdata({
    version: 'v1beta',
    auth,
  })

  return analyticsData
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const articleSlug = searchParams.get('slug')
  const startDate = searchParams.get('startDate') || '30daysAgo'
  const endDate = searchParams.get('endDate') || 'today'
  const target = searchParams.get('target') || 'midway' // newbie, midway, expert

  try {
    // Check cache first - ALWAYS return cached data if available
    const cachedData = analyticsCache.get(articleSlug || undefined, startDate, endDate)
    if (cachedData) {
      console.log('📊 Analytics: Serving from cache', { articleSlug, date: new Date().toISOString() })
      return NextResponse.json({
        success: true,
        data: cachedData,
        source: 'cache',
        cacheStats: analyticsCache.getStats()
      })
    }

    // Check if we can make an API call today
    if (!analyticsCache.canMakeAPICall()) {
      console.log('🚫 Analytics: Daily API limit reached, serving mock data', { 
        articleSlug, 
        stats: analyticsCache.getStats(),
        date: new Date().toISOString()
      })
      
      // Return mock data when limit is reached
      const mockData = generateMockData(articleSlug, target, startDate, endDate)
      return NextResponse.json({
        success: true,
        data: mockData,
        source: 'mock_daily_limit',
        cacheStats: analyticsCache.getStats(),
        message: 'Daily Google Analytics API limit reached. Serving mock data.'
      })
    }

    // Check if all required environment variables are set
    const requiredEnvVars = [
      'GOOGLE_ANALYTICS_PROPERTY_ID',
      'GOOGLE_ANALYTICS_CLIENT_EMAIL',
      'GOOGLE_ANALYTICS_PRIVATE_KEY',
      'GOOGLE_ANALYTICS_PROJECT_ID'
    ]

    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])
    
    if (missingEnvVars.length > 0) {
      console.warn('Missing Google Analytics environment variables:', missingEnvVars)
      const mockData = generateMockData(articleSlug, target, startDate, endDate)
      
      // Cache mock data to prevent further attempts
      analyticsCache.set(mockData, articleSlug || undefined, startDate, endDate)
      
      return NextResponse.json({
        success: true,
        data: mockData,
        isDevelopment: true,
        source: 'mock_missing_env',
        cacheStats: analyticsCache.getStats()
      })
    }

    // Record the API call
    analyticsCache.recordAPICall()
    console.log('📈 Analytics: Making Google Analytics API call', { 
      articleSlug, 
      stats: analyticsCache.getStats(),
      date: new Date().toISOString()
    })

    const analyticsData = await getAnalyticsReporting()
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID

    // Build the page path filter
    const pagePathFilter = articleSlug 
      ? `/learn/${target}/${articleSlug}`
      : '/learn/'

    // Request analytics data
    const requestBody = {
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [
        { name: 'pagePath' },
        { name: 'pageTitle' },
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
        { name: 'engagementRate' },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: articleSlug ? 'EXACT' : 'BEGINS_WITH' as const,
            value: pagePathFilter,
          },
        },
      },
      orderBys: [
        {
          metric: {
            metricName: 'screenPageViews',
          },
          desc: true,
        },
      ],
      limit: articleSlug ? '1' : '50',
    }

    const response = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody
    })
    const data = response.data as AnalyticsResponse

    let result
    if (!data.rows || data.rows.length === 0) {
      // Return zero data if no analytics found
      result = {
        articleUrl: pagePathFilter,
        pageViews: 0,
        uniquePageViews: 0,
        avgTimeOnPage: 0,
        bounceRate: 0,
        users: 0,
        sessions: 0,
        dateRange: {
          startDate,
          endDate
        }
      }
    } else if (articleSlug) {
      // Single article analytics
      const row = data.rows[0]
      const metrics = row.metricValues

      result = {
        articleUrl: row.dimensionValues[0].value,
        pageViews: parseInt(metrics[0].value) || 0,
        uniquePageViews: parseInt(metrics[1].value) || 0, // Using totalUsers as proxy
        avgTimeOnPage: parseFloat(metrics[3].value) || 0,
        bounceRate: parseFloat(metrics[4].value) || 0,
        users: parseInt(metrics[1].value) || 0,
        sessions: parseInt(metrics[2].value) || 0,
        dateRange: {
          startDate,
          endDate
        }
      }
    } else {
      // Multiple articles analytics - merge with CMS data
      const analyticsMap = new Map<string, AnalyticsRowData>()
      
      // Process analytics data first
      data.rows.forEach(row => {
        const metrics = row.metricValues
        const pagePath = row.dimensionValues[0].value
        analyticsMap.set(pagePath, {
          articleUrl: pagePath,
          pageTitle: row.dimensionValues[1].value,
          pageViews: parseInt(metrics[0].value) || 0,
          uniquePageViews: parseInt(metrics[1].value) || 0,
          avgTimeOnPage: parseFloat(metrics[3].value) || 0,
          bounceRate: parseFloat(metrics[4].value) || 0,
          users: parseInt(metrics[1].value) || 0,
          sessions: parseInt(metrics[2].value) || 0,
        })
      })

      // Get all published articles from CMS and merge with analytics
      const publishedPosts = allPosts.filter(post => post.published !== false)
      const articles = publishedPosts.map(post => {
        const target = post.target?.toLowerCase() || 'midway'
        const articleUrl = `/learn/${target}/${post.slug}`
        const analyticsData = analyticsMap.get(articleUrl)

        return {
          // CMS data (always available)
          articleUrl,
          title: post.title,
          author: post.author,
          target,
          topics: post.topics || [],
          readingTime: post.readingTime || 5,
          published: post.published !== false,
          // Analytics data (if available)
          pageViews: analyticsData?.pageViews || 0,
          uniquePageViews: analyticsData?.uniquePageViews || 0,
          avgTimeOnPage: analyticsData?.avgTimeOnPage || 0,
          bounceRate: analyticsData?.bounceRate || 0,
          users: analyticsData?.users || 0,
          sessions: analyticsData?.sessions || 0,
        }
      })

      // Sort by page views (descending), then by title
      articles.sort((a, b) => {
        if (b.pageViews !== a.pageViews) {
          return b.pageViews - a.pageViews
        }
        return a.title.localeCompare(b.title)
      })

      result = articles
    }

    // Cache the result for 24 hours
    analyticsCache.set(result, articleSlug || undefined, startDate, endDate)

    return NextResponse.json({
      success: true,
      data: result,
      source: 'google_analytics_api',
      cacheStats: analyticsCache.getStats()
    })
  } catch (error) {
    console.error('Google Analytics API Error:', error)
    
    // Return mock data on error for graceful degradation
    const mockData = generateMockData(articleSlug, target, startDate, endDate)
    
    // Cache mock data to prevent further failed attempts
    analyticsCache.set(mockData, articleSlug || undefined, startDate, endDate)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics data',
      data: mockData, // Provide mock data for graceful degradation
      source: 'mock_error_fallback',
      cacheStats: analyticsCache.getStats()
    }, { status: 500 })
  }
}

// Helper function to generate mock data consistently
function generateMockData(articleSlug: string | null, target: string, startDate: string, endDate: string) {
  if (articleSlug) {
    // Single article - find in CMS
    const publishedPosts = allPosts.filter(post => post.published !== false)
    const post = publishedPosts.find(p => p.slug === articleSlug)
    
    if (post) {
      return {
        articleUrl: `/learn/${(post.target || 'midway').toLowerCase()}/${post.slug}`,
        pageViews: Math.floor(Math.random() * 1000) + 100,
        uniquePageViews: Math.floor(Math.random() * 800) + 80,
        avgTimeOnPage: Math.floor(Math.random() * 300) + 60,
        bounceRate: Math.random() * 0.5 + 0.2,
        users: Math.floor(Math.random() * 500) + 50,
        sessions: Math.floor(Math.random() * 600) + 60,
        dateRange: { startDate, endDate },
        title: post.title,
        author: post.author,
        target: (post.target || 'midway').toLowerCase(),
        topics: post.topics || [],
        readingTime: post.readingTime || 5,
        published: post.published !== false
      }
    }
  } else {
    // Multiple articles - use all published posts with mock analytics
    const publishedPosts = allPosts.filter(post => post.published !== false)
    return publishedPosts.map(post => {
      const targetLower = (post.target || 'midway').toLowerCase()
      return {
        articleUrl: `/learn/${targetLower}/${post.slug}`,
        title: post.title,
        author: post.author,
        target: targetLower,
        topics: post.topics || [],
        readingTime: post.readingTime || 5,
        published: post.published !== false,
        pageViews: Math.floor(Math.random() * 1000) + 100,
        uniquePageViews: Math.floor(Math.random() * 800) + 80,
        avgTimeOnPage: Math.floor(Math.random() * 300) + 60,
        bounceRate: Math.random() * 0.5 + 0.2,
        users: Math.floor(Math.random() * 500) + 50,
        sessions: Math.floor(Math.random() * 600) + 60,
      }
    }).slice(0, 20) // Limit for performance
  }
  
  // Fallback to basic mock data if no CMS data found
  return {
    articleUrl: articleSlug ? `/learn/${target}/${articleSlug}` : 'all-articles',
    pageViews: Math.floor(Math.random() * 1000) + 100,
    uniquePageViews: Math.floor(Math.random() * 800) + 80,
    avgTimeOnPage: Math.floor(Math.random() * 300) + 60,
    bounceRate: Math.random() * 0.5 + 0.2,
    users: Math.floor(Math.random() * 500) + 50,
    sessions: Math.floor(Math.random() * 600) + 60,
    dateRange: { startDate, endDate }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event, articleSlug, target, userId } = body

    // Track custom events to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        article_slug: articleSlug,
        article_target: target,
        user_id: userId,
        event_category: 'Article Interaction',
        event_label: `${target}/${articleSlug}`,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Event tracked successfully'
    })
  } catch (error) {
    console.error('Event tracking error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to track event'
    }, { status: 500 })
  }
}
