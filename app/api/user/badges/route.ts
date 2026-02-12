import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/firebase/server-auth'
import { getWriterByUid } from '@/lib/writer/firestore'
import { getAuthorBadges } from '@/lib/firebase/badge-service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)

    if (!user?.uid) {
      return NextResponse.json({ success: true, isWriter: false, badges: [] }, { status: 200 })
    }

    const profile = await getWriterByUid(user.uid)
    if (!profile) {
      return NextResponse.json({ success: true, isWriter: false, badges: [] }, { status: 200 })
    }

    const badges = await getAuthorBadges(profile.slug)
    return NextResponse.json({ success: true, isWriter: true, badges }, { status: 200 })
  } catch (error) {
    console.error('[API] user badges error:', error)
    return NextResponse.json({ success: false, error: 'Failed to load badges' }, { status: 500 })
  }
}
