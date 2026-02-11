import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import slugify from 'slugify';
import { findWriterProfileByEmail } from '@/lib/writer/fs';
import { writerProfileFieldsSchema } from '@/lib/validation/writerProfile';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function yamlString(value: string): string {
    const normalized = value.replace(/\r?\n/g, ' ').trim();
    const escaped = normalized.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `"${escaped}"`;
}

async function ensureUniqueTeamSlug(teamDir: string, baseSlug: string): Promise<string> {
    const cleanBase = baseSlug.replace(/^-+|-+$/g, '') || 'writer';
    let candidate = cleanBase;
    let suffix = 2;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            await fs.access(path.join(teamDir, candidate));
            candidate = `${cleanBase}-${suffix}`;
            suffix += 1;
        } catch {
            return candidate;
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        const user = await verifyAuth(request);

        if (!user || !user.email) {
            console.error('[API] Unauthorized: user or email missing.', {
                hasHeader: !!authHeader,
                hasUser: !!user,
                hasEmail: !!user?.email
            });
            return NextResponse.json({
                success: false,
                error: 'Unauthorized',
                debug: {
                    hasHeader: !!authHeader,
                    hasUser: !!user,
                    hasEmail: !!user?.email
                }
            }, { status: 401 });
        }

        const formData = await request.formData();
        const imageFile = formData.get('image');

        const parsed = writerProfileFieldsSchema.safeParse({
            name: String(formData.get('name') ?? ''),
            surname: String(formData.get('surname') ?? ''),
            title: String(formData.get('title') ?? ''),
            bio: String(formData.get('bio') ?? ''),
            linkedin: String(formData.get('linkedin') ?? ''),
            website: String(formData.get('website') ?? ''),
            consent: formData.get('consent') === 'true',
        });

        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: 'Invalid fields', details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        if (!(imageFile instanceof File)) {
            return NextResponse.json({ success: false, error: 'Missing profile picture' }, { status: 400 });
        }

        const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
        if (!allowedTypes.has(imageFile.type)) {
            return NextResponse.json(
                { success: false, error: 'Invalid image type. Allowed: JPEG, PNG, WebP' },
                { status: 400 }
            );
        }

        const maxSizeBytes = 5 * 1024 * 1024;
        if (imageFile.size > maxSizeBytes) {
            return NextResponse.json({ success: false, error: 'Image too large (max 5MB)' }, { status: 400 });
        }

        const fields = parsed.data;

        const teamDir = path.join(process.cwd(), 'public/content/team');
        await fs.mkdir(teamDir, { recursive: true });

        // If the user already has a profile, keep its slug (idempotent updates)
        const existingProfile = await findWriterProfileByEmail(user.email);

        const baseSlug = slugify(`${fields.name}-${fields.surname}`, {
            replacement: '-',
            strict: true,
            lower: false,
            trim: true,
        });

        const dirName = existingProfile?.slug ?? (await ensureUniqueTeamSlug(teamDir, baseSlug));
        const userDir = path.join(teamDir, dirName);

        await fs.mkdir(userDir, { recursive: true });

        // Create meta.md content
        const shortDescription = fields.bio.replace(/\s+/g, ' ').trim().slice(0, 280);
        const metaContent = `---
name: ${yamlString(`${fields.name} ${fields.surname}`)}
team: [Writers]
title: ${yamlString(fields.title)}
linkedin: ${yamlString(fields.linkedin ?? '')}
email: ${yamlString(user.email)}
website: ${yamlString(fields.website ?? '')}
description: ${yamlString(shortDescription)}
speaker: false
legal_consent: true
consent_date: ${yamlString(new Date().toISOString())}
---

${fields.bio}
`;

        await fs.writeFile(path.join(userDir, 'meta.md'), metaContent, 'utf8');

        // Save image
        // Convert File to Buffer
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Process image with Sharp: Resize to 500x500 cover and convert to JPEG
        const processedImageBuffer = await sharp(buffer)
            .resize(500, 500, {
                fit: 'cover',
                position: 'center'
            })
            .jpeg({ quality: 85 })
            .toBuffer();

        await fs.writeFile(path.join(userDir, 'propic.jpg'), processedImageBuffer);

        return NextResponse.json({
            success: true,
            slug: dirName,
            profilePath: `/content/team/${dirName}`,
            isWriter: true
        });

    } catch (error) {
        console.error('[API] create-writer-profile error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create profile' },
            { status: 500 }
        );
    }
}
