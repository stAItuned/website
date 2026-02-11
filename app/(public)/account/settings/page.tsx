'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore'
import { useAuth } from '@/components/auth/AuthContext'
import { app } from '@/lib/firebase/client'
import { useWriterStatus } from '@/components/auth/WriterStatusContext'
import { AgreementModal } from '@/components/account/AgreementModal'
import { AccountSettingsLoading } from '@/components/account/settings/AccountSettingsLoading'
import { AccountSettingsShell } from '@/components/account/settings/AccountSettingsShell'
import { DeleteAccountModal, DeleteDataModal } from '@/components/account/settings/AccountSettingsModals'
import { isAdmin } from '@/lib/firebase/admin-emails'

interface FirestoreTimestampLike {
  seconds: number
  nanoseconds: number
}

interface UserData {
  createdAt?: string | number | Date | FirestoreTimestampLike | { toDate: () => Date }
  bookmarks?: string[]
}

const resolveMemberSince = (createdAt?: UserData['createdAt']) => {
  if (!createdAt) return null
  if (createdAt instanceof Date) return createdAt
  if (typeof createdAt === 'string' || typeof createdAt === 'number') {
    const parsed = new Date(createdAt)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  if (typeof createdAt === 'object') {
    const maybe = createdAt as { toDate?: () => Date; seconds?: number }
    if (typeof maybe.toDate === 'function') return maybe.toDate()
    if (typeof maybe.seconds === 'number') return new Date(maybe.seconds * 1000)
  }
  return null
}

/**
 * Account settings content component that uses search params.
 */
function AccountSettingsContent() {
  const { user, loading: authLoading } = useAuth()
  const { isWriter, loading: writerStatusLoading } = useWriterStatus()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showDataDeleteConfirm, setShowDataDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [showAgreement, setShowAgreement] = useState(false)
  const [contributions, setContributions] = useState<any[]>([])
  const [agreementData, setAgreementData] = useState<any>(null)
  const [activeAdminTab, setActiveAdminTab] = useState<'contributions' | 'role_fit'>('contributions')
  const activeTab = searchParams.get('tab')

  useEffect(() => {
    if (activeTab === 'in_progress') {
      const element = document.getElementById('contributor-section')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        element.classList.add('ring-2', 'ring-primary-500', 'ring-offset-4')
        setTimeout(() => {
          element.classList.remove('ring-2', 'ring-primary-500', 'ring-offset-4')
        }, 3000)
      }
    }
  }, [activeTab])

  useEffect(() => {
    if (!authLoading && !user) {
      localStorage.setItem('redirectAfterLogin', '/account/settings')
      router.push('/signin')
      return
    }

    const fetchUserData = async () => {
      if (!user) return
      try {
        const db = getFirestore(app)
        const userDocRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData)
        }

        // Fetch Contributions to get Agreement
        const res = await fetch('/api/contributor/get-progress', {
          headers: { 'Authorization': `Bearer ${await user.getIdToken()}` }
        })
        const json = await res.json()
        if (json.success && json.contributions) {
          setContributions(json.contributions)
          // Find the latest contribution with an agreement
          const latestWithAgreement = json.contributions
            .filter((c: any) => c.agreement?.agreed)
            .sort((a: any, b: any) => new Date(b.agreement.agreedAt).getTime() - new Date(a.agreement.agreedAt).getTime())[0]

          if (latestWithAgreement) {
            setAgreementData(latestWithAgreement.agreement)
          }
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
      const db = getFirestore(app)
      const userDocRef = doc(db, 'users', user.uid)
      await deleteDoc(userDocRef)
      const response = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid }),
      })
      if (!response.ok) throw new Error('Failed to delete account')
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

  const memberSince = useMemo(() => resolveMemberSince(userData?.createdAt), [userData?.createdAt])
  const bookmarksCount = userData?.bookmarks?.length ?? 0
  const admin = Boolean(user?.email && isAdmin(user.email))

  if (authLoading || loading || writerStatusLoading || !user) return <AccountSettingsLoading />

  return (
    <>
      <AccountSettingsShell
        user={user}
        isWriter={isWriter}
        memberSince={memberSince}
        bookmarksCount={bookmarksCount}
        hasUserData={Boolean(userData)}
        isAdmin={admin}
        agreementData={agreementData}
        activeAdminTab={activeAdminTab}
        onAdminTabChange={setActiveAdminTab}
        onOpenAgreement={() => setShowAgreement(true)}
        onRequestDeleteData={() => setShowDataDeleteConfirm(true)}
        onRequestDeleteAccount={() => setShowDeleteConfirm(true)}
      />
      <DeleteDataModal
        isOpen={showDataDeleteConfirm}
        onClose={() => {
          setShowDataDeleteConfirm(false)
          setError('')
        }}
        onConfirm={handleDeleteData}
        deleting={deleting}
        error={error}
        bookmarksCount={bookmarksCount}
      />
      <DeleteAccountModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setDeleteConfirmText('')
          setError('')
        }}
        onConfirm={handleDeleteAccount}
        deleting={deleting}
        error={error}
        confirmText={deleteConfirmText}
        onConfirmTextChange={(value) => {
          setDeleteConfirmText(value)
          setError('')
        }}
      />
      <AgreementModal
        isOpen={showAgreement}
        onClose={() => setShowAgreement(false)}
        agreementData={agreementData}
      />
    </>
  )
}

/**
 * Account settings hub for profile, writer tools, and privacy controls.
 */
export default function AccountSettingsPage() {
  return (
    <Suspense fallback={<AccountSettingsLoading />}>
      <AccountSettingsContent />
    </Suspense>
  )
}
