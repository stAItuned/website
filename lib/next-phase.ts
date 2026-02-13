export function isNextProductionBuild(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build'
}

/**
 * During `next build`, App Router will execute Server Components to prerender
 * static routes. In CI/sandboxed environments this may not have DNS/egress,
 * so server-side Firestore fetches can fail (gRPC UNAVAILABLE).
 *
 * Default: skip Firestore network calls during build-time prerender.
 * Override by setting `NEXT_BUILD_ALLOW_FIRESTORE=1`.
 */
export function shouldSkipFirestoreDuringBuild(): boolean {
  return isNextProductionBuild() && process.env.NEXT_BUILD_ALLOW_FIRESTORE !== '1'
}

