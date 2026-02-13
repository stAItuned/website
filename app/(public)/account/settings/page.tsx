'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
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

interface AgreementData {
  checkbox_general?: boolean
  agreed?: boolean
  accepted_at?: string
  agreedAt?: string
  legalName?: string
  author_name?: string
  agreement_version?: string
  version?: string
}

interface ContributionWithAgreement {
  agreement?: AgreementData
}

type AccountDeleteMode = 'data' | 'account'

function hasSignedAgreement(agreement?: AgreementData): boolean {
  return agreement?.checkbox_general === true || agreement?.agreed === true
}

function agreementAcceptedAt(agreement?: AgreementData): string {
  return agreement?.accepted_at || agreement?.agreedAt || ''
}

interface AccountDeleteApiResponse {
  success?: boolean
  mode?: AccountDeleteMode
  authDeleted?: boolean
  authDeletionWarning?: string | null
  error?: string
  details?: string
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
  const [contributions, setContributions] = useState<ContributionWithAgreement[]>([])
  const [agreementData, setAgreementData] = useState<AgreementData | null>(null)

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
        const json = await res.json() as {
          success?: boolean
          contributions?: ContributionWithAgreement[]
        }
        if (json.success && json.contributions) {
          setContributions(json.contributions)
          // Find the latest contribution with an agreement
          const latestWithAgreement = json.contributions
            .filter((c) => hasSignedAgreement(c.agreement))
            .sort((a, b) => {
              const bTime = Date.parse(agreementAcceptedAt(b.agreement))
              const aTime = Date.parse(agreementAcceptedAt(a.agreement))
              return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime)
            })[0]

          if (latestWithAgreement?.agreement) {
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
      const token = await user.getIdToken()
      const response = await fetch('/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ mode: 'data' satisfies AccountDeleteMode }),
      })
      const result = await response.json() as AccountDeleteApiResponse
      if (!response.ok || result.success !== true) {
        throw new Error(result.error || result.details || 'Failed to delete user data')
      }

      setUserData(null)
      setContributions([])
      setAgreementData(null)
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
      const token = await user.getIdToken()
      const response = await fetch('/api/account/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ mode: 'account' satisfies AccountDeleteMode }),
      })

      const result = await response.json() as AccountDeleteApiResponse
      if (!response.ok || result.success !== true) {
        throw new Error(result.error || result.details || 'Failed to delete account')
      }

      if (result.authDeleted === false) {
        setShowDeleteConfirm(false)
        setDeleteConfirmText('')
        setError(
          'I dati sono stati cancellati, ma la rimozione dell’account Auth è fallita per permessi IAM backend. ' +
          'Serve assegnare al service account il ruolo roles/serviceusage.serviceUsageConsumer.'
        )
        return
      }

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
  const modalAgreementData = useMemo(() => {
    if (!agreementData) return undefined
    return {
      legalName: agreementData.legalName || agreementData.author_name || user?.displayName || '',
      agreedAt: agreementAcceptedAt(agreementData),
      version: agreementData.agreement_version || agreementData.version || '1.1',
    }
  }, [agreementData, user?.displayName])

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
        agreementData={modalAgreementData}
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
