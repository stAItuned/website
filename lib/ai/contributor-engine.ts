import { generateJSON } from './gemini';
import { CONTRIBUTOR_PROMPTS } from './contributor-prompts';
import { UsageLogContext } from './usage-logger';
import { getConfiguredGeminiModel } from './config-loader';
import {
    ContributorBrief,
    InterviewQnA,
    GenerateQuestionsResponse,
    GeneratedOutline,
    DEFAULT_MAX_QUESTIONS
} from '../types/contributor';



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
    options?: GenerateQuestionsOptions,
    context?: UsageLogContext
): Promise<GenerateQuestionsResponse> {
    const maxQuestions = options?.maxQuestions ?? DEFAULT_MAX_QUESTIONS;
    const questionNumber = history.length + 1;
    const forceComplete = options?.forceComplete ?? false;

    // HARD LIMIT: If we've already reached or exceeded maxQuestions, force completion
    if (questionNumber > maxQuestions || forceComplete) {
        // Don't generate more questions, just return readyForOutline
        return {
            questions: [],
            readyForOutline: true,
            missingDataPoints: [],
            coverageAssessment: {
                score: 70, // Acceptable default
                covered: [],
                missing: [],
                recommendation: 'acceptable',
                warningMessage: forceComplete
                    ? 'Intervista completata per scelta dell\'utente.'
                    : 'Raggiunto il numero massimo di domande.'
            },
            questionNumber,
            maxQuestions
        };
    }

    const promptTemplate = CONTRIBUTOR_PROMPTS.GENERATE_QUESTIONS(language);

    // Identify skipped questions
    const skippedQuestions = history
        .filter(h => h.answer.includes('SKIPPED') || h.answer.includes('Non sono sicuro') || h.answer.includes('Not sure'))
        .map(h => h.question);

    const promptContext = `
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

${skippedQuestions.length > 0 ? `
=== IGNORED/SKIPPED QUESTIONS (DO NOT ASK AGAIN) ===
The user explicitly skipped the following questions. DO NOT ask them or similar variations again.
${skippedQuestions.map(q => `- ${q}`).join('\n')}
` : ''}

=== INTERVIEW STATUS ===
Question Number: ${questionNumber}
Max Questions: ${maxQuestions}
Force Complete: ${forceComplete}
`;

    const prompt = `${promptTemplate}\n\n${promptContext}`;

    const modelName = await getConfiguredGeminiModel();
    const result = await generateJSON<GenerateQuestionsResponse>(prompt, context, modelName);

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
    sources?: DiscoveredSource[],
    context?: UsageLogContext
): Promise<GeneratedOutline> {
    const hasSources = sources && sources.length > 0;
    const promptTemplate = hasSources
        ? CONTRIBUTOR_PROMPTS.GENERATE_OUTLINE_WITH_SOURCES(language)
        : CONTRIBUTOR_PROMPTS.GENERATE_OUTLINE(language);

    let promptContext = `
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
        promptContext += `
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

    const prompt = `${promptTemplate}\n\n${promptContext}`;

    const modelName = await getConfiguredGeminiModel();
    const result = await generateJSON<GeneratedOutline>(prompt, context, modelName);

    if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to generate outline');
    }

    return result.data;
}
