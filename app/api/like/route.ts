import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { sanitizeSlug } from '@/lib/sanitizeSlug';

export async function POST(request: Request) {
  try {
    const { slug, action } = await request.json();
    if (!slug || !['like', 'unlike'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }
  const sanitizedSlug = sanitizeSlug(slug);
    const articleRef = db().collection('articles').doc(sanitizedSlug);
    if (action === 'like') {
      await articleRef.set({ likes: 1 }, { merge: true });
      await articleRef.update({ likes: FieldValue.increment(1) });
    } else if (action === 'unlike') {
      await articleRef.update({ likes: FieldValue.increment(-1) });
    }
    const updatedDoc = await articleRef.get();
    return NextResponse.json({ success: true, likes: updatedDoc.data()?.likes ?? 0 });
  } catch (error) {
    console.error('Like API error', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
