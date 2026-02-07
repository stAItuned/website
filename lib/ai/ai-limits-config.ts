
export const AI_LIMITS = {
    gemini: {
        questionGeneration: {
            daily: 20,
            displayName: 'Question Generation'
        },
        outlineGeneration: {
            daily: 5,
            displayName: 'Outline Generation'
        },
    },
    perplexity: {
        sourceDiscovery: {
            daily: 3,
            displayName: 'Source Discovery'
        },
        findAssistance: {
            daily: 10,
            displayName: 'Answer Assistance'
        },
    },
} as const;

export type AIService = keyof typeof AI_LIMITS;
export type GeminiAction = keyof typeof AI_LIMITS.gemini;
export type PerplexityAction = keyof typeof AI_LIMITS.perplexity;
