import { NextRequest, NextResponse } from 'next/server'
import { auth as adminAuth } from '@/lib/firebase/admin'
import { getAdminDb, verifyAuth } from '@/lib/firebase/server-auth'

type DeleteMode = 'data' | 'account'

interface DeleteRequestBody {
  mode?: DeleteMode
}

interface CleanupSummary {
  deleted: string[]
  errors: string[]
}

function isAuthPermissionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return (
    message.includes('USER_PROJECT_DENIED') ||
    message.includes('serviceusage.services.use') ||
    message.includes('roles/serviceusage.serviceUsageConsumer') ||
    message.includes('identitytoolkit.googleapis.com')
  )
}

function addDeleted(summary: CleanupSummary, path: string) {
  summary.deleted.push(path)
}

function addError(summary: CleanupSummary, path: string, error: unknown) {
  const detail = error instanceof Error ? error.message : 'Unknown error'
  summary.errors.push(`${path}: ${detail}`)
}

async function deleteDocIfExists(
  collectionName: string,
  docId: string,
  summary: CleanupSummary
) {
  const db = getAdminDb()
  const ref = db.collection(collectionName).doc(docId)
  const snap = await ref.get()
  if (!snap.exists) return
  await ref.delete()
  addDeleted(summary, `${collectionName}/${docId}`)
}

async function deleteUserDrafts(uid: string, summary: CleanupSummary) {
  const db = getAdminDb()
  const draftRootRef = db.collection('drafts').doc(uid)
  const articlesSnapshot = await draftRootRef.collection('articles').get()
  for (const doc of articlesSnapshot.docs) {
    await doc.ref.delete()
    addDeleted(summary, `drafts/${uid}/articles/${doc.id}`)
  }
  await deleteDocIfExists('drafts', uid, summary)
}

async function deleteContributions(uid: string, summary: CleanupSummary) {
  const db = getAdminDb()
  const snapshot = await db.collection('contributions').where('contributorId', '==', uid).get()
  for (const doc of snapshot.docs) {
    await doc.ref.delete()
    addDeleted(summary, `contributions/${doc.id}`)
  }
}

async function deleteWriterProfile(uid: string, summary: CleanupSummary) {
  const db = getAdminDb()
  const writerSlugs = new Set<string>()

  const writerSlugDoc = await db.collection('writer_slugs').doc(uid).get()
  if (writerSlugDoc.exists) {
    const slugValue = writerSlugDoc.data()?.slug
    if (typeof slugValue === 'string' && slugValue.trim()) {
      writerSlugs.add(slugValue.trim())
    }
    await writerSlugDoc.ref.delete()
    addDeleted(summary, `writer_slugs/${uid}`)
  }

  const writerQuery = await db.collection('writers').where('uid', '==', uid).get()
  for (const doc of writerQuery.docs) {
    writerSlugs.add(doc.id)
    await doc.ref.delete()
    addDeleted(summary, `writers/${doc.id}`)
  }

  for (const slug of writerSlugs) {
    const writerDoc = await db.collection('writers').doc(slug).get()
    if (writerDoc.exists) {
      await writerDoc.ref.delete()
      addDeleted(summary, `writers/${slug}`)
    }

    const badgesRef = db.collection('badges').doc(slug)
    const earnedSnapshot = await badgesRef.collection('earned').get()
    for (const earnedDoc of earnedSnapshot.docs) {
      await earnedDoc.ref.delete()
      addDeleted(summary, `badges/${slug}/earned/${earnedDoc.id}`)
    }

    const badgesDoc = await badgesRef.get()
    if (badgesDoc.exists) {
      await badgesDoc.ref.delete()
      addDeleted(summary, `badges/${slug}`)
    }
  }
}

async function cleanupUserFirestoreData(uid: string): Promise<CleanupSummary> {
  const summary: CleanupSummary = { deleted: [], errors: [] }

  const tasks: Array<() => Promise<void>> = [
    async () => deleteDocIfExists('users', uid, summary),
    async () => deleteDocIfExists('preferences', uid, summary),
    async () => deleteUserDrafts(uid, summary),
    async () => deleteContributions(uid, summary),
    async () => deleteWriterProfile(uid, summary),
  ]

  for (const task of tasks) {
    try {
      await task()
    } catch (error) {
      addError(summary, 'firestore_cleanup', error)
    }
  }

  return summary
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user?.uid) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    let mode: DeleteMode = 'account'
    try {
      const body = (await request.json()) as DeleteRequestBody
      if (body.mode === 'data' || body.mode === 'account') {
        mode = body.mode
      }
    } catch {
      // Empty or invalid body -> fallback to default "account"
    }

    const summary = await cleanupUserFirestoreData(user.uid)

    let authDeleted = mode === 'data'
    let authDeletionWarning: string | null = null

    if (mode === 'account') {
      try {
        await adminAuth().deleteUser(user.uid)
        authDeleted = true
      } catch (error) {
        if (isAuthPermissionError(error)) {
          authDeleted = false
          authDeletionWarning = error instanceof Error ? error.message : String(error)
        } else {
          throw error
        }
      }
    }

    return NextResponse.json({
      success: true,
      mode,
      authDeleted,
      authDeletionWarning,
      summary,
      message: mode === 'account'
        ? (authDeleted
          ? 'Account and related data deleted'
          : 'User data deleted, but auth account deletion was skipped due to IAM permissions')
        : 'User data deleted while keeping account active'
    })
  } catch (error) {
    console.error('[API] account/delete error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete account data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
