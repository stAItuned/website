import { NextRequest, NextResponse } from 'next/server'
import { allPosts, allTeams } from '@/lib/contentlayer'
import { fetchArticleAnalytics } from '@/lib/analytics-server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, page = 1, limit = 6 } = body

        if (!email) {
            return NextResponse.json(
                { success: false, error: 'Email is required' },
                { status: 400 }
            )
        }

        // 1. Find author by email
        const normalizedEmail = email.toLowerCase().trim()
        const teamMember = allTeams.find((member: any) =>
            member.email?.toLowerCase().trim() === normalizedEmail
        )

        if (!teamMember || !teamMember.name) {
            return NextResponse.json({
                success: true,
                data: [], // No author found for this email
                pagination: {
                    total: 0,
                    pages: 0,
                    current: 1
                },
                message: 'User is not a registered author'
            })
        }

        const authorName = teamMember.name

        // 2. Find articles by author
        const allAuthorArticles = allPosts
            .filter(post => post.author === authorName && post.published !== false)
            .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())

        const totalArticles = allAuthorArticles.length

        if (totalArticles === 0) {
            return NextResponse.json({
                success: true,
                data: [],
                pagination: {
                    total: 0,
                    pages: 0,
                    current: 1
                }
            })
        }

        // Pagination values
        const currentPage = Math.max(1, parseInt(page.toString()))
        const itemsPerPage = Math.max(1, parseInt(limit.toString()))
        const totalPages = Math.ceil(totalArticles / itemsPerPage)

        // Slice articles for current page
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const paginatedArticles = allAuthorArticles.slice(startIndex, endIndex)

        // 3. Fetch analytics for these articles
        // We fetch in parallel using the existing server-side function
        const articlesWithAnalytics = await Promise.all(
            paginatedArticles.map(async (article) => {
                const analytics = await fetchArticleAnalytics(article.slug)

                // Resolve cover image path
                let cover = article.cover
                if (cover && !cover.startsWith('http') && !cover.startsWith('/')) {
                    // It's a relative path, prepend the imagePath
                    // Remove potential leading ./
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
        )

        return NextResponse.json({
            success: true,
            data: articlesWithAnalytics,
            pagination: {
                total: totalArticles,
                pages: totalPages,
                current: currentPage
            },
            author: {
                name: authorName,
                role: teamMember.title
            }
        })

    } catch (error) {
        console.error('Error fetching author articles:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
