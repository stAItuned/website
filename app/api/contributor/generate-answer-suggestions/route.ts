import { NextRequest, NextResponse } from 'next/server';
import { generateJSON } from '@/lib/ai/gemini';
import { CONTRIBUTOR_PROMPTS } from '@/lib/ai/contributor-prompts';
import { AssistanceResponse } from '@/lib/types/contributor';

export async function POST(req: NextRequest) {
    try {
        const { brief, question, interviewHistory, language } = await req.json();

        // 1. Build prompt
        const promptTemplate = CONTRIBUTOR_PROMPTS.GENERATE_ANSWER_SUGGESTIONS(language || 'it');
        const contextStr = interviewHistory.map((q: any) => `Q: ${q.question}\nA: ${q.answer}`).join('\n\n');

        const fullPrompt = `${promptTemplate}\n\nINPUT DATA:\nBrief Thesis: ${brief.thesis}\nTopic: ${brief.topic}\nTarget: ${brief.target}\n\nPrevious Context:\n${contextStr}\n\nCURRENT QUESTION TO ANSWER:\n${question.text}`;

        // 2. Call Gemini
        const response = await generateJSON<{ suggestions: any[] }>(fullPrompt, { feature: 'answer_suggestions' });

        if (!response.success || !response.data) {
            return NextResponse.json({ success: false, error: response.error }, { status: 500 });
        }

        // 3. Map to standard AssistanceResponse format
        const suggestions = response.data.suggestions.map((s: any) => ({
            id: crypto.randomUUID(),
            type: 'drafting' as const,
            text: s.text,
            source: undefined, // No URL for generated drafts
            sourceTitle: s.sourceTitle || 'Draft Idea', // "Direct Approach", etc.
            authorityScore: undefined, // Not applicable
            context: s.context
        }));

        const result: AssistanceResponse = {
            suggestions,
            query: question.text,
            assistanceType: 'drafting'
        };

        return NextResponse.json({ success: true, data: result });

    } catch (error) {
        console.error('[Generate Suggestions] Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
