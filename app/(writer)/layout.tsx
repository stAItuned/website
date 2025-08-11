import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function WriterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // For development, skip auth check
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900">Writer Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Development Mode</span>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </div>
    )
  }

  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Writer Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {session.user?.name}</span>
              <img
                src={session.user?.image || ''}
                alt={session.user?.name || ''}
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
