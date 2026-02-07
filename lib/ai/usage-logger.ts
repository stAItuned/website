
import { dbDefault } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export type AIProvider = 'gemini' | 'perplexity';

export interface UsageLogContext {
    userId?: string | null;
    userEmail?: string | null;
    endpoint?: string;
    feature?: string;
}

import { PRICING, ModelPricing } from './pricing';
export type { ModelPricing }; // Re-export if needed or just rely on import


/**
 * Calculate estimated cost for a request
 */
export function calculateCost(
    provider: AIProvider,
    model: string,
    inputTokens: number,
    outputTokens: number
): number {
    let pricing: ModelPricing;

    if (provider === 'gemini') {
        pricing = PRICING[model] || PRICING['gemini-default'];
    } else {
        pricing = PRICING[model] || PRICING['perplexity-default'];
    }

    if (!pricing) {
        console.warn(`[UsageLogger] No pricing found for model ${model}, using zeros`);
        return 0;
    }

    const inputCost = (inputTokens / 1_000_000) * (pricing.inputPer1M || 0);
    const outputCost = (outputTokens / 1_000_000) * (pricing.outputPer1M || 0);
    const requestCost = pricing.perRequest || 0;

    return inputCost + outputCost + requestCost;
}

/**
 * Log AI usage to Firestore
 */
export async function logUsage(
    provider: AIProvider,
    model: string,
    inputTokens: number,
    outputTokens: number,
    context?: UsageLogContext
) {
    try {
        const estimatedCost = calculateCost(provider, model, inputTokens, outputTokens);

        const logEntry = {
            provider,
            model,
            inputTokens,
            outputTokens,
            totalTokens: inputTokens + outputTokens,
            estimatedCost,
            userId: context?.userId || null,
            userEmail: context?.userEmail || null,
            endpoint: context?.endpoint || 'unknown',
            timestamp: FieldValue.serverTimestamp(),
            week: getWeekKey(), // Helper for easy weekly aggregation
            month: getMonthKey() // Helper for easy monthly aggregation
        };

        // Use default DB (analytics)
        await dbDefault().collection('api_usage').add(logEntry);

    } catch (error) {
        // Silent failure to not disrupt the user experience
        console.error('[UsageLogger] Failed to log usage:', error);
    }
}

function getWeekKey(): string {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now.valueOf() - startOfYear.valueOf()) / 86400000;
    const weekNum = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${weekNum}`;
}

function getMonthKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
}
