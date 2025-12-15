import { NextRequest, NextResponse } from 'next/server'
import { allPosts } from '@/lib/contentlayer'
import { fetchMultipleArticlesAnalytics } from '@/lib/analytics-server'
import { getAuthorByEmail } from '@/lib/getAuthorByEmail'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const email = searchParams.get('email')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '6')
        const sortBy = searchParams.get('sortBy') || 'date'
        const sortOrder = searchParams.get('sortOrder') || 'desc'

        if (!email) {
            return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
        }

        // 1. Find the author
        const authorName = getAuthorByEmail(email)

        if (!authorName) {
            return NextResponse.json({
                success: true,
                data: [],
                pagination: {
                    total: 0,
                    pages: 0,
                    current: page
                },
                author: null
            })
        }

        // 2. Get ALL articles by this author
        const authorArticles = allPosts.filter(post => {
            // Check if post has an author field and it matches
            return post.author === authorName
        })

        // 3. Batch fetch analytics for ALL articles (needed for sorting)
        // We only need to fetch analytics if we are sorting by an analytics metric
        // OR if we want to display analytics for all items (which we do)
        const slugs = authorArticles.map(a => a.slug)
        const analyticsMap = await fetchMultipleArticlesAnalytics(slugs)

        // 4. Combine data
        const articlesWithAnalytics = authorArticles.map(article => {
            const analytics = analyticsMap[article.slug] || {
                pageViews: 0,
                users: 0,
                sessions: 0,
                avgTimeOnPage: 0,
                bounceRate: 0,
                likes: 0,
                updatedAt: null
            }

            // Resolve cover image path
            let cover = article.cover
            if (cover && !cover.startsWith('http') && !cover.startsWith('/')) {
                const cleanCover = cover.replace(/^\.\//, '')
                cover = `${article.imagePath}/${cleanCover}`
            }

            return {
                title: article.title,
                slug: article.slug,
                cover: cover,
                date: article.date,
                target: article.target,
                readingTime: article.readingTime,
                url: article.url,
                analytics
            }
        })

        // 5. Sort
        articlesWithAnalytics.sort((a, b) => {
            let valA, valB

            switch (sortBy) {
                case 'views':
                    valA = a.analytics.pageViews
                    valB = b.analytics.pageViews
                    break
                case 'readers':
                    valA = a.analytics.users
                    valB = b.analytics.users
                    break
                case 'time':
                    valA = a.analytics.avgTimeOnPage
                    valB = b.analytics.avgTimeOnPage
                    break
                case 'date':
                default:
                    valA = new Date(a.date).getTime()
                    valB = new Date(b.date).getTime()
                    break
            }

            if (sortOrder === 'asc') {
                return valA > valB ? 1 : -1
            } else {
                return valA < valB ? 1 : -1
            }
        })

        // 6. Paginate
        const total = articlesWithAnalytics.length
        const totalPages = Math.ceil(total / limit)
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedData = articlesWithAnalytics.slice(startIndex, endIndex)

        return NextResponse.json({
            success: true,
            data: paginatedData,
            pagination: {
                total,
                pages: totalPages,
                current: page
            },
            author: {
                name: authorName
            }
        }, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
            }
        })

    } catch (error) {
        console.error('Error fetching account articles:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch articles' }, { status: 500 })
    }
}
