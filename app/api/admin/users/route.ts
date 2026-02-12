import { NextRequest, NextResponse } from 'next/server';
import { dbDefault } from '@/lib/firebase/admin';
import { verifyAdmin } from '@/lib/firebase/server-auth';

interface WriterSlugDoc {
    slug?: string;
}

interface WriterProfileDoc {
    slug?: string;
    displayName?: string;
    title?: string;
    image?: unknown;
    published?: boolean;
    uid?: string;
    email?: string;
    createdAt?: string;
}

export async function GET(request: NextRequest) {
    const auth = await verifyAdmin(request);
    if (auth.error) {
        return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    try {
        const db = dbDefault();

        // Parallel fetch: Users (limit 100), Writer Slugs, and Writers
        const [usersSnapshot, slugsSnapshot, writersSnapshot] = await Promise.all([
            db.collection('users')
                .limit(1000)
                .get(),
            db.collection('writer_slugs').get(),
            db.collection('writers').get()
        ]);

        // Map UID -> Slug
        const uidToSlug = new Map<string, string>();
        slugsSnapshot.docs.forEach(doc => {
            const data = doc.data() as WriterSlugDoc;
            if (data.slug) uidToSlug.set(doc.id, data.slug);
        });

        // Map Slug -> Writer Profile
        const slugToProfile = new Map<string, WriterProfileDoc>();
        const uidToWriter = new Map<string, WriterProfileDoc>();
        writersSnapshot.docs.forEach(doc => {
            const writer = doc.data() as WriterProfileDoc;
            const normalizedWriter = {
                ...writer,
                slug: writer.slug || doc.id,
            };
            slugToProfile.set(doc.id, normalizedWriter);
            if (normalizedWriter.uid) uidToWriter.set(normalizedWriter.uid, normalizedWriter);
        });

        const users = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            const uid = doc.id;
            const slug = uidToSlug.get(uid);
            const writerProfile = (slug ? slugToProfile.get(slug) : null) ?? uidToWriter.get(uid) ?? null;

            return {
                uid,
                email: data.email,
                displayName: data.displayName,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
                lastLoginAt: data.lastLoginAt?.toDate ? data.lastLoginAt.toDate() : data.lastLoginAt,
                // Use actual writer profile existence as source of truth, fallback to flag
                isWriter: Boolean(writerProfile) || data.isWriter || false,
                agreement: data.agreement || null,
                writerProfile: writerProfile ? {
                    slug: writerProfile.slug,
                    displayName: writerProfile.displayName,
                    title: writerProfile.title,
                    image: writerProfile.image,
                    published: Boolean(writerProfile.published)
                } : null
            };
        });

        const knownUserUids = new Set(users.map((user) => user.uid));
        const knownWriterSlugs = new Set(
            users
                .map((user) => user.writerProfile?.slug)
                .filter((slug): slug is string => Boolean(slug))
        );

        const writerOnlyUsers = Array.from(slugToProfile.values())
            .filter((writer) => {
                const hasUid = Boolean(writer?.uid);
                const hasSlug = Boolean(writer?.slug);
                const uidOk = hasUid ? !knownUserUids.has(writer.uid as string) : true;
                const slugOk = hasSlug ? !knownWriterSlugs.has(writer.slug as string) : false;
                return uidOk && (hasSlug ? slugOk : true);
            })
            .map((writer) => ({
                uid: writer.uid || `writer:${writer.slug || 'unknown'}`,
                email: writer.email || '',
                displayName: writer.displayName || 'Writer',
                createdAt: writer.createdAt || null,
                lastLoginAt: null,
                isWriter: true,
                agreement: null,
                writerProfile: writer.slug ? {
                    slug: writer.slug,
                    displayName: writer.displayName,
                    title: writer.title,
                    image: writer.image,
                    published: Boolean(writer.published)
                } : null
            }));

        const mergedUsers = [...users, ...writerOnlyUsers];

        return NextResponse.json({ success: true, users: mergedUsers });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
    }
}
