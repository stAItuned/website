import { getPublicWriter } from '@/lib/writer/firestore'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params
  const writer = await getPublicWriter(slug)

  if (!writer) {
    return NextResponse.json({ error: 'Writer not found' }, { status: 404 })
  }

  const response = NextResponse.json(writer)
  response.headers.set(
    'Cache-Control',
    'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
  )
  return response
}
