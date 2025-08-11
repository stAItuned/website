"use server"
import { db } from "@/lib/firebase/admin"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function saveDraft(data: { 
  id?: string
  title: string
  slug: string
  content: string
  tags?: string[]
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const collection = db.collection('drafts')
  const ref = data.id
    ? collection.doc(data.id)
    : collection.doc()

  await ref.set({
    title: data.title,
    slug: data.slug,
    content: data.content,
    tags: data.tags || [],
    author_uid: session.user.email,
    status: 'draft',
    updated_at: new Date(),
    created_at: data.id ? undefined : new Date()
  }, { merge: true })

  return { id: ref.id }
}

export async function getDrafts() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    throw new Error("Unauthorized")
  }

  const snapshot = await db
    .collection('drafts')
    .where('author_uid', '==', session.user.email)
    .orderBy('updated_at', 'desc')
    .get()

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}
