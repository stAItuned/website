import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash } from 'crypto';
import { verifyAuth, getAdminDb } from '@/lib/firebase/server-auth';
import { generateArticleOutline } from '@/lib/ai/contributor-engine';
import { checkAndConsume } from '@/lib/ai/rate-limiter';
import { getContribution } from '@/lib/firebase/contributor-db';
import { ContributorBrief, InterviewQnA, DiscoveredSource, GeneratedOutline } from '@/lib/types/contributor';

const OUTLINE_CACHE_COLLECTION = 'contributor_outline_cache_v1';
const OUTLINE_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const contributorBriefSchema = z.object({
    topic: z.string().min(1),
    target: z.enum(['newbie', 'midway', 'expert']),
    format: z.enum(['tutorial', 'deep_dive', 'case_study', 'trend_analysis', 'comparative', 'framework', 'best_practices', 'tool_review', 'opinion', 'other']),
    thesis: z.string().min(1),
    context: z.string().optional(),
    hasExample: z.boolean(),
    sources: z.array(z.string())
});

const interviewQnASchema = z.object({
    questionId: z.string().min(1),
    question: z.string().min(1),
    answer: z.string(),
    dataPoint: z.enum(['key_points', 'examples', 'claims', 'thesis', 'thesis_depth', 'context_relevance', 'author_expertise', 'key_mechanisms', 'evidence']),
    answeredAt: z.string().optional()
});

const discoveredSourceSchema = z.object({
    id: z.string().min(1),
    url: z.string().url(),
    title: z.string().min(1),
    domain: z.string().min(1),
    authorityScore: z.number(),
    relevanceReason: z.string(),
    usefulClaims: z.array(z.string()),
    suggestedEvidence: z.array(z.string()),
    selected: z.boolean(),
    selectedClaims: z.array(z.string()),
    selectedEvidence: z.array(z.string())
});

const requestSchema = z.object({
    contributionId: z.string().min(1).optional(),
    brief: contributorBriefSchema,
    interviewHistory: z.array(interviewQnASchema),
    language: z.enum(['it', 'en']).default('it'),
    sources: z.array(discoveredSourceSchema).optional()
});

type OutlineCacheDoc = {
    userId: string;
    inputHash: string;
    createdAt: string;
    expiresAt: string;
    outline: GeneratedOutline;
};

function stableStringify(value: unknown): string {
    if (Array.isArray(value)) {
        return `[${value.map(stableStringify).join(',')}]`;
    }

    if (value && typeof value === 'object') {
        const record = value as Record<string, unknown>;
        const keys = Object.keys(record).filter(key => record[key] !== undefined).sort();
        const entries = keys.map(key => `${JSON.stringify(key)}:${stableStringify(record[key])}`);
        return `{${entries.join(',')}}`;
    }

    return JSON.stringify(value);
}

function buildOutlineCacheHash(input: {
    userId: string;
    brief: ContributorBrief;
    interviewHistory: InterviewQnA[];
    language: 'it' | 'en';
    sources?: DiscoveredSource[];
}): string {
    const payload = stableStringify(input);
    return createHash('sha256').update(payload).digest('hex');
}

async function getCachedOutline(userId: string, inputHash: string): Promise<GeneratedOutline | null> {
    const db = getAdminDb();
    const docRef = db.collection(OUTLINE_CACHE_COLLECTION).doc(`${userId}_${inputHash}`);
    const snapshot = await docRef.get();

    if (!snapshot.exists) return null;

    const data = snapshot.data() as OutlineCacheDoc;
    const now = Date.now();
    const expiresAtMs = new Date(data.expiresAt).getTime();

    if (Number.isNaN(expiresAtMs) || expiresAtMs <= now) {
        await docRef.delete().catch(() => null);
        return null;
    }

    return data.outline;
}

async function setCachedOutline(userId: string, inputHash: string, outline: GeneratedOutline): Promise<void> {
    const db = getAdminDb();
    const docRef = db.collection(OUTLINE_CACHE_COLLECTION).doc(`${userId}_${inputHash}`);
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + OUTLINE_CACHE_TTL_MS).toISOString();

    const cacheDoc: OutlineCacheDoc = {
        userId,
        inputHash,
        createdAt,
        expiresAt,
        outline
    };

    await docRef.set(cacheDoc, { merge: true });
}

export async function POST(request: NextRequest) {
    try {
        // 1. Verify Auth
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse Body
        const body = await request.json();
        const parsed = requestSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: { code: 'INVALID_REQUEST', message: parsed.error.message } },
                { status: 400 }
            );
        }

        const { contributionId, brief, interviewHistory, language, sources } = parsed.data;
        const normalizedSources = sources && sources.length > 0 ? sources : undefined;

        // 3. Prefer saved contribution outline (conflict policy)
        if (contributionId) {
            const existing = await getContribution(contributionId);
            if (existing?.generatedOutline) {
                return NextResponse.json({
                    success: true,
                    data: existing.generatedOutline,
                    cached: true,
                    cacheSource: 'contribution'
                });
            }
        }

        const inputHash = buildOutlineCacheHash({
            userId: user.uid,
            brief,
            interviewHistory,
            language,
            sources: normalizedSources
        });

        const cachedOutline = await getCachedOutline(user.uid, inputHash);
        if (cachedOutline) {
            return NextResponse.json({
                success: true,
                data: cachedOutline,
                cached: true,
                cacheSource: 'firestore'
            });
        }

        // 4. Rate Limit Check
        const limitCheck = await checkAndConsume(user.uid, 'gemini', 'outlineGeneration', user.email);
        if (!limitCheck.allowed) {
            return NextResponse.json(
                {
                    success: false,
                    error: {
                        code: 'RATE_LIMIT_EXCEEDED',
                        message: `Daily limit allowed: ${limitCheck.limit}. Resets at ${new Date(limitCheck.resetAt).toLocaleTimeString()}`,
                        remaining: 0
                    }
                },
                { status: 429 }
            );
        }

        // 5. Generate Outline (AI)
        const result = await generateArticleOutline(
            brief,
            interviewHistory || [],
            language || 'it',
            normalizedSources,
            {
                userId: user.uid,
                userEmail: user.email,
                endpoint: 'generate-outline'
            }
        );

        await setCachedOutline(user.uid, inputHash, result);

        // 6. Return Response
        return NextResponse.json({
            success: true,
            data: result,
            cached: false,
            cacheSource: 'fresh'
        });

    } catch (error) {
        console.error('[API] generate-outline error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, error: { code: 'GEMINI_ERROR', message } },
            { status: 500 }
        );
    }
}
