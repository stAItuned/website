import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { discoverSources } from '@/lib/ai/perplexity';
import { checkAndConsume } from '@/lib/ai/rate-limiter';
import { ContributorBrief, InterviewQnA, SourceDiscoveryData } from '@/lib/types/contributor';

export async function POST(request: NextRequest) {
    try {
        // 1. Verify Auth
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse Body
        const body = await request.json();
        const { brief, interviewHistory, language } = body as {
            brief: ContributorBrief;
            interviewHistory: InterviewQnA[];
            language: 'it' | 'en';
        };

        if (!brief || !brief.topic) {
            return NextResponse.json(
                { success: false, error: 'Incomplete brief data' },
                { status: 400 }
            );
        }


        // 3. Rate Limit Check
        const limitCheck = await checkAndConsume(user.uid, 'perplexity', 'sourceDiscovery');
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

        // 4. Discover Sources (Perplexity)
        // Check if we have API key
        if (!process.env.PERPLEXITY_API_KEY) {
            console.error('Missing PERPLEXITY_API_KEY');
            return NextResponse.json(
                { success: false, error: { code: 'CONFIG_ERROR', message: 'Source discovery not configured' } },
                { status: 503 }
            );
        }

        const sources = await discoverSources(
            brief,
            interviewHistory || [],
            language || 'it'
        );

        const discoveryData: SourceDiscoveryData = {
            sources,
            discoveredAt: new Date().toISOString(),
            searchQuery: `Topic: ${brief.topic}, Thesis: ${brief.thesis}`
        };

        // 4. Return Response
        return NextResponse.json({
            success: true,
            data: discoveryData
        });

    } catch (error) {
        console.error('[API] discover-sources error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, error: { code: 'AI_ERROR', message } },
            { status: 500 }
        );
    }
}
