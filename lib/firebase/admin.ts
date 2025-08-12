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
    doc: (id?: string) => ({
      id: id || `auto-generated-${Date.now()}`,
      get: () => Promise.resolve({ exists: false }),
      set: (data: any, options?: any) => Promise.resolve(),
    }),
    where: (field: string, operator: string, value: any) => ({
      orderBy: (field: string, direction: string) => ({
        get: () => Promise.resolve({ 
          docs: [] as Array<{ 
            id: string; 
            data: () => any;
          }>
        })
      })
    })
  })
}
