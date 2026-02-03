import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { generateNextQuestions, DEFAULT_MAX_QUESTIONS } from '@/lib/ai/contributor-engine';
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
        const { brief, interviewHistory, language, forceComplete, maxQuestions } = body as {
            brief: ContributorBrief;
            interviewHistory: InterviewQnA[];
            language: 'it' | 'en';
            forceComplete?: boolean;
            maxQuestions?: number;
        };

        if (!brief || !brief.topic || !brief.thesis) {
            return NextResponse.json(
                { success: false, error: 'Incomplete brief data' },
                { status: 400 }
            );
        }

        // 3. Rate Limit Check
        const limitCheck = await checkAndConsume(user.uid, 'gemini', 'questionGeneration');
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

        // 4. Generate Questions (AI) with options
        const result = await generateNextQuestions(
            brief,
            interviewHistory || [],
            language || 'it',
            {
                forceComplete,
                maxQuestions: maxQuestions ?? DEFAULT_MAX_QUESTIONS
            }
        );

        // 4. Return Response with enhanced data
        return NextResponse.json({
            success: true,
            data: {
                questions: result.questions,
                readyForOutline: result.readyForOutline,
                missingDataPoints: result.missingDataPoints,
                coverageAssessment: result.coverageAssessment,
                questionNumber: result.questionNumber,
                maxQuestions: result.maxQuestions,
                // Progress percentage based on questions answered
                progressPercentage: Math.min(
                    100,
                    ((interviewHistory?.length || 0) / (result.maxQuestions ?? DEFAULT_MAX_QUESTIONS)) * 100
                )
            }
        });

    } catch (error) {
        console.error('[API] generate-questions error:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return NextResponse.json(
            { success: false, error: { code: 'GEMINI_ERROR', message } },
            { status: 500 }
        );
    }
}
