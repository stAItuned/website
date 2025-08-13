import { NextRequest, NextResponse } from 'next/server'
import { allPosts } from '@/lib/contentlayer'

interface ArticleData {
  slug: string
  title: string
  author?: string
  target: string
  topics: string[]
  date?: string
  cover?: string
  published?: boolean
  readingTime: number
  url: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const target = searchParams.get('target') // newbie, midway, expert, or all
  const author = searchParams.get('author')
  const published = searchParams.get('published') // filter by published status
  const limit = searchParams.get('limit')

  try {
    // Filter and process posts
    let filteredPosts = allPosts.filter(post => {
      // Filter by published status (default to published only)
      if (published !== 'false' && post.published === false) {
        return false
      }

      // Filter by target if specified
      if (target && target !== 'all' && post.target?.toLowerCase() !== target.toLowerCase()) {
        return false
      }

      // Filter by author if specified
      if (author && post.author !== author) {
        return false
      }

      return true
    })

    // Sort by date (most recent first)
    filteredPosts.sort((a, b) => {
      const dateA = new Date(a.date || '1970-01-01')
      const dateB = new Date(b.date || '1970-01-01')
      return dateB.getTime() - dateA.getTime()
    })

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredPosts = filteredPosts.slice(0, limitNum)
      }
    }

    // Transform to consistent format
    const articles: ArticleData[] = filteredPosts.map(post => {
      const target = post.target || 'midway'
      return {
        slug: post.slug,
        title: post.title,
        author: post.author,
        target: target.toLowerCase(),
        topics: post.topics || [],
        date: post.date,
        cover: post.cover,
        published: post.published !== false,
        readingTime: post.readingTime || 5,
        url: `/learn/${target.toLowerCase()}/${post.slug}`
      }
    })

    return NextResponse.json({
      success: true,
      data: articles,
      total: articles.length,
      filters: {
        target: target || 'all',
        author: author || 'all',
        published: published !== 'false'
      }
    })
  } catch (error) {
    console.error('Articles API Error:', error)
    
    // Return empty array on error for graceful degradation
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch articles',
      data: [],
      total: 0
    }, { status: 500 })
  }
}

// Get article statistics
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'stats') {
      // Calculate article statistics
      const totalArticles = allPosts.length
      const publishedArticles = allPosts.filter(post => post.published !== false).length
      const draftArticles = totalArticles - publishedArticles

      const authorStats = allPosts.reduce((acc, post) => {
        if (post.author) {
          acc[post.author] = (acc[post.author] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>)

      const targetStats = allPosts.reduce((acc, post) => {
        const target = post.target?.toLowerCase() || 'midway'
        acc[target] = (acc[target] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const topicStats = allPosts.reduce((acc, post) => {
        if (post.topics) {
          post.topics.forEach((topic: string) => {
            acc[topic] = (acc[topic] || 0) + 1
          })
        }
        return acc
      }, {} as Record<string, number>)

      return NextResponse.json({
        success: true,
        data: {
          total: totalArticles,
          published: publishedArticles,
          drafts: draftArticles,
          byAuthor: authorStats,
          byTarget: targetStats,
          byTopic: topicStats
        }
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Unknown action'
    }, { status: 400 })
  } catch (error) {
    console.error('Articles stats API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch article statistics'
    }, { status: 500 })
  }
}
