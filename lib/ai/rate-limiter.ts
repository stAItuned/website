import { getAdminDb } from '../firebase/server-auth';
import { AI_LIMITS, AIService, GeminiAction, PerplexityAction } from './ai-limits-config';

const COLLECTION = 'ai_usage';

interface UsageRecord {
    count: number;
    resetAt: string; // ISO date
}

type ServiceUsage<T> = {
    [K in keyof T]?: UsageRecord;
};

interface UserUsageDoc {
    userId: string;
    gemini?: ServiceUsage<typeof AI_LIMITS.gemini>;
    perplexity?: ServiceUsage<typeof AI_LIMITS.perplexity>;
    lastUpdated: string;
}

export interface LimitCheckResult {
    allowed: boolean;
    remaining: number;
    resetAt: string;
    limit: number;
}

/**
 * Helper to get the start of the next day (reset time)
 */
function getNextResetTime(): Date {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
}

/**
 * Helper to check if a usage record is expired
 */
function isExpired(resetAt: string): boolean {
    return new Date() >= new Date(resetAt);
}

/**
 * Check if action is allowed and consume 1 unit if yes.
 * Returns the status AFTER the potential consumption.
 */
export async function checkAndConsume(
    userId: string,
    service: AIService,
    action: string, // Generic string to allow flexibility, but typed in overloads
    userEmail?: string | null
): Promise<LimitCheckResult> {
    const db = getAdminDb();

    // 0. Skip for Admins
    if (userEmail) {
        const { isAdmin } = await import('../firebase/admin-emails');
        if (isAdmin(userEmail)) {
            return {
                allowed: true,
                remaining: 999,
                resetAt: new Date(Date.now() + 86400000).toISOString(),
                limit: 999
            };
        }
    }

    const docRef = db.collection(COLLECTION).doc(userId);
    const now = new Date();
    const nextReset = getNextResetTime();

    // Get limits config
    // @ts-ignore - Dynamic access to config
    const limitConfig = AI_LIMITS[service][action];
    if (!limitConfig) {
        throw new Error(`Unknown action ${action} for service ${service}`);
    }
    const maxLimit = limitConfig.daily;

    return await db.runTransaction(async (t) => {
        const doc = await t.get(docRef);
        let data: UserUsageDoc = doc.exists ? (doc.data() as UserUsageDoc) : { userId, lastUpdated: now.toISOString() };

        // Initialize service/action if missing
        if (!data[service]) data[service] = {};
        // @ts-ignore
        let record = data[service][action] as UsageRecord | undefined;

        // Check expiration / initialize
        if (!record || isExpired(record.resetAt)) {
            record = {
                count: 0,
                resetAt: nextReset.toISOString()
            };
        }

        // Check limit
        if (record.count >= maxLimit) {
            return {
                allowed: false,
                remaining: 0,
                resetAt: record.resetAt,
                limit: maxLimit
            };
        }

        // Consume
        record.count++;

        // Update data structure
        // @ts-ignore
        data[service][action] = record;
        data.lastUpdated = now.toISOString();

        t.set(docRef, data);

        return {
            allowed: true,
            remaining: maxLimit - record.count,
            resetAt: record.resetAt,
            limit: maxLimit
        };
    });
}

/**
 * Get current usage for all services
 */
export async function getUserUsage(userId: string) {
    const db = getAdminDb();
    const doc = await db.collection(COLLECTION).doc(userId).get();

    // Default empty structure
    const usage: any = { gemini: {}, perplexity: {} };
    const nextReset = getNextResetTime().toISOString();

    if (!doc.exists) {
        // Return all full limits
        for (const [service, actions] of Object.entries(AI_LIMITS)) {
            for (const [action, config] of Object.entries(actions)) {
                usage[service][action] = {
                    used: 0,
                    limit: (config as any).daily,
                    remaining: (config as any).daily,
                    resetAt: nextReset
                };
            }
        }
        return usage;
    }

    const data = doc.data() as UserUsageDoc;

    // Process each configured limit
    for (const [service, actions] of Object.entries(AI_LIMITS)) {
        for (const [action, config] of Object.entries(actions)) {
            // @ts-ignore
            const record = data[service]?.[action] as UsageRecord | undefined;

            let used = 0;
            let currentReset = nextReset;

            if (record) {
                if (isExpired(record.resetAt)) {
                    used = 0; // Expired, so effectively 0
                } else {
                    used = record.count;
                    currentReset = record.resetAt;
                }
            }

            usage[service][action] = {
                used,
                limit: (config as any).daily,
                remaining: Math.max(0, (config as any).daily - used),
                resetAt: currentReset
            };
        }
    }

    return usage;
}
