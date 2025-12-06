import { NextRequest, NextResponse } from 'next/server'

// Use dynamic import for Firebase Admin to handle initialization
async function deleteUserAccount(userId: string) {
  try {
    // Dynamic import for Firebase Admin
    const admin = await import('firebase-admin/app')
    const { getAuth } = await import('firebase-admin/auth')
    const { getFirestore } = await import('firebase-admin/firestore')
    
    // Get or initialize app
    let app
    if (admin.getApps().length === 0) {
      const serviceAccountKey = process.env.FB_SERVICE_ACCOUNT_KEY
      
      if (!serviceAccountKey || serviceAccountKey.includes('placeholder')) {
        throw new Error('Firebase Admin not configured')
      }
      
      app = admin.initializeApp({
        credential: admin.cert(JSON.parse(serviceAccountKey)),
      })
    } else {
      app = admin.getApps()[0]
    }
    
    const auth = getAuth(app)
    const db = getFirestore(app)

    // Delete user data from Firestore (all collections)
    const collections = ['users', 'preferences', 'drafts']
    
    for (const collectionName of collections) {
      try {
        const docRef = db.collection(collectionName).doc(userId)
        const doc = await docRef.get()
        
        if (doc.exists) {
          await docRef.delete()
          console.log(`Deleted ${collectionName} data for user ${userId}`)
        }
      } catch (error) {
        console.error(`Error deleting ${collectionName}:`, error)
        // Continue with other collections even if one fails
      }
    }

    // Delete user from Firebase Authentication
    try {
      await auth.deleteUser(userId)
      console.log(`Deleted auth user ${userId}`)
    } catch (error) {
      console.error('Error deleting auth user:', error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting user account:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Delete the user account
    await deleteUserAccount(userId)

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    })
  } catch (error) {
    console.error('Error in account deletion:', error)
    return NextResponse.json(
      { error: 'Failed to delete account', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
