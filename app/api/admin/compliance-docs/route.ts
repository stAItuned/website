import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { isAdmin } from '@/lib/firebase/admin-emails';
import { getComplianceDocById, listComplianceDocs } from '@/lib/admin/compliance-docs';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!isAdmin(user.email)) {
      return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const docId = searchParams.get('doc');

    if (docId) {
      const doc = await getComplianceDocById(docId);
      if (!doc) {
        return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, doc }, { status: 200 });
    }

    const docs = await listComplianceDocs();
    return NextResponse.json({ success: true, docs }, { status: 200 });
  } catch (error) {
    console.error('[API] admin/compliance-docs error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to load compliance docs' },
      { status: 500 },
    );
  }
}
