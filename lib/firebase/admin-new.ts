// Firebase Admin SDK
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

let db: any;

try {
  // Try to initialize Firebase Admin
  const serviceAccountKey = process.env.FB_SERVICE_ACCOUNT_KEY;
  
  if (serviceAccountKey && !serviceAccountKey.includes('placeholder')) {
    const app = getApps()[0] ?? initializeApp({
      credential: cert(JSON.parse(serviceAccountKey)),
    });
    
    db = getFirestore(app);
    console.log('✅ Firebase Admin SDK initialized successfully');
  } else {
    throw new Error('Service account key not available or contains placeholders');
  }
} catch (error) {
  console.log('⚠️ Firebase Admin SDK not available, using mock implementation');
  
  // Mock implementation for development/local testing
  db = {
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
  };
}

export { db };
