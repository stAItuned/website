import { NextRequest, NextResponse } from 'next/server'
import { allPosts } from '@/lib/contentlayer'
import { db } from '@/lib/firebase/admin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const articleSlug = searchParams.get('slug')
  // Only support the default range (last 90 days) for now
  // (You can extend this to support custom ranges if you store history in Firestore)
  try {
    if (articleSlug) {
      // Single article: read from articles/{slug}
      // Slug is sanitized in Firestore (slashes replaced with hyphens, special chars removed)
      const sanitizedSlug = articleSlug
        .replace(/[/\\]/g, '-')
        .replace(/[^a-zA-Z0-9\-_]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      const docRef = db().collection('articles').doc(sanitizedSlug)
      const snap = await docRef.get()
      if (!snap.exists) {
        return NextResponse.json({
          success: true,
          data: null,
          source: 'firestore',
        })
      }
      const data = snap.data()
      // Ensure all values are JSON-serializable (convert Date to ISO string)
      let safeData = null;
      if (data) {
        const { updatedAt, ...rest } = data;
        safeData = {
          ...rest,
          updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt ?? null,
          articleUrl: `/learn/${data.target}/${data.originalSlug || articleSlug}`,
        };
      }
      return NextResponse.json({
        success: true,
        data: safeData,
        source: 'firestore',
      })
    } else {
      // All articles: read from analytics/daily (or analytics/summaries)
      const docRef = db().doc('analytics/daily')
      const snap = await docRef.get()
      if (!snap.exists) {
        return NextResponse.json({
          success: true,
          data: [],
          source: 'firestore',
        })
      }
      const daily = snap.data()
      if (!daily) {
        return NextResponse.json({
          success: true,
          data: [],
          source: 'firestore',
        })
      }
      // Merge with CMS data for full article info
      const publishedPosts = allPosts.filter(post => post.published !== false)
      const articles = publishedPosts.map(post => {
        const target = post.target?.toLowerCase() || 'midway'
        const slug = post.slug
        const stats = daily.articlesStats?.[slug] || {}
        // Ensure all values are JSON-serializable (convert Date to ISO string)
        return {
          articleUrl: `/learn/${target}/${slug}`,
          title: post.title,
          author: post.author,
          target,
          topics: post.topics || [],
          readingTime: post.readingTime || 5,
          published: post.published !== false,
          // Analytics data (if available)
          pageViews: stats.pageViews || 0,
          uniquePageViews: stats.users || 0, // Use users as uniquePageViews
          avgTimeOnPage: stats.avgTimeOnPage || 0,
          bounceRate: stats.bounceRate || 0,
          users: stats.users || 0,
          sessions: stats.sessions || 0,
          updatedAt: stats.updatedAt instanceof Date ? stats.updatedAt.toISOString() : stats.updatedAt ?? null,
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
