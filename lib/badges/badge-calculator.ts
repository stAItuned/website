import { BADGE_DEFINITIONS } from '@/lib/config/badge-config';
import { AuthorBadge, Badge, BadgeEvidence } from '@/lib/types/badge';
import { generateCredentialId } from '@/lib/firebase/badge-service';

interface ArticleMetrics {
    slug: string;
    publishedAt: string;
    topic?: string;
    analytics: {
        pageViews: number;
        avgTimeOnPage: number; // seconds
        scrollDepth?: number; // percentage 0-100
    };
}

interface AuthorContext {
    slug: string;
    articles: ArticleMetrics[];
}

/**
 * Calculate eligible badges for an author based on current metrics
 */
export function calculateEligibleBadges(context: AuthorContext, existingBadges: string[]): {
    badge: AuthorBadge;
    evidence: BadgeEvidence[];
}[] {
    const earned: { badge: AuthorBadge; evidence: BadgeEvidence[] }[] = [];
    const now = new Date().toISOString();

    // 1. Volume Badges (Contribution)
    // -------------------------------------------------------------
    const publishedCount = context.articles.length;
    const contributionBadges = BADGE_DEFINITIONS.filter(b => b.category === 'contribution');

    for (const badgeDef of contributionBadges) {
        if (existingBadges.includes(badgeDef.id)) continue;

        if (badgeDef.thresholds.articleCount && publishedCount >= badgeDef.thresholds.articleCount) {
            earned.push(createBadgeAward(badgeDef, context.slug, { articleCount: publishedCount }));
        }
    }

    // 2. Impact Badges (Lifetime Qualified Reads)
    // -------------------------------------------------------------
    // Qualified Read = >30s time on page (simplified proxy for now)
    // Sum qualified reads (using avgTimeOnPage > 30s as proxy logic applied to pageViews)
    const qualifiedReads = context.articles.reduce((acc, art) => {
        if (art.analytics.avgTimeOnPage >= 30) {
            return acc + art.analytics.pageViews;
        }
        return acc;
    }, 0);

    const impactBadges = BADGE_DEFINITIONS.filter(b => b.category === 'impact');

    for (const badgeDef of impactBadges) {
        if (existingBadges.includes(badgeDef.id)) continue;

        if (badgeDef.thresholds.qualifiedReads && qualifiedReads >= badgeDef.thresholds.qualifiedReads) {
            earned.push(createBadgeAward(badgeDef, context.slug, { qualifiedReads }));
        }
    }

    // 3. Topic Specialists
    // -------------------------------------------------------------
    const topicBadges = BADGE_DEFINITIONS.filter(b => b.criteria.some(c => c.label.includes('Articles') && b.category === 'quality'));

    for (const badgeDef of topicBadges) {
        if (existingBadges.includes(badgeDef.id)) continue;

        // Check specific topic threshold
        const requiredTopic = badgeDef.thresholds.topic;
        const requiredCount = badgeDef.thresholds.topicArticleCount || 3;

        if (requiredTopic) {
            const topicCount = context.articles.filter(a => a.topic === requiredTopic).length;
            if (topicCount >= requiredCount) {
                earned.push(createBadgeAward(badgeDef, context.slug, { topicArticleCount: topicCount }));
            }
        }
    }

    return earned;
}

function createBadgeAward(badgeDef: Badge, authorSlug: string, metrics: any): { badge: AuthorBadge; evidence: BadgeEvidence[] } {
    const now = new Date();
    const credentialId = generateCredentialId(now.getFullYear() % 100);

    return {
        badge: {
            badgeId: badgeDef.id,
            authorId: authorSlug,
            earnedAt: now.toISOString(),
            credentialId,
            evidenceArticles: [], // Populated by caller if needed
            metrics,
            version: '1.0',
            isNew: true
        },
        evidence: [] // Simplified for now
    };
}
