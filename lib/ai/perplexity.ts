import { ContributorBrief, InterviewQnA, DiscoveredSource } from '../types/contributor';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_MODEL = 'sonar-pro'; // High reasoning model with search

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
}

/**
 * Discovers authoritative sources using Perplexity Sonar
 */
export async function discoverSources(
    brief: ContributorBrief,
    history: InterviewQnA[],
    language: 'it' | 'en'
): Promise<DiscoveredSource[]> {
    const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
        throw new Error('PERPLEXITY_API_KEY is not configured');
    }

    const systemPrompt = `
You are a Senior Editor and Fact Checker for staituned.
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
Find 4-6 highly authoritative sources that support the thesis and insights above.
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
        const content = json.choices[0].message.content;

        // Clean markdown code blocks if present // ```json ... ```
        const cleanJson = content.replace(/```json\n?|\n?```/g, '').trim();

        try {
            const parsed = JSON.parse(cleanJson);

            if (!parsed.sources || !Array.isArray(parsed.sources)) {
                throw new Error('Invalid JSON structure from Perplexity');
            }

            // Map and validate
            return parsed.sources.map((s: any, index: number) => ({
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

        } catch (parseError) {
            console.error('Failed to parse Perplexity JSON:', content);
            throw new Error('Failed to parse source discovery results');
        }

    } catch (error) {
        console.error('Source Discovery Failed:', error);
        throw error;
    }
}
