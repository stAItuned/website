import { NextRequest, NextResponse } from 'next/server'
import { listAdminFirstPartyPageViews } from '@/lib/admin/firstPartyPageViews'
import { verifyAdmin } from '@/lib/firebase/server-auth'

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin(request)
  if (auth.error) {
    return NextResponse.json({ success: false, error: auth.error }, { status: auth.status })
  }

  try {
    const rows = await listAdminFirstPartyPageViews()
    const totalViews = rows.reduce((sum, row) => sum + row.pageViews, 0)
    const pagesWithViews = rows.filter((row) => row.pageViews > 0).length

    return NextResponse.json({
      success: true,
      rows,
      summary: {
        trackedPages: rows.length,
        pagesWithViews,
        totalViews,
      },
      source: 'firestore:first-party',
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[API] admin/analytics/pages error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch first-party page views ranking' },
      { status: 500 }
    )
  }
}
