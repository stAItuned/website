import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { checkUserHasAgreement } from '@/lib/firebase/contributor-db';
import { getWriterByUid } from '@/lib/writer/firestore';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * POST /api/user/draft-image
 * Handles image uploads for the draft editor.
 * Saves images to public/content/drafts/images/ and returns the public URL.
 */
export async function POST(request: NextRequest) {
    try {
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (!user.uid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const hasAgreement = await checkUserHasAgreement(user.uid);
        if (!hasAgreement) {
            return NextResponse.json({ error: 'Contributor agreement required' }, { status: 403 });
        }

        const writerProfile = await getWriterByUid(user.uid);
        if (!writerProfile) {
            return NextResponse.json({ error: 'Writer profile required' }, { status: 403 });
        }

        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG' },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 5MB' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const ext = file.name.split('.').pop() || 'jpg';
        const uniqueId = crypto.randomBytes(8).toString('hex');
        const filename = `${uniqueId}.${ext}`;

        // Ensure directory exists
        const imageDir = path.join(process.cwd(), 'public/content/drafts/images');
        await fs.mkdir(imageDir, { recursive: true });

        // Save file
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(path.join(imageDir, filename), buffer);

        // Return public URL
        const url = `/content/drafts/images/${filename}`;

        return NextResponse.json({ success: true, url });
    } catch (error) {
        console.error('[API] draft-image upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload image' },
            { status: 500 }
        );
    }
}
