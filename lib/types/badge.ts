export type BadgeCategory = 'contribution' | 'impact' | 'quality';

export type BadgeTier = 'contributor' | 'bronze' | 'silver' | 'gold' | 'special';
export type BadgeEmailStatus = 'pending' | 'sent' | 'failed' | 'skipped';

/**
 * Per-article metric snapshot stored alongside each badge.
 * Records the specific metric value that contributed to earning the badge.
 * - contribution: pageViews at time of earning
 * - impact:       pageViews (qualified reads) for that article
 * - quality:      topic match count or quality score
 */
export interface ArticleMetricSnapshot {
    slug: string;               // Article slug
    title?: string;             // Article title
    url: string;                // Article URL
    pageViews: number;          // Page views at time of badge earning
    avgTimeOnPage?: number;     // Average time on page in seconds
    publishedAt?: string;       // ISO date of article publication
    topic?: string;             // Primary topic of the article
}

export interface CriteriaBullet {
    label: string;
    value?: string | number;
}

export interface BadgeThresholds {
    articleCount?: number;
    qualifiedReads?: number;
    qualityScore?: number;
    topPercentile?: number;
    topicArticleCount?: number;
    topic?: string;
}

export interface Badge {
    id: string;                    // e.g., "contributor", "gold-writer", "rag-specialist"
    category: BadgeCategory;
    tier: BadgeTier;
    name: { en: string; it: string };
    description: { en: string; it: string };
    icon: string;                  // Icon identifier for the frontend component
    criteria: CriteriaBullet[];    // To be displayed in the modal/tooltip
    thresholds: BadgeThresholds;   // For calculation logic
}

export interface AuthorBadge {
    badgeId: string;
    authorId: string;              // Author slug
    earnedAt: string;              // ISO date
    credentialId: string;          // STA-YY-XXXXXX format
    evidenceArticles: string[];    // Article slugs that contributed to this badge
    evidenceUrls?: string[];       // Article URLs that contributed to this badge
    metrics: {                     // Snapshot of metrics at time of earning
        articleCount?: number;
        qualifiedReads?: number;
        qualityScore?: number;
        articleSlugs?: string[];
        articleUrls?: string[];
        /** Per-article metric breakdown that contributed to earning this badge */
        articleMetrics?: ArticleMetricSnapshot[];
        [key: string]: number | boolean | string | string[] | ArticleMetricSnapshot[] | undefined;
    };
    version: string;               // Criteria version (e.g. "1.0")
    isNew?: boolean;               // For UI highlighting of new badges
    emailStatus?: BadgeEmailStatus; // Email notification status
    emailSentAt?: string;          // ISO date when email was sent
    emailApprovedAt?: string;      // ISO date when admin approved sending
    emailApprovedBy?: string;      // Admin email address
    emailLastError?: string;       // Last email send error message
}

export interface BadgeEvidence {
    id: string;
    badgeId: string;
    authorId: string;
    articleSlug: string;
    articleUrl?: string;
    contributedAt: string;
    type: 'volume' | 'impact' | 'quality';
    value: number; // e.g. 1 (count) or 345 (reads)
}
