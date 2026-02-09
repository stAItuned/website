import { Badge } from '@/lib/types/badge';

export const BADGE_DEFINITIONS: Badge[] = [
    // ==========================================
    // CONTRIBUTION (VOLUME) BADGES
    // ==========================================
    {
        id: 'contributor',
        category: 'contribution',
        tier: 'contributor',
        name: { en: 'Writer Contributor', it: 'Writer Contributor' },
        description: {
            en: 'Published their first article on stAItuned',
            it: 'Ha pubblicato il primo articolo su stAItuned'
        },
        icon: 'contributor',
        criteria: [{ label: 'Published Articles', value: '1+' }],
        thresholds: { articleCount: 1 }
    },
    {
        id: 'bronze-writer',
        category: 'contribution',
        tier: 'bronze',
        name: { en: 'Bronze Writer', it: 'Bronze Writer' },
        description: {
            en: 'Consistent contributor with 10+ published articles',
            it: 'Contributor costante con 10+ articoli pubblicati'
        },
        icon: 'bronze-writer',
        criteria: [{ label: 'Published Articles', value: '10+' }],
        thresholds: { articleCount: 10 }
    },
    {
        id: 'silver-writer',
        category: 'contribution',
        tier: 'silver',
        name: { en: 'Silver Writer', it: 'Silver Writer' },
        description: {
            en: 'Prolific author with 30+ published articles',
            it: 'Autore prolifico con 30+ articoli pubblicati'
        },
        icon: 'silver-writer',
        criteria: [{ label: 'Published Articles', value: '30+' }],
        thresholds: { articleCount: 30 }
    },
    {
        id: 'gold-writer',
        category: 'contribution',
        tier: 'gold',
        name: { en: 'Gold Writer', it: 'Gold Writer' },
        description: {
            en: 'Elite contributor with 50+ published articles',
            it: 'Contributor d\'élite con 50+ articoli pubblicati'
        },
        icon: 'gold-writer',
        criteria: [{ label: 'Published Articles', value: '50+' }],
        thresholds: { articleCount: 50 }
    },

    // ==========================================
    // IMPACT (PERFORMANCE) BADGES - Rolling 90d
    // ==========================================
    {
        id: 'bronze-impact',
        category: 'impact',
        tier: 'bronze',
        name: { en: 'Bronze Impact', it: 'Bronze Impact' },
        description: {
            en: '500+ Qualified Reads across all articles',
            it: '500+ Letture Qualificate su tutti gli articoli'
        },
        icon: 'bronze-impact',
        criteria: [{ label: 'Qualified Reads', value: '500+' }],
        thresholds: { qualifiedReads: 500 }
    },
    {
        id: 'silver-impact',
        category: 'impact',
        tier: 'silver',
        name: { en: 'Silver Impact', it: 'Silver Impact' },
        description: {
            en: '2,000+ Qualified Reads across all articles',
            it: '2.000+ Letture Qualificate su tutti gli articoli'
        },
        icon: 'silver-impact',
        criteria: [{ label: 'Qualified Reads', value: '2K+' }],
        thresholds: { qualifiedReads: 2000 }
    },
    {
        id: 'gold-impact',
        category: 'impact',
        tier: 'gold',
        name: { en: 'Gold Impact', it: 'Gold Impact' },
        description: {
            en: '5,000+ Qualified Reads across all articles',
            it: '5,000+ Letture Qualificate su tutti gli articoli'
        },
        icon: 'gold-impact',
        criteria: [{ label: 'Qualified Reads', value: '5K+' }],
        thresholds: { qualifiedReads: 5000 }
    },

    // ==========================================
    // QUALITY / EDITORIAL / SPECIALIST
    // ==========================================
    // {
    //     id: 'editor-approved',
    //     category: 'quality',
    //     tier: 'special',
    //     name: { en: 'Editor Approved', it: 'Editor Approved' },
    //     description: {
    //         en: 'Recognized for exceptional editorial quality',
    //         it: 'Riconosciuto per l\'eccezionale qualità editoriale'
    //     },
    //     icon: 'editor-approved',
    //     criteria: [{ label: 'Editorial Verification', value: 'Verified' }],
    //     thresholds: {} // Manual award
    // },
    {
        id: 'reader-favorite',
        category: 'quality',
        tier: 'special',
        name: { en: 'Reader Favorite', it: 'Reader Favorite' },
        description: {
            en: 'Top 10% highest completion rate',
            it: 'Top 10% tasso di completamento'
        },
        icon: 'reader-favorite',
        criteria: [
            { label: 'Completion Rate', value: 'Top 10%' },
            { label: 'Min. Reads', value: '100' }
        ],
        thresholds: { topPercentile: 10 }
    },
    {
        id: 'specialist-rag',
        category: 'quality',
        tier: 'special',
        name: { en: 'RAG Specialist', it: 'RAG Specialist' },
        description: {
            en: 'Expert knowledge in Retrieval Augmented Generation',
            it: 'Esperto in Retrieval Augmented Generation'
        },
        icon: 'specialist-rag',
        criteria: [{ label: 'RAG Articles', value: '3+' }],
        thresholds: { topicArticleCount: 3, topic: 'RAG' }
    },
    {
        id: 'specialist-agents',
        category: 'quality',
        tier: 'special',
        name: { en: 'AI Agents Specialist', it: 'AI Agents Specialist' },
        description: {
            en: 'Expert knowledge in AI Agents & Orchestration',
            it: 'Esperto in AI Agents & Orchestration'
        },
        icon: 'specialist-agents',
        criteria: [{ label: 'AI Agents Articles', value: '3+' }],
        thresholds: { topicArticleCount: 3, topic: 'AI Agents' }
    }
];
