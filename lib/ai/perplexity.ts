import { ContributorBrief, InterviewQnA, DiscoveredSource } from '../types/contributor';
import { logUsage, UsageLogContext } from './usage-logger';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
export const PERPLEXITY_MODEL = 'sonar-pro'; // High reasoning model with search

interface PerplexityMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface PerplexityResponse {
    id: string;
    model: string;
    choices: {
        index: number;
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }[];
    citations: string[]; // Perplexity returns citations here
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

/**
 * Discovers authoritative sources using Perplexity Sonar
 */
export async function discoverSources(
    brief: ContributorBrief,
    history: InterviewQnA[],
    language: 'it' | 'en',
    context?: UsageLogContext
): Promise<DiscoveredSource[]> {
    const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
        throw new Error('PERPLEXITY_API_KEY is not configured');
    }

    const systemPrompt = `
You are a Senior Editor and Fact Checker for staituned.
Use deep, careful reasoning to identify the most authoritative, relevant sources.
Your goal is to find AUTHORITATIVE and VERIFIABLE sources to support the article described below.

OUTPUT FORMAT:
Return a valid JSON object with a "sources" array.
Each source object must have:
- title: string
- url: string (MUST be a real, accessible URL from your search results)
- domain: string (e.g., "mckinsey.com")
- authorityScore: number (0-100, based on domain reputation and relevance)
- relevanceReason: string (Why is this useful for THIS specific article?)
- usefulClaims: string[] (Extract 2-3 specific statistics, quotes, or findings)
- suggestedEvidence: string[] (What specific proof does this provide?)

CRITICAL RULES:
1. ONLY return sources that you have verified via search.
2. URLs must be exact.
3. authorityScore should filter out low-quality SEO spam or generic aggregators. Focus on primary sources (papers, official docs, reputed industry reports).
4. Language of the "relevanceReason" and "usefulClaims" should be in ${language === 'it' ? 'Italian' : 'English'}.
`;

    const userPrompt = `
=== ARTICLE CONTEXT ===
Topic: ${brief.topic}
Thesis: ${brief.thesis}
Target: ${brief.target}

=== INTERVIEW INSIGHTS ===
${history.map(h => `Q: ${h.question}\nA: ${h.answer}`).join('\n\n')}

=== TASK ===
Find 8-10 highly authoritative sources that support the thesis and insights above.
Focus on:
- Recent industry reports (Gartner, Forrester, McKinsey, etc.)
- Official documentation
- Academic papers or technical case studies
- High-quality technical blog posts (only if very relevant)

Return ONLY the JSON.
`;

    try {
        const response = await fetch(PERPLEXITY_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: PERPLEXITY_MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.1,
                // Perplexity specific parameter to ensuring citation URLs are returned
                // Note: Sonar models usually handle citations in the text or metadata, 
                // but for JSON mode we rely on the model putting them in the JSON fields.
            })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Perplexity API Error: ${response.status} - ${error}`);
        }

        const json: PerplexityResponse = await response.json();

        // Log usage
        if (json.usage) {
            logUsage(
                'perplexity',
                PERPLEXITY_MODEL,
                json.usage.prompt_tokens,
                json.usage.completion_tokens,
                context
            ).catch(err => console.error('[Perplexity] Failed to log usage:', err));
        }

        const content = json.choices[0].message.content;

        // Improved JSON extraction: find the first { and last }
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');

        let parsed;
        if (jsonStart !== -1 && jsonEnd !== -1) {
            const potentialJson = content.substring(jsonStart, jsonEnd + 1);
            try {
                parsed = JSON.parse(potentialJson);
            } catch (e) {
                const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim();
                parsed = JSON.parse(cleanJson);
            }
        } else {
            const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim();
            parsed = JSON.parse(cleanJson);
        }

        if (!parsed || !parsed.sources || !Array.isArray(parsed.sources)) {
            throw new Error('Invalid JSON structure from Perplexity');
        }

        // Map and validate
        return parsed.sources.map((s: any) => ({
            id: crypto.randomUUID(),
            url: s.url,
            title: s.title || s.url,
            domain: new URL(s.url).hostname.replace('www.', ''),
            authorityScore: s.authorityScore || 50,
            relevanceReason: s.relevanceReason || 'Potentially relevant source',
            usefulClaims: Array.isArray(s.usefulClaims) ? s.usefulClaims : [],
            suggestedEvidence: Array.isArray(s.suggestedEvidence) ? s.suggestedEvidence : [],
            selected: false,
            selectedClaims: [],
            selectedEvidence: []
        }));

    } catch (error) {
        console.error('Source Discovery Failed:', error);
        throw error;
    }
}


/**
 * Finds assistance (examples, claims, sources, definitions) for interview questions
 */
export async function findAssistance(
    query: string,
    assistanceType: 'examples' | 'claims' | 'sources' | 'definition',
    context: { topic: string; thesis: string },
    language: 'it' | 'en',
    usageContext?: UsageLogContext
): Promise<import('../types/contributor').AssistanceSuggestion[]> {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) throw new Error('PERPLEXITY_API_KEY is not configured');

    const typePromptMap = {
        examples: 'Find concrete real-world examples',
        claims: 'Find specific statistics and verified claims',
        sources: 'Find authoritative sources (papers, reports)',
        definition: 'Find clear, expert definitions'
    };

    const systemPrompt = `
You are an Expert Research Assistant for staituned.
Your goal is to find ${typePromptMap[assistanceType]} for the user's article.
Topic: ${context.topic}
Thesis: ${context.thesis}

OUTPUT FORMAT:
Return a valid JSON object with a "suggestions" array (max 5 items).
Each item MUST have:
- "text": The content (e.g., "Company X increased revenue by 20%...")
- "source": EXACT URL of the source
- "sourceTitle": Title of the organization or report (e.g., "Gartner", "McKinsey")
- "authorityScore": A number from 0 to 100 based on the source's reputation
- "context": Brief explanation of how this validates the user's point

Language: ${language === 'it' ? 'Italian' : 'English'}

CRITICAL: Return ONLY the JSON object. No preamble, no explanation.
    `;

    try {
        const response = await fetch(PERPLEXITY_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: PERPLEXITY_MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: query }
                ],
                temperature: 0.1
            })
        });

        if (!response.ok) {
            throw new Error(`Perplexity API Error: ${response.status}`);
        }

        const json: PerplexityResponse = await response.json();

        if (json.usage) {
            logUsage('perplexity', PERPLEXITY_MODEL, json.usage.prompt_tokens, json.usage.completion_tokens, usageContext)
                .catch(err => console.error('[Perplexity] Failed to log usage:', err));
        }

        const content = json.choices[0].message.content;

        // Improved JSON extraction: find the first { and last }
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');

        let parsed;
        if (jsonStart !== -1 && jsonEnd !== -1) {
            const potentialJson = content.substring(jsonStart, jsonEnd + 1);
            try {
                parsed = JSON.parse(potentialJson);
            } catch (e) {
                console.error('Initial JSON parse failed, trying fallback cleaning');
                const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim();
                parsed = JSON.parse(cleanJson);
            }
        } else {
            const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim();
            parsed = JSON.parse(cleanJson);
        }

        console.log('[Perplexity] Raw content:', content);
        console.log('[Perplexity] Parsed:', parsed);

        if (!parsed || (!parsed.suggestions && !Array.isArray(parsed))) {
            throw new Error('Invalid JSON structure from Perplexity');
        }

        const suggestionsArray = Array.isArray(parsed) ? parsed : (parsed.suggestions || []);

        return suggestionsArray.map((s: any) => ({
            id: crypto.randomUUID(),
            type: assistanceType,
            text: s.text,
            source: s.source,
            sourceTitle: s.sourceTitle,
            authorityScore: s.authorityScore || 50,
            context: s.context
        }));

    } catch (error) {
        console.error('Find Assistance Failed:', error);
        throw error;
    }
}
