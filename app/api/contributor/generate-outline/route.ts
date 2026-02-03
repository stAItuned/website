import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { generateArticleOutline } from '@/lib/ai/contributor-engine';
import { checkAndConsume } from '@/lib/ai/rate-limiter';
import { ContributorBrief, InterviewQnA } from '@/lib/types/contributor';

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

        // 3. Rate Limit Check
        const limitCheck = await checkAndConsume(user.uid, 'gemini', 'outlineGeneration');
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

        // 4. Generate Outline (AI)
        const result = await generateArticleOutline(
            brief,
            interviewHistory || [],
            language || 'it'
        );

        // 5. Return Response
        return NextResponse.json({
            success: true,
            data: result
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
