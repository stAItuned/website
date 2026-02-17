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

interface ContributionAgreementDoc {
    contributorId?: string;
    agreement?: {
        agreement_version?: string;
        version?: string;
        accepted_at?: string;
        agreedAt?: string;
        checkbox_general?: boolean;
        agreed?: boolean;
        author_name?: string;
        author_email?: string;
        fiscal_code?: string;
        agreement_hash_sha256?: string;
        agreement_view_url?: string;
        ip?: string;
        user_agent?: string;
    };
    updatedAt?: string;
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

        const [agreementsByCheckbox, agreementsByAgreed] = await Promise.all([
            db.collection('contributions')
                .where('agreement.checkbox_general', '==', true)
                .get(),
            db.collection('contributions')
                .where('agreement.agreed', '==', true)
                .get()
        ]);

        const agreementsByUser = new Map<string, ContributionAgreementDoc['agreement']>();
        const agreementDocs = [...agreementsByCheckbox.docs, ...agreementsByAgreed.docs];
        agreementDocs.forEach((doc) => {
            const data = doc.data() as ContributionAgreementDoc;
            if (!data.contributorId || !data.agreement) return;
            const normalizedAgreement = {
                ...data.agreement,
                version: data.agreement.version || data.agreement.agreement_version,
                agreedAt: data.agreement.agreedAt || data.agreement.accepted_at,
                accepted_at: data.agreement.accepted_at || data.agreement.agreedAt,
            };

            const existing = agreementsByUser.get(data.contributorId);
            if (!existing) {
                agreementsByUser.set(data.contributorId, normalizedAgreement);
                return;
            }

            const existingDate = (existing.accepted_at || existing.agreedAt) ?? '';
            const currentDate = (normalizedAgreement.accepted_at || normalizedAgreement.agreedAt) ?? '';
            if (currentDate && currentDate > existingDate) {
                agreementsByUser.set(data.contributorId, normalizedAgreement);
            }
        });

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
            const agreement = agreementsByUser.get(uid) ?? null;
            const email = data.email || agreement?.author_email || writerProfile?.email || '';

            return {
                uid,
                email,
                displayName: data.displayName,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
                lastLoginAt: data.lastLoginAt?.toDate ? data.lastLoginAt.toDate() : data.lastLoginAt,
                // Use actual writer profile existence as source of truth, fallback to flag
                isWriter: Boolean(writerProfile) || data.isWriter || false,
                agreement,
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
            .map((writer) => {
                const agreement = writer.uid ? agreementsByUser.get(writer.uid) ?? null : null;
                const email = writer.email || agreement?.author_email || '';

                return {
                    uid: writer.uid || `writer:${writer.slug || 'unknown'}`,
                    email,
                    displayName: writer.displayName || 'Writer',
                    createdAt: writer.createdAt || null,
                    lastLoginAt: null,
                    isWriter: true,
                    agreement,
                    writerProfile: writer.slug ? {
                        slug: writer.slug,
                        displayName: writer.displayName,
                        title: writer.title,
                        image: writer.image,
                        published: Boolean(writer.published)
                    } : null
                };
            });

        const mergedUsers = [...users, ...writerOnlyUsers];

        return NextResponse.json({ success: true, users: mergedUsers });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch users' }, { status: 500 });
    }
}
