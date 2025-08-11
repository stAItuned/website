// Firebase Admin - temporarily disabled for development
// Uncomment and configure when Firebase credentials are available

// import { cert, getApps, initializeApp } from 'firebase-admin/app'
// import { getFirestore } from 'firebase-admin/firestore'

// const app = getApps()[0] ?? initializeApp({
//   credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)),
// })

// export const db = getFirestore(app)

// Mock implementation for development
export const db = {
  collection: (name: string) => ({
    doc: (id: string) => ({
      get: () => Promise.resolve({ exists: false }),
      set: (data: any, options?: any) => Promise.resolve(),
    }),
    where: () => ({
      orderBy: () => ({
        get: () => Promise.resolve({ docs: [] })
      })
    })
  })
}
