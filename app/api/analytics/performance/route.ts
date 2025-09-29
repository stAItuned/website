import { NextRequest, NextResponse } from 'next/server'

interface PerformanceMetric {
  metric: string
  value: number
  url: string
  timestamp: number
  userAgent: string
}

export async function POST(request: NextRequest) {
  try {
    const data: PerformanceMetric = await request.json()
    
    // Validate the data
    if (!data.metric || typeof data.value !== 'number') {
      return NextResponse.json({ error: 'Invalid metric data' }, { status: 400 })
    }
    
    // In development, just log the metrics
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 Performance Metric Received:`, {
        metric: data.metric,
        value: `${data.value}ms`,
        url: data.url,
        grade: getPerformanceGrade(data.metric, data.value)
      })
      
      return NextResponse.json({ status: 'logged' })
    }
    
    // In production, you can:
    // 1. Store in your database
    // 2. Send to Google Analytics
    // 3. Send to monitoring services (DataDog, New Relic, etc.)
    
    // Example: Store in your analytics system
    // await storePerformanceMetric(data)
    
    // Example: Send to Google Analytics 4
    if (process.env.GA_MEASUREMENT_ID) {
      await sendToGA4(data)
    }
    
    return NextResponse.json({ status: 'success' })
    
  } catch (error) {
    console.error('Error processing performance metric:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to grade performance based on Google's thresholds
function getPerformanceGrade(metric: string, value: number): string {
  const thresholds: Record<string, { good: number; poor: number }> = {
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    TTFB: { good: 600, poor: 1500 },
  }
  
  const threshold = thresholds[metric]
  if (!threshold) return 'unknown'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

// Example function to send to Google Analytics 4
async function sendToGA4(data: PerformanceMetric) {
  const GA_MEASUREMENT_ID = process.env.GA_MEASUREMENT_ID
  const GA_API_SECRET = process.env.GA_API_SECRET
  
  if (!GA_MEASUREMENT_ID || !GA_API_SECRET) return
  
  try {
    await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`, {
      method: 'POST',
      body: JSON.stringify({
        client_id: 'web-performance', // You might want to use a real client ID
        events: [{
          name: 'web_vitals',
          params: {
            metric_name: data.metric,
            metric_value: data.value,
            page_location: data.url,
            custom_parameter_1: getPerformanceGrade(data.metric, data.value)
          }
        }]
      })
    })
  } catch (error) {
    console.error('Failed to send to GA4:', error)
  }
}
