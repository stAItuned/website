'use client'

import dynamic from 'next/dynamic'

const AdminAppShell = dynamic(
  () => import('@/components/admin/AdminAppShell').then((mod) => mod.AdminAppShell),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900" aria-hidden="true" />
    ),
  },
)

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return <AdminAppShell>{children}</AdminAppShell>
}
