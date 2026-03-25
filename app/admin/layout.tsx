import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminAppShell } from '@/components/admin/AdminAppShell'
import { verifySessionCookieValue } from '@/lib/firebase/server-auth'
import { AUTH_SESSION_COOKIE_NAME } from '@/lib/auth/session'
import { isAdmin } from '@/lib/firebase/admin-emails'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutGate>{children}</AdminLayoutGate>
}

async function AdminLayoutGate({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(AUTH_SESSION_COOKIE_NAME)?.value

  if (!sessionCookie) {
    redirect('/signin?redirect=/admin')
  }

  const user = await verifySessionCookieValue(sessionCookie)
  if (!user) {
    redirect('/signin?redirect=/admin')
  }

  if (!isAdmin(user.email)) {
    redirect('/403')
  }

  return <AdminAppShell>{children}</AdminAppShell>
}
