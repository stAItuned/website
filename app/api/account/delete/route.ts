import { NextRequest, NextResponse } from 'next/server'
import { FieldValue } from 'firebase-admin/firestore'
import { auth as adminAuth } from '@/lib/firebase/admin'
import { getAdminDb, verifyAuth } from '@/lib/firebase/server-auth'
import {
  CONTRIBUTOR_AGREEMENT_LEGAL_EXCEPTION,
  computeContributorAgreementLegalReviewDueAt,
} from '@/lib/privacy/retention-policies'

type DeleteMode = 'data' | 'account'

interface DeleteRequestBody {
  mode?: DeleteMode
}

type DatasetDeletePath = 'self_service_automatic' | 'assisted_dsar'
type DatasetExportPath = 'assisted_dsar'
type DatasetOwner = 'uid' | 'email' | 'token' | 'mixed'
type DatasetStatus =
  | 'not_found'
  | 'deleted'
  | 'retained_legal_exception'
  | 'skipped_assisted'
  | 'error'
  | 'mixed'

interface DatasetCoverageEntry {
  dataset: string
  owner: DatasetOwner
  deletePath: DatasetDeletePath
  exportPath: DatasetExportPath
  status: DatasetStatus
  deletedCount: number
  retainedCount: number
  notes: string[]
}

interface CleanupSummary {
  deleted: string[]
  retained: string[]
  errors: string[]
  datasetCoverage: Record<string, DatasetCoverageEntry>
}

const DATASET_COVERAGE_TEMPLATE: Record<string, Omit<DatasetCoverageEntry, 'status' | 'deletedCount' | 'retainedCount' | 'notes'>> = {
  users: { dataset: 'users', owner: 'uid', deletePath: 'self_service_automatic', exportPath: 'assisted_dsar' },
  preferences: { dataset: 'preferences', owner: 'uid', deletePath: 'self_service_automatic', exportPath: 'assisted_dsar' },
  drafts: { dataset: 'drafts', owner: 'uid', deletePath: 'self_service_automatic', exportPath: 'assisted_dsar' },
  contributions: { dataset: 'contributions', owner: 'uid', deletePath: 'self_service_automatic', exportPath: 'assisted_dsar' },
  writers: { dataset: 'writers', owner: 'uid', deletePath: 'self_service_automatic', exportPath: 'assisted_dsar' },
  badges: { dataset: 'badges', owner: 'uid', deletePath: 'self_service_automatic', exportPath: 'assisted_dsar' },
  role_fit_audit_submissions: { dataset: 'role_fit_audit_submissions', owner: 'email', deletePath: 'self_service_automatic', exportPath: 'assisted_dsar' },
  career_os_waitlist: { dataset: 'career_os_waitlist', owner: 'email', deletePath: 'self_service_automatic', exportPath: 'assisted_dsar' },
  career_os_applications: { dataset: 'career_os_applications', owner: 'email', deletePath: 'self_service_automatic', exportPath: 'assisted_dsar' },
  career_os_audit: { dataset: 'career_os_audit', owner: 'email', deletePath: 'self_service_automatic', exportPath: 'assisted_dsar' },
  contributor_applications: { dataset: 'contributor_applications', owner: 'email', deletePath: 'self_service_automatic', exportPath: 'assisted_dsar' },
  contact_requests: { dataset: 'contact_requests', owner: 'email', deletePath: 'self_service_automatic', exportPath: 'assisted_dsar' },
  feedback_submissions: { dataset: 'feedback_submissions', owner: 'email', deletePath: 'self_service_automatic', exportPath: 'assisted_dsar' },
  business_demo_requests: { dataset: 'business_demo_requests', owner: 'email', deletePath: 'self_service_automatic', exportPath: 'assisted_dsar' },
  fcm_admin_tokens: { dataset: 'fcm_admin_tokens', owner: 'uid', deletePath: 'self_service_automatic', exportPath: 'assisted_dsar' },
  fcm_tokens: { dataset: 'fcm_tokens', owner: 'token', deletePath: 'assisted_dsar', exportPath: 'assisted_dsar' },
  leads_ai_act_tools: { dataset: 'leads_ai_act_tools', owner: 'email', deletePath: 'assisted_dsar', exportPath: 'assisted_dsar' },
}

function createDatasetCoverage(): Record<string, DatasetCoverageEntry> {
  return Object.fromEntries(
    Object.entries(DATASET_COVERAGE_TEMPLATE).map(([key, value]) => [
      key,
      {
        ...value,
        status: 'not_found',
        deletedCount: 0,
        retainedCount: 0,
        notes: [],
      },
    ]),
  )
}

function mergeStatus(current: DatasetStatus, next: DatasetStatus): DatasetStatus {
  if (current === next || current === 'not_found') return next
  if (next === 'not_found') return current
  if (current === 'error' || next === 'error') return 'error'
  if (current === 'mixed' || next === 'mixed') return 'mixed'
  return 'mixed'
}

function addDatasetDeletion(summary: CleanupSummary, dataset: string, count = 1) {
  const coverage = summary.datasetCoverage[dataset]
  if (!coverage || count <= 0) return
  coverage.deletedCount += count
  coverage.status = mergeStatus(coverage.status, 'deleted')
}

function addDatasetRetained(summary: CleanupSummary, dataset: string, count = 1, note?: string) {
  const coverage = summary.datasetCoverage[dataset]
  if (!coverage || count <= 0) return
  coverage.retainedCount += count
  coverage.status = mergeStatus(coverage.status, 'retained_legal_exception')
  if (note) {
    coverage.notes.push(note)
  }
}

function addDatasetSkippedAssisted(summary: CleanupSummary, dataset: string, note: string) {
  const coverage = summary.datasetCoverage[dataset]
  if (!coverage) return
  coverage.status = mergeStatus(coverage.status, 'skipped_assisted')
  coverage.notes.push(note)
}

function addDatasetError(summary: CleanupSummary, dataset: string, error: unknown) {
  const coverage = summary.datasetCoverage[dataset]
  if (!coverage) return
  coverage.status = mergeStatus(coverage.status, 'error')
  const message = error instanceof Error ? error.message : String(error)
  coverage.notes.push(`error: ${message}`)
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

function addRetained(summary: CleanupSummary, path: string) {
  summary.retained.push(path)
}

function addError(summary: CleanupSummary, path: string, error: unknown) {
  const detail = error instanceof Error ? error.message : 'Unknown error'
  summary.errors.push(`${path}: ${detail}`)
}

async function deleteDocIfExists(
  collectionName: string,
  docId: string,
  dataset: string,
  summary: CleanupSummary
) {
  const db = getAdminDb()
  const ref = db.collection(collectionName).doc(docId)
  const snap = await ref.get()
  if (!snap.exists) return
  await ref.delete()
  addDeleted(summary, `${collectionName}/${docId}`)
  addDatasetDeletion(summary, dataset)
}

async function deleteUserDrafts(uid: string, summary: CleanupSummary) {
  const db = getAdminDb()
  const draftRootRef = db.collection('drafts').doc(uid)
  const articlesSnapshot = await draftRootRef.collection('articles').get()
  for (const doc of articlesSnapshot.docs) {
    await doc.ref.delete()
    addDeleted(summary, `drafts/${uid}/articles/${doc.id}`)
    addDatasetDeletion(summary, 'drafts')
  }
  await deleteDocIfExists('drafts', uid, 'drafts', summary)
}

async function deleteContributions(uid: string, summary: CleanupSummary, nowIso: string) {
  const db = getAdminDb()
  const snapshot = await db.collection('contributions').where('contributorId', '==', uid).get()
  for (const doc of snapshot.docs) {
    const data = doc.data() as { agreement?: Record<string, unknown> }
    const agreement = data.agreement
    const hasSignedAgreement = Boolean(
      agreement
      && (
        agreement.checkbox_general === true
        || agreement.agreed === true
        || typeof agreement.accepted_at === 'string'
        || typeof agreement.agreement_hash_sha256 === 'string'
      ),
    )

    if (hasSignedAgreement) {
      const acceptedAt =
        typeof agreement?.accepted_at === 'string'
          ? agreement.accepted_at
          : (typeof agreement?.agreedAt === 'string' ? agreement.agreedAt : nowIso)
      const sanitizedAgreement = {
        checkbox_general: true,
        checkbox_1341: agreement?.checkbox_1341 === true,
        accepted_at: acceptedAt,
        agreement_version:
          typeof agreement?.agreement_version === 'string'
            ? agreement.agreement_version
            : (typeof agreement?.version === 'string' ? agreement.version : '1.1'),
        author_name: typeof agreement?.author_name === 'string'
          ? agreement.author_name
          : (typeof agreement?.legalName === 'string' ? agreement.legalName : ''),
        author_email: typeof agreement?.author_email === 'string' ? agreement.author_email : null,
        fiscal_code: typeof agreement?.fiscal_code === 'string' ? agreement.fiscal_code : null,
        ip: typeof agreement?.ip === 'string' ? agreement.ip : null,
        user_agent: typeof agreement?.user_agent === 'string' ? agreement.user_agent : null,
        agreement_hash_sha256:
          typeof agreement?.agreement_hash_sha256 === 'string'
            ? agreement.agreement_hash_sha256
            : (typeof agreement?.hash === 'string' ? agreement.hash : null),
        agreement_view_url: typeof agreement?.agreement_view_url === 'string' ? agreement.agreement_view_url : null,
        legal_retention_mode: 'legal_exception',
        legal_retention_rationale: CONTRIBUTOR_AGREEMENT_LEGAL_EXCEPTION,
        legal_retention_updated_at: nowIso,
        legal_retention_review_due_at: computeContributorAgreementLegalReviewDueAt(acceptedAt),
        dsar_delete_mode: 'assisted_only',
        dsar_delete_notes:
          'Only agreement evidence is retained for legal accountability. Non-essential draft/interview fields are removed on account deletion.',
      }

      await doc.ref.set({
        contributorId: `deleted:${uid}`,
        contributorEmail: null,
        brief: FieldValue.delete(),
        draftContent: FieldValue.delete(),
        interviewHistory: FieldValue.delete(),
        sourceDiscovery: FieldValue.delete(),
        generatedOutline: FieldValue.delete(),
        currentQuestion: FieldValue.delete(),
        review: FieldValue.delete(),
        reviewHistory: FieldValue.delete(),
        statusHistory: FieldValue.delete(),
        updatedAt: nowIso,
        agreement: sanitizedAgreement,
        accountDeletion: {
          mode: 'legal_exception',
          requestedAt: nowIso,
          rationale: CONTRIBUTOR_AGREEMENT_LEGAL_EXCEPTION,
        },
        legalRetention: {
          exception: CONTRIBUTOR_AGREEMENT_LEGAL_EXCEPTION,
          retainedAgreementEvidence: true,
          reviewDueAt: computeContributorAgreementLegalReviewDueAt(acceptedAt),
        },
      }, { merge: true })
      addRetained(summary, `contributions/${doc.id}`)
      addDatasetRetained(
        summary,
        'contributions',
        1,
        'Agreement evidence retained for legal defense/accountability.',
      )
      continue
    }

    await doc.ref.delete()
    addDeleted(summary, `contributions/${doc.id}`)
    addDatasetDeletion(summary, 'contributions')
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
    addDatasetDeletion(summary, 'writers')
  }

  const writerQuery = await db.collection('writers').where('uid', '==', uid).get()
  for (const doc of writerQuery.docs) {
    writerSlugs.add(doc.id)
    await doc.ref.delete()
    addDeleted(summary, `writers/${doc.id}`)
    addDatasetDeletion(summary, 'writers')
  }

  for (const slug of writerSlugs) {
    const writerDoc = await db.collection('writers').doc(slug).get()
    if (writerDoc.exists) {
      await writerDoc.ref.delete()
      addDeleted(summary, `writers/${slug}`)
      addDatasetDeletion(summary, 'writers')
    }

    const badgesRef = db.collection('badges').doc(slug)
    const earnedSnapshot = await badgesRef.collection('earned').get()
    for (const earnedDoc of earnedSnapshot.docs) {
      await earnedDoc.ref.delete()
      addDeleted(summary, `badges/${slug}/earned/${earnedDoc.id}`)
      addDatasetDeletion(summary, 'badges')
    }

    const badgesDoc = await badgesRef.get()
    if (badgesDoc.exists) {
      await badgesDoc.ref.delete()
      addDeleted(summary, `badges/${slug}`)
      addDatasetDeletion(summary, 'badges')
    }
  }
}

async function deleteByFieldMatch(
  collectionName: string,
  fieldName: string,
  value: string,
  dataset: string,
  summary: CleanupSummary,
) {
  const db = getAdminDb()
  const snap = await db.collection(collectionName).where(fieldName, '==', value).get()
  for (const doc of snap.docs) {
    await doc.ref.delete()
    addDeleted(summary, `${collectionName}/${doc.id}`)
    addDatasetDeletion(summary, dataset)
  }
}

async function cleanupUserFirestoreData(uid: string, email: string | null): Promise<CleanupSummary> {
  const summary: CleanupSummary = {
    deleted: [],
    retained: [],
    errors: [],
    datasetCoverage: createDatasetCoverage(),
  }
  const nowIso = new Date().toISOString()

  addDatasetSkippedAssisted(summary, 'fcm_tokens', 'Token is not account-bound; deletion is handled via assisted DSAR workflow.')
  addDatasetSkippedAssisted(summary, 'leads_ai_act_tools', 'Lead dataset is email-based and not uniquely account-bound; deletion/export handled via assisted DSAR.')

  const tasks: Array<{ id: string; datasets: string[]; run: () => Promise<void> }> = [
    { id: 'users', datasets: ['users'], run: async () => deleteDocIfExists('users', uid, 'users', summary) },
    { id: 'preferences', datasets: ['preferences'], run: async () => deleteDocIfExists('preferences', uid, 'preferences', summary) },
    { id: 'drafts', datasets: ['drafts'], run: async () => deleteUserDrafts(uid, summary) },
    { id: 'contributions', datasets: ['contributions'], run: async () => deleteContributions(uid, summary, nowIso) },
    { id: 'writers_and_badges', datasets: ['writers', 'badges'], run: async () => deleteWriterProfile(uid, summary) },
    {
      id: 'fcm_admin_tokens',
      datasets: ['fcm_admin_tokens'],
      run: async () => deleteByFieldMatch('fcm_admin_tokens', 'registeredByUid', uid, 'fcm_admin_tokens', summary),
    },
  ]

  if (email) {
    tasks.push(
      {
        id: 'role_fit_audit_submissions',
        datasets: ['role_fit_audit_submissions'],
        run: async () => deleteByFieldMatch('role_fit_audit_submissions', 'email', email, 'role_fit_audit_submissions', summary),
      },
      {
        id: 'career_os_waitlist',
        datasets: ['career_os_waitlist'],
        run: async () => deleteByFieldMatch('career_os_waitlist', 'email', email, 'career_os_waitlist', summary),
      },
      {
        id: 'career_os_applications',
        datasets: ['career_os_applications'],
        run: async () => deleteByFieldMatch('career_os_applications', 'email', email, 'career_os_applications', summary),
      },
      {
        id: 'career_os_audit',
        datasets: ['career_os_audit'],
        run: async () => deleteByFieldMatch('career_os_audit', 'email', email, 'career_os_audit', summary),
      },
      {
        id: 'contributor_applications',
        datasets: ['contributor_applications'],
        run: async () => deleteByFieldMatch('contributor_applications', 'email', email, 'contributor_applications', summary),
      },
      {
        id: 'contact_requests',
        datasets: ['contact_requests'],
        run: async () => deleteByFieldMatch('contact_requests', 'email', email, 'contact_requests', summary),
      },
      {
        id: 'feedback_submissions',
        datasets: ['feedback_submissions'],
        run: async () => deleteByFieldMatch('feedback_submissions', 'email', email, 'feedback_submissions', summary),
      },
      {
        id: 'business_demo_requests',
        datasets: ['business_demo_requests'],
        run: async () => deleteByFieldMatch('business_demo_requests', 'email', email, 'business_demo_requests', summary),
      },
    )
  } else {
    addDatasetSkippedAssisted(summary, 'role_fit_audit_submissions', 'No verified email in auth token; requires assisted DSAR.')
    addDatasetSkippedAssisted(summary, 'career_os_waitlist', 'No verified email in auth token; requires assisted DSAR.')
    addDatasetSkippedAssisted(summary, 'career_os_applications', 'No verified email in auth token; requires assisted DSAR.')
    addDatasetSkippedAssisted(summary, 'career_os_audit', 'No verified email in auth token; requires assisted DSAR.')
    addDatasetSkippedAssisted(summary, 'contributor_applications', 'No verified email in auth token; requires assisted DSAR.')
    addDatasetSkippedAssisted(summary, 'contact_requests', 'No verified email in auth token; requires assisted DSAR.')
    addDatasetSkippedAssisted(summary, 'feedback_submissions', 'No verified email in auth token; requires assisted DSAR.')
    addDatasetSkippedAssisted(summary, 'business_demo_requests', 'No verified email in auth token; requires assisted DSAR.')
  }

  for (const task of tasks) {
    try {
      await task.run()
    } catch (error) {
      addError(summary, task.id, error)
      for (const dataset of task.datasets) {
        addDatasetError(summary, dataset, error)
      }
    }
  }

  for (const [dataset, entry] of Object.entries(summary.datasetCoverage)) {
    if (entry.status === 'not_found' && entry.deletePath === 'assisted_dsar') {
      addDatasetSkippedAssisted(summary, dataset, 'Managed via assisted DSAR workflow by default.')
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

    const normalizedEmail =
      typeof user.email === 'string' && user.email.trim().length > 0
        ? user.email.trim().toLowerCase()
        : null
    const summary = await cleanupUserFirestoreData(user.uid, normalizedEmail)

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
      deletionCoverageVersion: '2026-03-23',
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
