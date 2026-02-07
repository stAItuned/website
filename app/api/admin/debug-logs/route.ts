
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { isAdmin } from '@/lib/firebase/admin-emails';
import { dbDefault } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
    try {
        const user = await verifyAuth(request);
        if (!user || !isAdmin(user.email)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const snapshot = await dbDefault()
            .collection('api_usage')
            .orderBy('timestamp', 'desc')
            .limit(5)
            .get();

        const logs = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                timestampType: data.timestamp ? typeof data.timestamp : 'undefined',
                timestampString: data.timestamp && data.timestamp.toDate ? data.timestamp.toDate().toISOString() : String(data.timestamp),
                ...data
            };
        });

        return NextResponse.json({ logs });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
