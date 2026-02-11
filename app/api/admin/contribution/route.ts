import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/firebase/server-auth'
import { isAdmin } from '@/lib/firebase/admin-emails'
import { getContribution } from '@/lib/firebase/contributor-db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request)

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (!isAdmin(user.email)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 })
    }

    const contribution = await getContribution(id)
    if (!contribution) {
      return NextResponse.json({ success: false, error: 'Contribution not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, contribution })
  } catch (error) {
    console.error('[API] admin/contribution error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contribution' },
      { status: 500 }
    )
  }
}

