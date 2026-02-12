import { getPublicWritersList } from '@/lib/writer/firestore'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // We use unstable_cache inside, but the route handler can be dynamic

export async function GET() {
  const writers = await getPublicWritersList()
  const response = NextResponse.json(writers)
  response.headers.set(
    'Cache-Control',
    'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
  )
  return response
}
