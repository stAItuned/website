import { generateJSON } from './gemini';
import { CONTRIBUTOR_PROMPTS } from './contributor-prompts';
import {
    ContributorBrief,
    InterviewQnA,
    GenerateQuestionsResponse,
    GeneratedOutline
} from '../types/contributor';

/**
 * Default maximum number of interview questions
 */
export const DEFAULT_MAX_QUESTIONS = 5;

/**
 * Options for question generation
 */
export interface GenerateQuestionsOptions {
    maxQuestions?: number;
    forceComplete?: boolean;
}

export async function generateNextQuestions(
    brief: ContributorBrief,
    history: InterviewQnA[],
    language: 'it' | 'en',
    options?: GenerateQuestionsOptions
): Promise<GenerateQuestionsResponse> {
    const maxQuestions = options?.maxQuestions ?? DEFAULT_MAX_QUESTIONS;
    const questionNumber = history.length + 1;
    const forceComplete = options?.forceComplete ?? false;

    const promptTemplate = CONTRIBUTOR_PROMPTS.GENERATE_QUESTIONS(language);

    const context = `
=== INITIAL BRIEF ===
Topic: ${brief.topic}
Target Audience: ${brief.target}
Format: ${brief.format}
Thesis: ${brief.thesis}
Context: ${brief.context || 'N/A'}
Has Example: ${brief.hasExample}
Sources: ${brief.sources.join(', ') || 'None'}

=== INTERVIEW HISTORY ===
${history.map(h => `Q: ${h.question}\nA: ${h.answer}`).join('\n\n')}

=== INTERVIEW STATUS ===
Question Number: ${questionNumber}
Max Questions: ${maxQuestions}
Force Complete: ${forceComplete}
`;

    const prompt = `${promptTemplate}\n\n${context}`;

    const result = await generateJSON<GenerateQuestionsResponse>(prompt);

    if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to generate questions');
    }

    // Enrich response with metadata
    return {
        ...result.data,
        questionNumber,
        maxQuestions
    };
}

import { DiscoveredSource } from '../types/contributor';

export async function generateArticleOutline(
    brief: ContributorBrief,
    history: InterviewQnA[],
    language: 'it' | 'en',
    sources?: DiscoveredSource[]
): Promise<GeneratedOutline> {
    const hasSources = sources && sources.length > 0;
    const promptTemplate = hasSources
        ? CONTRIBUTOR_PROMPTS.GENERATE_OUTLINE_WITH_SOURCES(language)
        : CONTRIBUTOR_PROMPTS.GENERATE_OUTLINE(language);

    let context = `
=== VALIDATED BRIEF ===
Topic: ${brief.topic}
Target Audience: ${brief.target}
Format: ${brief.format}
Thesis: ${brief.thesis}
Context: ${brief.context || 'N/A'}
Has Example: ${brief.hasExample}
Sources (User Provided): ${brief.sources.join(', ') || 'None'}

=== FULL INTERVIEW TRANSCRIPT ===
${history.map(h => `Q: ${h.question}\nA: ${h.answer}`).join('\n\n')}
`;

    if (hasSources) {
        context += `
=== SELECTED AUTHORITATIVE SOURCES ===
${sources.map(s => `
SOURCE: ${s.title} (${s.url})
RELEVANCE: ${s.relevanceReason}
SELECTED CLAIMS:
${s.selectedClaims.map(c => `- ${c}`).join('\n')}
SUGGESTED EVIDENCE:
${s.selectedEvidence.map(e => `- ${e}`).join('\n')}
`).join('\n\n')}
`;
    }

    const prompt = `${promptTemplate}\n\n${context}`;

    const result = await generateJSON<GeneratedOutline>(prompt);

    if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to generate outline');
    }

    return result.data;
}
