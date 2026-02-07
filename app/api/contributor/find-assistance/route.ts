import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { findAssistance, PERPLEXITY_MODEL } from '@/lib/ai/perplexity';
import { checkAndConsume } from '@/lib/ai/rate-limiter';
import { AssistanceType } from '@/lib/types/contributor';

type CacheEntry = { data: any; createdAt: number };
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour
const assistanceCache = new Map<string, CacheEntry>();

function buildCacheKey(params: {
    query: string;
    assistanceType: AssistanceType;
    context: { topic: string; thesis: string };
    language: 'it' | 'en';
    userId: string;
}) {
    return JSON.stringify(params);
}

function getCachedResponse(key: string) {
    const entry = assistanceCache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.createdAt > CACHE_TTL_MS) {
        assistanceCache.delete(key);
        return null;
    }
    return entry.data;
}

function setCachedResponse(key: string, data: any) {
    assistanceCache.set(key, { data, createdAt: Date.now() });
}

export async function POST(request: NextRequest) {
    try {
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { query, assistanceType, context, language } = body as {
            query: string;
            assistanceType: AssistanceType;
            context: { topic: string; thesis: string };
            language: 'it' | 'en';
        };

        if (!query || !assistanceType) {
            return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
        }

        const cacheKey = buildCacheKey({
            query,
            assistanceType,
            context,
            language,
            userId: user.uid
        });

        const cached = getCachedResponse(cacheKey);
        if (cached) {
            return NextResponse.json({
                success: true,
                data: cached,
                cached: true,
                model: PERPLEXITY_MODEL
            });
        }

        // Rate Limit
        const limitCheck = await checkAndConsume(user.uid, 'perplexity', 'findAssistance', user.email);
        if (!limitCheck.allowed) {
            return NextResponse.json({
                success: false,
                error: {
                    code: 'RATE_LIMIT_EXCEEDED',
                    message: 'Daily assistance limit reached.',
                    remaining: 0
                }
            }, { status: 429 });
        }

        const suggestions = await findAssistance(
            query,
            assistanceType as 'examples' | 'claims' | 'sources' | 'definition',
            context,
            language,
            { userId: user.uid, userEmail: user.email, endpoint: 'find-assistance' }
        );

        const payload = {
            suggestions,
            query
        };

        setCachedResponse(cacheKey, payload);

        return NextResponse.json({ success: true, data: payload, model: PERPLEXITY_MODEL });

    } catch (error) {
        console.error('[API] find-assistance error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
