export type ContributorTarget = 'newbie' | 'midway' | 'expert';
export type ContributorFormat = 'tutorial' | 'deep_dive' | 'case_study' | 'trend_analysis' | 'comparative' | 'framework' | 'best_practices' | 'tool_review' | 'opinion' | 'other';
export type ContributionStatus = 'pitch' | 'interview' | 'outline' | 'draft' | 'review' | 'scheduled' | 'published';
export type ContributionPath = 'autonomy' | 'guided' | 'interview';

export interface ContributorBrief {
    topic: string;
    target: ContributorTarget;
    format: ContributorFormat;
    thesis: string;
    context?: string;
    hasExample: boolean;
    sources: string[];
}

export interface InterviewQnA {
    questionId: string;
    question: string;
    answer: string;
    dataPoint: 'key_points' | 'examples' | 'claims' | 'thesis';
    answeredAt?: string; // ISO date
}

export interface GeneratedQuestion {
    id: string;
    text: string;
    dataPoint: 'key_points' | 'examples' | 'claims' | 'thesis';
    helperText?: string;
    motivation?: string; // Why this helps authority
    exampleAnswer?: string;
}

/**
 * Coverage assessment returned by AI after each question
 */
export interface CoverageAssessment {
    score: number;                                    // 0-100
    covered: string[];                                // e.g. ["thesis", "examples"]
    missing: string[];                                // e.g. ["sources", "claims"]
    recommendation: 'strong' | 'acceptable' | 'weak';
    warningMessage?: string;                          // User-facing message
}

export interface GenerateQuestionsResponse {
    questions: GeneratedQuestion[];
    readyForOutline: boolean;
    missingDataPoints: string[];
    // New fields for interview flow improvements
    coverageAssessment?: CoverageAssessment;
    questionNumber?: number;                          // Current question (1-based)
    maxQuestions?: number;                            // Cap (default 5)
}

export interface GeneratedSection {
    heading: string;
    type: 'intro' | 'context' | 'core' | 'evidence' | 'takeaways';
    suggestedWords: number;
    prompts: string[];
    suggestedSources: Array<{
        claim: string;
        sourceUrl: string;
        sourceTitle: string;
    }>;
}

export interface GeneratedOutline {
    title: string;
    sections: GeneratedSection[];
    qualityChecklist: {
        hasOriginalAngle: boolean;
        evidenceRatio: string;
        targetAlignment: boolean;
    };
    geoSuggestions: {
        quickAnswer: string;
        definition: { term: string; definition: string };
    };
}

export interface DiscoveredSource {
    id: string;                    // UUID
    url: string;
    title: string;
    domain: string;
    authorityScore: number;        // 0-100
    relevanceReason: string;       // Why it's useful
    usefulClaims: string[];        // Quotable claims
    suggestedEvidence: string[];   // Specific evidence
    // User selection
    selected: boolean;
    selectedClaims: string[];
    selectedEvidence: string[];
}

export interface SourceDiscoveryData {
    sources: DiscoveredSource[];
    discoveredAt: string;
    searchQuery: string;
}

export interface Contribution {
    id: string;
    contributorId: string; // auth.uid
    contributorEmail: string;
    status: ContributionStatus;
    path: ContributionPath;
    language: 'it' | 'en';

    // Progress
    currentStep: 'pitch' | 'agreement' | 'interview' | 'coverage_review' | 'source_discovery' | 'outline' | 'review';

    // Data
    brief: ContributorBrief;
    interviewHistory: InterviewQnA[];
    sourceDiscovery?: SourceDiscoveryData;
    generatedOutline?: GeneratedOutline;
    agreement?: {
        agreed: boolean;
        agreedAt: string;
        legalName: string;
        fiscalCode?: string;
        version: string;
    };

    // Metadata
    createdAt: string; // ISO
    updatedAt: string; // ISO
    lastSavedAt: string; // ISO
}
