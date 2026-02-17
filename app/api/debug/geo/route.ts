
import { NextResponse } from 'next/server'
import { allPosts } from '@/lib/contentlayer'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    try {
        console.log('[DEBUG API] /api/debug/geo called')
        const { searchParams } = new URL(request.url)
        const slug = searchParams.get('slug')

        if (!slug) {
            console.log('[DEBUG API] Missing slug')
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
        }

        console.log('[DEBUG API] Searching for slug:', slug)
        const article = allPosts.find((post: any) => post.slug === slug)

        if (!article) {
            console.log('[DEBUG API] Article not found. allPosts length:', allPosts.length)
            return NextResponse.json({ error: 'Article not found' }, { status: 404 })
        }

        console.log('[DEBUG API] Article found:', article.title)
        console.log('[DEBUG API] Article keys:', Object.keys(article))
        console.log('[DEBUG API] article.geo:', article.geo)

        return NextResponse.json({
            title: article.title,
            slug: article.slug,
            geo: article.geo || 'MISSING',
            raw_keys: Object.keys(article)
        })
    } catch (error) {
        console.error('[DEBUG API] INTERNAL ERROR:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
