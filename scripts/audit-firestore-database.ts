import 'dotenv/config'

import { App, cert, getApps, initializeApp } from 'firebase-admin/app'
import {
  CollectionReference,
  DocumentReference,
  Firestore,
  getFirestore,
} from 'firebase-admin/firestore'

type ServiceAccountLike = {
  project_id?: string
  [key: string]: unknown
}

type CollectionAudit = {
  path: string
  docCount: number
  sampleDocIds: string[]
  childCollectionCount: number
}

type AuditSummary = {
  projectId: string
  databaseId: string
  topLevelCollectionCount: number
  totalCollectionPaths: number
  totalDocumentsEnumerated: number
  collections: CollectionAudit[]
}

const DEFAULT_DATABASE_ID = '(default)'

function decodeServiceAccountB64(rawB64: string | undefined): string | undefined {
  if (!rawB64) return undefined
  try {
    return Buffer.from(rawB64, 'base64').toString('utf8')
  } catch {
    return undefined
  }
}

function parseServiceAccount(raw: string | undefined): ServiceAccountLike | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as ServiceAccountLike
  } catch {
    return null
  }
}

function pickServiceAccountRawKey(): string {
  const rawKeyDirect = process.env.FB_SERVICE_ACCOUNT_KEY
  const rawKeyB64Decoded = decodeServiceAccountB64(process.env.FB_SERVICE_ACCOUNT_KEY_B64)
  const directCreds = parseServiceAccount(rawKeyDirect)
  const b64Creds = parseServiceAccount(rawKeyB64Decoded)

  const expectedProjectId =
    process.env.GCP_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID

  if (expectedProjectId) {
    if (directCreds?.project_id === expectedProjectId && rawKeyDirect) return rawKeyDirect
    if (b64Creds?.project_id === expectedProjectId && rawKeyB64Decoded) return rawKeyB64Decoded
  }

  if (rawKeyDirect) return rawKeyDirect
  if (rawKeyB64Decoded) return rawKeyB64Decoded

  throw new Error('FB_SERVICE_ACCOUNT_KEY / FB_SERVICE_ACCOUNT_KEY_B64 env variable is required.')
}

function getAdminApp(): App {
  const existingApps = getApps()
  if (existingApps.length > 0) {
    return existingApps[0]!
  }

  const rawKey = pickServiceAccountRawKey()
  const creds = JSON.parse(rawKey) as ServiceAccountLike
  const projectId =
    process.env.GCP_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    creds.project_id

  return initializeApp({
    credential: cert(rawKey ? (JSON.parse(rawKey) as object) : {}),
    projectId: projectId || undefined,
  })
}

function getArgValue(prefix: string): string | undefined {
  const arg = process.argv.slice(2).find((entry) => entry.startsWith(`${prefix}=`))
  return arg ? arg.slice(prefix.length + 1) : undefined
}

async function auditDatabase(db: Firestore, projectId: string): Promise<AuditSummary> {
  const rootCollections = await db.listCollections()
  const recurse = !process.argv.includes('--top-level-only')
  const queue: CollectionReference[] = [...rootCollections]
  const collections: CollectionAudit[] = []
  let totalDocumentsEnumerated = 0

  while (queue.length > 0) {
    const collection = queue.shift()
    if (!collection) continue

    const docRefs = await collection.listDocuments()
    totalDocumentsEnumerated += docRefs.length

    let childCollectionCount = 0
    for (const docRef of docRefs) {
      if (recurse) {
        const childCollections = await (docRef as DocumentReference).listCollections()
        childCollectionCount += childCollections.length
        for (const childCollection of childCollections) {
          queue.push(childCollection)
        }
      }
    }

    collections.push({
      path: collection.path,
      docCount: docRefs.length,
      sampleDocIds: docRefs.slice(0, 3).map((docRef) => docRef.id),
      childCollectionCount,
    })
  }

  collections.sort((a, b) => a.path.localeCompare(b.path))

  return {
    projectId,
    databaseId: db.databaseId,
    topLevelCollectionCount: rootCollections.length,
    totalCollectionPaths: collections.length,
    totalDocumentsEnumerated,
    collections,
  }
}

async function main() {
  const databaseId = getArgValue('--database') || process.env.AUDIT_FIRESTORE_DATABASE_ID || DEFAULT_DATABASE_ID
  const json = process.argv.includes('--json')

  const app = getAdminApp()
  const db = getFirestore(app, databaseId)
  const projectId =
    process.env.GCP_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    app.options.projectId ||
    'unknown'

  const summary = await auditDatabase(db, projectId)

  if (json) {
    console.log(JSON.stringify(summary, null, 2))
    return
  }

  console.log('---------------------------------------------------')
  console.log('Firestore Database Audit')
  console.log('---------------------------------------------------')
  console.log(`Project: ${summary.projectId}`)
  console.log(`Database: ${summary.databaseId}`)
  console.log(`Top-level collections: ${summary.topLevelCollectionCount}`)
  console.log(`Collection paths discovered: ${summary.totalCollectionPaths}`)
  console.log(`Document refs enumerated: ${summary.totalDocumentsEnumerated}`)
  console.log('---------------------------------------------------')

  for (const collection of summary.collections) {
    console.log(
      `${collection.path} | docs=${collection.docCount} | childCollections=${collection.childCollectionCount} | sample=${collection.sampleDocIds.join(', ') || 'none'}`
    )
  }
}

main().catch((error) => {
  console.error('Firestore audit failed:', error)
  process.exit(1)
})
