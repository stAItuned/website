import { NextRequest, NextResponse } from 'next/server'
import { allPosts } from '@/lib/contentlayer'
import { fetchArticleAnalytics, fetchMultipleArticlesAnalytics } from '@/lib/analytics-server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const articleSlug = searchParams.get('slug')
  // Only support the default range (last 365 days / 1 year) for now
  // (You can extend this to support custom ranges if you store history in Firestore)
  try {
    if (articleSlug) {
      const article = allPosts.find((post) => post.slug === articleSlug)
      const analytics = await fetchArticleAnalytics(articleSlug)
      if (
        !article &&
        analytics.pageViews === 0 &&
        analytics.users === 0 &&
        analytics.sessions === 0 &&
        analytics.avgTimeOnPage === 0 &&
        analytics.bounceRate === 0 &&
        analytics.likes === 0 &&
        analytics.updatedAt === null
      ) {
        return NextResponse.json({
          success: true,
          data: null,
          source: 'firestore-canonical',
        })
      }
      return NextResponse.json({
        success: true,
        data: {
          ...analytics,
          articleUrl: article
            ? `/learn/${(article.target || 'midway').toLowerCase()}/${article.slug}`
            : null,
        },
        source: 'firestore-canonical',
      })
    } else {
      const publishedPosts = allPosts.filter(post => post.published !== false)
      const analyticsBySlug = await fetchMultipleArticlesAnalytics(publishedPosts.map((post) => post.slug))

      const articles = publishedPosts.map(post => {
        const rawTarget = post.target || 'Midway'
        const urlTarget = rawTarget.toLowerCase()
        const slug = post.slug
        const stats = analyticsBySlug[slug]
        // Ensure all values are JSON-serializable (convert Date to ISO string)
        return {
          articleUrl: `/learn/${urlTarget}/${slug}`,
          title: post.title,
          author: post.author,
          cover: post.cover,
          date: post.date, // Add publication date
          language: post.language,
          target: rawTarget,
          topics: post.topics || [],
          readingTime: post.readingTime || 5,
          published: post.published !== false,
          pageViews: stats?.pageViews || 0,
          uniquePageViews: stats?.users || 0,
          avgTimeOnPage: stats?.avgTimeOnPage || 0,
          bounceRate: stats?.bounceRate || 0,
          users: stats?.users || 0,
          sessions: stats?.sessions || 0,
          updatedAt: stats?.updatedAt ?? null,
        }
      })
      // Sort by page views (descending), then by title
      articles.sort((a, b) => {
        if (b.pageViews !== a.pageViews) {
          return b.pageViews - a.pageViews
        }
        return a.title.localeCompare(b.title)
      })
      return NextResponse.json({
        success: true,
        data: articles,
        source: 'firestore',
      })
    }
  } catch (error) {
    console.error('Firestore Analytics API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch analytics data from Firestore',
      data: null,
      source: 'firestore_error',
    }, { status: 500 })
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
