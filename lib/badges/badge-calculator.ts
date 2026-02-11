import { BADGE_DEFINITIONS } from '@/lib/config/badge-config';
import { ArticleMetricSnapshot, AuthorBadge, Badge, BadgeEvidence } from '@/lib/types/badge';
import { generateCredentialId } from '@/lib/firebase/badge-service';

interface ArticleMetrics {
    slug: string;
    title: string;
    url: string;
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

const QUALIFIED_READ_SECONDS = 30;

/**
 * Calculate eligible badges for an author based on current metrics
 */
export function calculateEligibleBadges(context: AuthorContext, existingBadges: string[]): {
    badge: AuthorBadge;
    evidence: BadgeEvidence[];
}[] {
    const earned: { badge: AuthorBadge; evidence: BadgeEvidence[] }[] = [];
    const now = new Date().toISOString();
    const allArticleSlugs = context.articles.map((article) => article.slug);
    const allArticleUrls = context.articles.map((article) => article.url);

    // 1. Volume Badges (Contribution)
    // -------------------------------------------------------------
    const publishedCount = context.articles.length;
    const contributionBadges = BADGE_DEFINITIONS.filter(b => b.category === 'contribution');

    for (const badgeDef of contributionBadges) {
        if (existingBadges.includes(badgeDef.id)) continue;

        if (badgeDef.thresholds.articleCount && publishedCount >= badgeDef.thresholds.articleCount) {
            // Build per-article evidence and metric snapshots
            const evidence: BadgeEvidence[] = context.articles.map((art) => ({
                id: `${badgeDef.id}:${art.slug}`,
                badgeId: badgeDef.id,
                authorId: context.slug,
                articleSlug: art.slug,
                articleUrl: art.url,
                contributedAt: art.publishedAt,
                type: 'volume' as const,
                value: 1
            }));

            const articleMetrics: ArticleMetricSnapshot[] = context.articles.map((art) => ({
                slug: art.slug,
                title: art.title,
                url: art.url,
                pageViews: art.analytics.pageViews,
                avgTimeOnPage: art.analytics.avgTimeOnPage,
                publishedAt: art.publishedAt,
                topic: art.topic
            }));

            earned.push(
                createBadgeAward(
                    badgeDef,
                    context.slug,
                    {
                        articleCount: publishedCount,
                        articleSlugs: allArticleSlugs,
                        articleUrls: allArticleUrls,
                    },
                    allArticleSlugs,
                    allArticleUrls,
                    evidence,
                    articleMetrics
                )
            );
        }
    }

    // 2. Impact Badges (Qualified Reads per article)
    // -------------------------------------------------------------
    const impactBadges = BADGE_DEFINITIONS.filter(b => b.category === 'impact');

    for (const badgeDef of impactBadges) {
        if (existingBadges.includes(badgeDef.id)) continue;

        const qualifiedReadsThreshold = badgeDef.thresholds.qualifiedReads;
        if (!qualifiedReadsThreshold) continue;

        // Qualified Read = article avgTimeOnPage >= 30s (proxy).
        // Impact badges are awarded per-article, based on qualified reads in a single article.
        const qualifyingArticles = context.articles.filter(
            (art) =>
                art.analytics.avgTimeOnPage >= QUALIFIED_READ_SECONDS &&
                art.analytics.pageViews >= qualifiedReadsThreshold
        );

        if (qualifyingArticles.length > 0) {
            const qualifiedReads = qualifyingArticles.reduce((acc, art) => acc + art.analytics.pageViews, 0);
            const qualifiedSlugs = qualifyingArticles.map((art) => art.slug);
            const qualifiedUrls = qualifyingArticles.map((art) => art.url);
            const evidence: BadgeEvidence[] = qualifyingArticles.map((art) => ({
                id: `${badgeDef.id}:${art.slug}`,
                badgeId: badgeDef.id,
                authorId: context.slug,
                articleSlug: art.slug,
                articleUrl: art.url,
                contributedAt: art.publishedAt,
                type: 'impact' as const,
                value: art.analytics.pageViews
            }));

            // Per-article metric snapshots for qualifying articles
            const articleMetrics: ArticleMetricSnapshot[] = qualifyingArticles.map((art) => ({
                slug: art.slug,
                title: art.title,
                url: art.url,
                pageViews: art.analytics.pageViews,
                avgTimeOnPage: art.analytics.avgTimeOnPage,
                publishedAt: art.publishedAt,
                topic: art.topic
            }));

            earned.push(
                createBadgeAward(
                    badgeDef,
                    context.slug,
                    {
                        qualifiedReads,
                        articleSlugs: qualifiedSlugs,
                        articleUrls: qualifiedUrls,
                    },
                    qualifiedSlugs,
                    qualifiedUrls,
                    evidence,
                    articleMetrics
                )
            );
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
            const topicArticles = context.articles.filter(a => a.topic === requiredTopic);
            const topicCount = topicArticles.length;
            const topicSlugs = topicArticles.map((art) => art.slug);
            const topicUrls = topicArticles.map((art) => art.url);
            if (topicCount >= requiredCount) {
                // Build per-article evidence and metric snapshots
                const evidence: BadgeEvidence[] = topicArticles.map((art) => ({
                    id: `${badgeDef.id}:${art.slug}`,
                    badgeId: badgeDef.id,
                    authorId: context.slug,
                    articleSlug: art.slug,
                    articleUrl: art.url,
                    contributedAt: art.publishedAt,
                    type: 'quality' as const,
                    value: 1
                }));

                const articleMetrics: ArticleMetricSnapshot[] = topicArticles.map((art) => ({
                    slug: art.slug,
                    title: art.title,
                    url: art.url,
                    pageViews: art.analytics.pageViews,
                    avgTimeOnPage: art.analytics.avgTimeOnPage,
                    publishedAt: art.publishedAt,
                    topic: art.topic
                }));

                earned.push(
                    createBadgeAward(
                        badgeDef,
                        context.slug,
                        {
                            topicArticleCount: topicCount,
                            articleSlugs: topicSlugs,
                            articleUrls: topicUrls,
                        },
                        topicSlugs,
                        topicUrls,
                        evidence,
                        articleMetrics
                    )
                );
            }
        }
    }

    return earned;
}

/**
 * Helper to remove undefined properties from an object recursively
 * to prevent Firestore "Value for argument "data" is not a valid Firestore document" error.
 */
function stripUndefined<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
        return obj.map(stripUndefined) as unknown as T;
    }

    const result: any = {};
    for (const key in obj) {
        const value = (obj as any)[key];
        if (value !== undefined) {
            result[key] = stripUndefined(value);
        }
    }
    return result as T;
}

function createBadgeAward(
    badgeDef: Badge,
    authorSlug: string,
    metrics: Record<string, number | boolean | string | string[] | ArticleMetricSnapshot[] | undefined>,
    evidenceArticles: string[],
    evidenceUrls: string[],
    evidence: BadgeEvidence[] = [],
    articleMetrics: ArticleMetricSnapshot[] = []
): { badge: AuthorBadge; evidence: BadgeEvidence[] } {
    const now = new Date();
    const credentialId = generateCredentialId(now.getFullYear() % 100);

    return {
        badge: stripUndefined({
            badgeId: badgeDef.id,
            authorId: authorSlug,
            earnedAt: now.toISOString(),
            credentialId,
            evidenceArticles,
            evidenceUrls,
            metrics: {
                ...metrics,
                articleMetrics
            },
            version: '1.0',
            isNew: true,
            emailStatus: 'pending'
        }),
        evidence: evidence.map(stripUndefined)
    };
}
