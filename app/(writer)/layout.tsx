'use client'

import { AuthGuard } from "@/components/auth/AuthGuard"
import { useAuth } from "@/components/auth/AuthContext"
import Image from "next/image"

export default function WriterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <WriterLayoutContent>{children}</WriterLayoutContent>
    </AuthGuard>
  )
}

function WriterLayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Writer Dashboard</h1>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.displayName || user.email}</span>
                {user.photoURL && (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
