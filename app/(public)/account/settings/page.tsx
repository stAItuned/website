'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { useRouter } from 'next/navigation'
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore'
import { app } from '@/lib/firebase/client'
import Link from 'next/link'
import { MyArticles } from '@/components/account/MyArticles'
import { CostMonitoringDashboard } from '@/components/admin/CostMonitoringDashboard'
import { isAdmin } from '@/lib/firebase/admin-emails'
import { AgreementModal } from '@/components/account/AgreementModal'

export default function AccountSettingsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showDataDeleteConfirm, setShowDataDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [showAgreement, setShowAgreement] = useState(false)

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (!authLoading && !user) {
      localStorage.setItem('redirectAfterLogin', '/account/settings')
      router.push('/signin')
      return
    }

    // Fetch user data
    const fetchUserData = async () => {
      if (!user) return

      try {
        const db = getFirestore(app)
        const userDocRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          setUserData(userDoc.data())
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user, authLoading, router])

  const handleDeleteData = async () => {
    if (!user) return

    setDeleting(true)
    setError('')

    try {
      const db = getFirestore(app)
      const userDocRef = doc(db, 'users', user.uid)

      // Delete user data from Firestore
      await deleteDoc(userDocRef)

      setUserData(null)
      setShowDataDeleteConfirm(false)
      alert('Your data has been successfully deleted. Your account remains active.')
    } catch (error) {
      console.error('Error deleting user data:', error)
      setError('Failed to delete data. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirmText !== 'DELETE') {
      setError('Please type DELETE to confirm')
      return
    }

    setDeleting(true)
    setError('')

    try {
      // First delete Firestore data
      const db = getFirestore(app)
      const userDocRef = doc(db, 'users', user.uid)
      await deleteDoc(userDocRef)

      // Then delete the Firebase Auth account
      const response = await fetch('/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      // Sign out and redirect
      const { signOutUser } = await import('@/lib/firebase/auth')
      await signOutUser()

      router.push('/')
      alert('Your account has been permanently deleted.')
    } catch (error) {
      console.error('Error deleting account:', error)
      setError('Failed to delete account. Please try again or contact support.')
    } finally {
      setDeleting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent mb-2">
            Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account data and privacy settings
          </p>
        </div>

        {/* Account Info */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Account Information
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {user?.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-16 h-16 rounded-full border-2 border-primary-200"
                />
              )}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">{user?.displayName || 'Not set'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-semibold text-gray-900 dark:text-white">{user?.email}</p>
            </div>
            {userData?.createdAt && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Member since</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {new Date(userData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* My Articles (Only shows if user is an author) */}
        {user?.email && <MyArticles userEmail={user.email} />}

        {/* Cost Monitoring (Admin Only) */}
        {user?.email && isAdmin(user.email) && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-6">
            <CostMonitoringDashboard />
          </div>
        )}

        {/* Your Data */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Your Data
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Bookmarks</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userData?.bookmarks?.length || 0} saved articles
                </p>
              </div>
              <Link
                href="/bookmarks"
                className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                View
              </Link>
            </div>

            {userData && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-red-900 dark:text-red-200">Delete Your Data</p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      This will permanently delete all your data (bookmarks, preferences) but keep your account active.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDataDeleteConfirm(true)}
                    disabled={deleting}
                    className="ml-4 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                  >
                    Delete Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Legal & Agreements */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Legal & Agreements
          </h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Contributor Agreement</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View the terms for submitting articles to stAItuned.
              </p>
            </div>
            <button
              onClick={() => setShowAgreement(true)}
              className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20"
            >
              Read Agreement
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 border-red-300 dark:border-red-800 p-6">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Danger Zone
          </h2>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="font-semibold text-red-900 dark:text-red-200 mb-2">Delete Account</p>
            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
              Once you delete your account, there is no going back. This will permanently delete your account and all associated data.
            </p>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleting}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Delete Data Confirmation Modal */}
        {showDataDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Data Deletion</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete all your data? This will remove:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-1">
                <li>All bookmarks ({userData?.bookmarks?.length || 0})</li>
                <li>User preferences</li>
                <li>Account metadata</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Your account will remain active and you can continue using the site.
              </p>
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDataDeleteConfirm(false)
                    setError('')
                  }}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteData}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete Data'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Permanently Delete Account</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                This action <strong>cannot be undone</strong>. This will permanently delete:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6 space-y-1">
                <li>Your account and authentication</li>
                <li>All bookmarks and preferences</li>
                <li>All personal data</li>
              </ul>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Type <span className="text-red-600">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => {
                    setDeleteConfirmText(e.target.value)
                    setError('')
                  }}
                  placeholder="DELETE"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText('')
                    setError('')
                  }}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteConfirmText !== 'DELETE'}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Delete Forever'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AgreementModal
        isOpen={showAgreement}
        onClose={() => setShowAgreement(false)}
      />
    </main >
  )
}

function AgreementSection({ onOpen }: { onOpen: () => void }) {
  return null; // Inline above instead
}
