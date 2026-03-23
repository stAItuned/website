import type { ReactNode } from 'react'
import { PRIVATE_ROUTE_METADATA } from '@/lib/seo/privateRouteMetadata'

export const metadata = PRIVATE_ROUTE_METADATA

export default function BookmarksLayout({ children }: { children: ReactNode }) {
  return children
}
