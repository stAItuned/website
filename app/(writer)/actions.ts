// Only enable server actions for non-static builds
const isStaticBuild = process.env.FIREBASE_DEPLOYMENT === 'true'

if (!isStaticBuild) {
  // This directive is only included in non-static builds
  eval('"use server"')
}


import { db } from "@/lib/firebase/admin"

export async function saveDraft(data: { 
  id?: string
  title: string
  slug: string
  content: string
  tags?: string[]
}) {
  if (isStaticBuild) {
    throw new Error("Server actions are not available in static builds")
  }
  

  // TODO: Replace with Firebase Auth check if needed
  throw new Error("Server actions are not available without NextAuth.js. Use client-side Firebase Auth instead.")

  const collection = db.collection('drafts')
  const ref = data.id
    ? collection.doc(data.id)
    : collection.doc() // Auto-generate document ID


  // Not available without NextAuth.js

  return { id: ref.id }
}

export async function getDrafts(): Promise<Array<{ id: string; title?: string; content?: string; [key: string]: unknown }>> {
  if (isStaticBuild) {
    throw new Error("Server actions are not available in static builds")
  }
  

  // TODO: Replace with Firebase Auth check if needed
  throw new Error("Server actions are not available without NextAuth.js. Use client-side Firebase Auth instead.")


  // Not available without NextAuth.js
  // Return empty array with proper typing
  return []
}
