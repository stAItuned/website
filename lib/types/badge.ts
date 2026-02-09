export type BadgeCategory = 'contribution' | 'impact' | 'quality';

export type BadgeTier = 'contributor' | 'bronze' | 'silver' | 'gold' | 'special';

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
    metrics: {                     // Snapshot of metrics at time of earning
        articleCount?: number;
        qualifiedReads?: number;
        qualityScore?: number;
        [key: string]: number | boolean | string | undefined;
    };
    version: string;               // Criteria version (e.g. "1.0")
    isNew?: boolean;               // For UI highlighting of new badges
}

export interface BadgeEvidence {
    id: string;
    badgeId: string;
    authorId: string;
    articleSlug: string;
    contributedAt: string;
    type: 'volume' | 'impact' | 'quality';
    value: number; // e.g. 1 (count) or 345 (reads)
}
