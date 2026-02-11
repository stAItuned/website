'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/auth/AuthContext'

interface WriterStatus {
  isWriter: boolean | null
  hasAgreement: boolean | null
  loading: boolean
  profilePath?: string
  name?: string
  refresh: () => Promise<void>
}

const WriterStatusContext = createContext<WriterStatus | null>(null)

/**
 * Global writer status cache (derived from `/api/user/writer-status`).
 * Keeps UI consistent after onboarding without requiring a full reload.
 */
export function WriterStatusProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [isWriter, setIsWriter] = useState<boolean | null>(null)
  const [hasAgreement, setHasAgreement] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [profilePath, setProfilePath] = useState<string | undefined>(undefined)
  const [name, setName] = useState<string | undefined>(undefined)

  const refresh = useCallback(async () => {
    if (!user) {
      setIsWriter(false)
      setHasAgreement(false)
      setProfilePath(undefined)
      setName(undefined)
      return
    }

    setLoading(true)
    try {
      const token = await user.getIdToken()
      const res = await fetch('/api/user/writer-status', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json: unknown = await res.json()

      if (res.ok && typeof json === 'object' && json) {
        const j = json as { isWriter?: unknown; hasAgreement?: unknown; profilePath?: unknown; name?: unknown }
        const nextIsWriter = Boolean(j.isWriter)
        setIsWriter(nextIsWriter)
        setHasAgreement(typeof j.hasAgreement === 'boolean' ? j.hasAgreement : false)
        setProfilePath(typeof j.profilePath === 'string' ? j.profilePath : undefined)
        setName(typeof j.name === 'string' ? j.name : undefined)
      } else {
        setIsWriter(false)
        setHasAgreement(false)
        setProfilePath(undefined)
        setName(undefined)
      }
    } catch {
      setIsWriter(false)
      setHasAgreement(false)
      setProfilePath(undefined)
      setName(undefined)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refresh()
  }, [refresh])

  useEffect(() => {
    const onChanged = () => void refresh()
    window.addEventListener('writer-status-changed', onChanged)
    return () => window.removeEventListener('writer-status-changed', onChanged)
  }, [refresh])

  const value = useMemo<WriterStatus>(
    () => ({ isWriter, hasAgreement, loading, profilePath, name, refresh }),
    [isWriter, hasAgreement, loading, profilePath, name, refresh]
  )

  return <WriterStatusContext.Provider value={value}>{children}</WriterStatusContext.Provider>
}

/**
 * Access cached writer status; throws if used outside `WriterStatusProvider`.
 */
export function useWriterStatus(): WriterStatus {
  const ctx = useContext(WriterStatusContext)
  if (!ctx) throw new Error('useWriterStatus must be used within a WriterStatusProvider')
  return ctx
}
