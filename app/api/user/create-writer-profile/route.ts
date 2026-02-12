import type { NextRequest } from 'next/server'

import { POST as upsertWriterProfile } from '@/app/api/user/writer-profile/route'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Backward-compatible alias for the old endpoint name.
 * Source of truth is `/api/user/writer-profile`.
 */
export async function POST(request: NextRequest) {
  return upsertWriterProfile(request)
}

