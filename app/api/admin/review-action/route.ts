import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyAuth } from '@/lib/firebase/server-auth'
import { isAdmin } from '@/lib/firebase/admin-emails'
import { getContribution, updateContribution } from '@/lib/firebase/contributor-db'
import { ContributionStatus, ContributionReviewHistoryEntry } from '@/lib/types/contributor'

export const dynamic = 'force-dynamic'

const reviewActionSchema = z.object({
  id: z.string().min(1),
  action: z.enum(['approve', 'reject', 'changes']),
  note: z.string().trim().max(2000).optional(),
})

/**
 * Admin-only: apply a review action to a contribution.
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
    const parsed = reviewActionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { id, action, note } = parsed.data
    const existing = await getContribution(id)
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Contribution not found' }, { status: 404 })
    }

    const timestamp = new Date().toISOString()
    const reviewStatus: ContributionReviewHistoryEntry['status'] =
      action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'changes_requested'

    const nextStatus: ContributionStatus =
      action === 'approve' ? 'scheduled' : 'draft'

    const nextCurrentStep =
      action === 'approve' ? existing.currentStep : 'draft_submission'

    const existingStatusHistory = existing.statusHistory ?? []
    const existingReviewHistory = existing.reviewHistory ?? []

    const nextStatusHistory = [
      ...existingStatusHistory,
      {
        status: nextStatus,
        currentStep: nextCurrentStep,
        changedAt: timestamp,
        changedBy: user.email || 'admin',
        note: note || undefined,
      },
    ]

    const nextReviewHistory = [
      ...existingReviewHistory,
      {
        action: reviewStatus,
        status: reviewStatus,
        note: note || undefined,
        updatedAt: timestamp,
        reviewerEmail: user.email || 'admin',
      },
    ]

    await updateContribution(id, {
      status: nextStatus,
      currentStep: nextCurrentStep,
      updatedAt: timestamp,
      lastSavedAt: timestamp,
      review: {
        status: reviewStatus,
        note: note || '',
        updatedAt: timestamp,
        reviewerEmail: user.email || 'admin',
      },
      statusHistory: nextStatusHistory,
      reviewHistory: nextReviewHistory,
    })

    return NextResponse.json({
      success: true,
      status: nextStatus,
      currentStep: nextCurrentStep,
      review: {
        status: reviewStatus,
        note: note || '',
        updatedAt: timestamp,
        reviewerEmail: user.email || 'admin',
      },
    })
  } catch (error) {
    console.error('[API] admin/review-action error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to apply review action' },
      { status: 500 }
    )
  }
}
