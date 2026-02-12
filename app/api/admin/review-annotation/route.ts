import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyAuth } from '@/lib/firebase/server-auth'
import { isAdmin } from '@/lib/firebase/admin-emails'
import { getContribution, updateContribution } from '@/lib/firebase/contributor-db'

export const dynamic = 'force-dynamic'

const annotationSchema = z.object({
  id: z.string().min(1),
  start: z.number().int().min(0),
  end: z.number().int().min(1),
  note: z.string().trim().min(1).max(2000),
})

/**
 * Admin-only: add an inline annotation to a contribution draft.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (!isAdmin(user.email)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = annotationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { id, start, end, note } = parsed.data
    if (end <= start) {
      return NextResponse.json({ success: false, error: 'Invalid range' }, { status: 400 })
    }

    const existing = await getContribution(id)
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Contribution not found' }, { status: 404 })
    }

    const timestamp = new Date().toISOString()
    const currentAnnotations = existing.review?.annotations ?? []
    const existingReviewHistory = existing.reviewHistory ?? []
    const reviewStatus = existing.review?.status || 'changes_requested'
    const nextAnnotations = [
      ...currentAnnotations,
      {
        start,
        end,
        note,
        createdAt: timestamp,
        authorEmail: user.email || 'admin',
      },
    ]

    const nextReviewHistory = [
      ...existingReviewHistory,
      {
        action: 'annotation',
        status: reviewStatus,
        note,
        updatedAt: timestamp,
        reviewerEmail: user.email || 'admin',
      },
    ]

    await updateContribution(id, {
      review: {
        status: reviewStatus,
        note: existing.review?.note || '',
        updatedAt: timestamp,
        reviewerEmail: existing.review?.reviewerEmail || user.email || 'admin',
        annotations: nextAnnotations,
      },
      reviewHistory: nextReviewHistory,
      updatedAt: timestamp,
      lastSavedAt: timestamp,
    })

    return NextResponse.json({ success: true, annotations: nextAnnotations })
  } catch (error) {
    console.error('[API] admin/review-annotation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add annotation' },
      { status: 500 }
    )
  }
}
