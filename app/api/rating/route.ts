import { NextResponse } from 'next/server'
import { dbDefault } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'
import { sanitizeSlug } from '@/lib/sanitizeSlug'

/**
 * GET /api/rating?slug=article-slug
 * Retrieve current average rating for an article
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const slug = searchParams.get('slug')

        if (!slug) {
            return NextResponse.json({ success: false, error: 'Missing slug' }, { status: 400 })
        }

        const sanitizedSlug = sanitizeSlug(slug)
        const articleRef = dbDefault().collection('articles').doc(sanitizedSlug)
        const articleDoc = await articleRef.get()

        if (articleDoc.exists) {
            const data = articleDoc.data()
            return NextResponse.json({
                success: true,
                average: data?.ratingAverage ?? null,
                count: data?.ratingCount ?? 0
            })
        }

        return NextResponse.json({
            success: true,
            average: null,
            count: 0
        })
    } catch (error) {
        console.error('Rating GET API error', error)
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
    }
}

/**
 * POST /api/rating
 * Submit a new rating for an article
 * Body: { slug: string, rating: number (1-5) }
 */
export async function POST(request: Request) {
    try {
        const { slug, rating } = await request.json()

        // Validate input
        if (!slug || typeof rating !== 'number' || rating < 1 || rating > 5) {
            return NextResponse.json(
                { success: false, error: 'Invalid request. Rating must be 1-5.' },
                { status: 400 }
            )
        }

        const sanitizedSlug = sanitizeSlug(slug)
        const articleRef = dbDefault().collection('articles').doc(sanitizedSlug)
        const articleDoc = await articleRef.get()

        let newAverage: number
        let newCount: number

        if (articleDoc.exists) {
            const data = articleDoc.data()
            const currentTotal = (data?.ratingTotal ?? 0) as number
            const currentCount = (data?.ratingCount ?? 0) as number

            // Calculate new values
            newCount = currentCount + 1
            const newTotal = currentTotal + rating
            newAverage = newTotal / newCount

            // Update document
            await articleRef.update({
                ratingTotal: FieldValue.increment(rating),
                ratingCount: FieldValue.increment(1),
                ratingAverage: newAverage
            })
        } else {
            // Create new document
            newCount = 1
            newAverage = rating

            await articleRef.set({
                ratingTotal: rating,
                ratingCount: 1,
                ratingAverage: rating
            })
        }

        return NextResponse.json({
            success: true,
            average: Math.round(newAverage * 10) / 10, // Round to 1 decimal
            count: newCount
        })
    } catch (error) {
        console.error('Rating POST API error', error)
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
    }
}
