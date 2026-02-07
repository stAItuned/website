import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthContext';

export interface UsageStats {
    used: number;
    limit: number;
    remaining: number;
    resetAt: string;
}

export interface UserAIUsage {
    gemini: {
        questionGeneration: UsageStats;
        outlineGeneration: UsageStats;
    };
    perplexity: {
        sourceDiscovery: UsageStats;
    };
}

export function useAIUsage() {
    const { user } = useAuth();
    const [usage, setUsage] = useState<UserAIUsage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsage = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            const token = await user.getIdToken();
            setLoading(true);
            const res = await fetch('/api/contributor/get-usage', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (data.success) {
                setUsage(data.data);
                setError(null);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to load usage stats');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchUsage();
    }, [fetchUsage]);

    const getRemaining = (service: 'gemini' | 'perplexity', action: string): number => {
        if (!usage) return 0;
        // @ts-expect-error - Dynamic access to strictly typed services
        return usage[service]?.[action]?.remaining ?? 0;
    };

    const getResetTime = (service: 'gemini' | 'perplexity', action: string): string => {
        if (!usage) return '';
        // @ts-expect-error - Dynamic access to strictly typed services
        const dateStr = usage[service]?.[action]?.resetAt;
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return {
        usage,
        loading,
        error,
        refreshUsage: fetchUsage,
        getRemaining,
        getResetTime
    };
}
