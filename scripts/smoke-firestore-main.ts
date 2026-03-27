import 'dotenv/config'

import { dbDefault } from '../lib/firebase/admin'

const MAIN_FIRESTORE_DATABASE_ID = 'eu-primary'

type ProbeResult = {
  target: string
  kind: 'doc' | 'collection'
  exists?: boolean
  sampleId?: string | null
  error?: string
}

const args = new Set(process.argv.slice(2))

if (args.has('--help') || args.has('-h')) {
  console.log(`Firestore main database smoke test

Usage:
  FIRESTORE_MAIN_DATABASE_ID=eu-primary tsx scripts/smoke-firestore-main.ts

Optional env:
  GCP_PROJECT_ID=staituned-production-163f4
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=staituned-production-163f4
  FB_SERVICE_ACCOUNT_KEY / FB_SERVICE_ACCOUNT_KEY_B64

Checks:
  - config/ai_settings
  - analytics/daily
  - one sample doc from articles
  - one sample doc from users
`)
  process.exit(0)
}

async function probeDoc(pathSegments: [string, string]): Promise<ProbeResult> {
  try {
    const snap = await dbDefault().collection(pathSegments[0]).doc(pathSegments[1]).get()
    return {
      target: `${pathSegments[0]}/${pathSegments[1]}`,
      kind: 'doc',
      exists: snap.exists,
    }
  } catch (error) {
    return {
      target: `${pathSegments[0]}/${pathSegments[1]}`,
      kind: 'doc',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

async function probeCollection(collectionName: string): Promise<ProbeResult> {
  try {
    const snap = await dbDefault().collection(collectionName).limit(1).get()
    return {
      target: collectionName,
      kind: 'collection',
      exists: !snap.empty,
      sampleId: snap.empty ? null : snap.docs[0]?.id ?? null,
    }
  } catch (error) {
    return {
      target: collectionName,
      kind: 'collection',
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

async function main() {
  const projectId =
    process.env.GCP_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    'unset'
  const databaseId = process.env.FIRESTORE_MAIN_DATABASE_ID || MAIN_FIRESTORE_DATABASE_ID

  console.log('---------------------------------------------------')
  console.log('Firestore Main Database Smoke Test')
  console.log('---------------------------------------------------')
  console.log(`Project: ${projectId}`)
  console.log(`Database: ${databaseId}`)

  const results = await Promise.all([
    probeDoc(['config', 'ai_settings']),
    probeDoc(['analytics', 'daily']),
    probeCollection('articles'),
    probeCollection('users'),
  ])

  console.log('---------------------------------------------------')
  for (const result of results) {
    if (result.error) {
      console.log(`FAIL  ${result.kind.padEnd(10)} ${result.target}`)
      console.log(`      ${result.error}`)
      continue
    }

    if (result.kind === 'doc') {
      console.log(`OK    doc        ${result.target} exists=${String(result.exists)}`)
      continue
    }

    console.log(
      `OK    collection ${result.target} hasData=${String(result.exists)} sampleId=${result.sampleId ?? 'none'}`
    )
  }

  const failed = results.filter((result) => result.error)
  console.log('---------------------------------------------------')

  if (failed.length > 0) {
    console.log(`Result: FAILED (${failed.length} probe errors)`)
    process.exit(1)
  }

  console.log('Result: OK')
}

main().catch((error) => {
  console.error('Smoke test crashed:', error)
  process.exit(1)
})
