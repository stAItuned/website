import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/firebase/server-auth';
import { generateJSON } from '@/lib/ai/gemini';
import { CONTRIBUTOR_PROMPTS } from '@/lib/ai/contributor-prompts';
import { AssistanceSuggestion, ContributorBrief, InterviewQnA, GeneratedQuestion } from '@/lib/types/contributor';

export async function POST(req: NextRequest) {
    try {
        const user = await verifyAuth(req);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { brief, question, interviewHistory, suggestions, language } = await req.json() as {
            brief: ContributorBrief;
            question: GeneratedQuestion;
            interviewHistory: InterviewQnA[];
            suggestions: AssistanceSuggestion[];
            language: 'it' | 'en';
        };

        if (!brief || !question || !suggestions || suggestions.length === 0) {
            return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
        }

        const promptTemplate = CONTRIBUTOR_PROMPTS.GENERATE_ANSWER_FROM_SOURCES(language || 'it');
        const suggestionsStr = suggestions.map((s) => {
            const parts = [
                `TEXT: ${s.text}`,
                s.sourceTitle ? `SOURCE_TITLE: ${s.sourceTitle}` : null,
                s.source ? `SOURCE_URL: ${s.source}` : null,
                s.authorityScore !== undefined ? `AUTHORITY: ${s.authorityScore}` : null,
                s.context ? `CONTEXT: ${s.context}` : null
            ].filter(Boolean);
            return parts.join('\n');
        }).join('\n\n');

        const historyStr = (interviewHistory || [])
            .map((q) => `Q: ${q.question}\nA: ${q.answer}`)
            .join('\n\n');

        const fullPrompt = `${promptTemplate}\n\nINPUT DATA:\nBrief Thesis: ${brief.thesis}\nTopic: ${brief.topic}\nTarget: ${brief.target}\n\nQuestion:\n${question.text}\n\nSuggestions:\n${suggestionsStr}\n\nPrevious Context:\n${historyStr || 'N/A'}`;

        const response = await generateJSON<{ answer: string }>(fullPrompt, { feature: 'answer_from_sources' });

        if (!response.success || !response.data?.answer) {
            return NextResponse.json({ success: false, error: response.error || 'Failed to generate answer' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: { answer: response.data.answer } });
    } catch (error) {
        console.error('[Generate Answer From Sources] Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
