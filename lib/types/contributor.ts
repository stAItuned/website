export type ContributorTarget = 'newbie' | 'midway' | 'expert';
export type ContributorFormat = 'tutorial' | 'deep_dive' | 'case_study' | 'trend_analysis' | 'comparative' | 'framework' | 'best_practices' | 'tool_review' | 'opinion' | 'other';
export type ContributionStatus = 'pitch' | 'interview' | 'outline' | 'draft' | 'review' | 'scheduled' | 'published';
export type ContributionPath = 'autonomy' | 'guided' | 'interview';

// Assistance types
export type AssistanceType = 'examples' | 'claims' | 'sources' | 'definition' | 'drafting';

export interface AssistanceSuggestion {
    id: string;
    type: AssistanceType;
    text: string;                  // The actual suggestion (e.g., "Netflix uses AI to...")
    source?: string;               // Optional URL
    sourceTitle?: string;          // Optional source name
    authorityScore?: number;       // 0-100 score of source authority
    context?: string;              // Why this is useful
}

export interface AssistanceResponse {
    suggestions: AssistanceSuggestion[];
    query: string;
    assistanceType: AssistanceType;
}

/**
 * Default maximum number of interview questions
 */
export const DEFAULT_MAX_QUESTIONS = 5;

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
    dataPoint: 'key_points' | 'examples' | 'claims' | 'thesis' | 'thesis_depth' | 'context_relevance' | 'author_expertise' | 'key_mechanisms' | 'evidence';
    answeredAt?: string; // ISO date
}

export interface GeneratedQuestion {
    id: string;
    text: string;
    dataPoint: 'key_points' | 'examples' | 'claims' | 'thesis' | 'thesis_depth' | 'context_relevance' | 'author_expertise' | 'key_mechanisms' | 'evidence';
    helperText?: string;
    motivation?: string; // Why this helps authority
    exampleAnswer?: string;
    needsAssistance?: boolean;              // Flag indicating this question may need help
    assistanceType?: AssistanceType;        // Type of assistance to offer
    assistancePrompt?: string;              // What to search for if user clicks help
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

export interface GeneratedSectionSource {
    claim: string;
    sourceUrl: string;
    sourceTitle: string;
    context?: string;
}

export interface GeneratedSection {
    heading: string;
    type: 'intro' | 'context' | 'core' | 'evidence' | 'takeaways';
    suggestedWords: number;
    prompts: string[];
    suggestedSources: GeneratedSectionSource[];
    integratedSources?: GeneratedSectionSource[];
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
    currentStep: 'path_intro' | 'pitch' | 'agreement' | 'interview' | 'coverage_review' | 'source_discovery' | 'outline' | 'draft_submission' | 'review';

    // Data
    brief: ContributorBrief;
    /**
     * Last generated interview question not yet answered.
     * Optional so legacy records don't break.
     */
    currentQuestion?: GeneratedQuestion | null;
    draftContent?: string;
    interviewHistory: InterviewQnA[];
    sourceDiscovery?: SourceDiscoveryData;
    generatedOutline?: GeneratedOutline;
    agreement?: {
        // Core status
        checkbox_general: boolean;
        checkbox_1341: boolean;
        accepted_at: string; // ISO date
        agreement_version: string;

        // Identity
        author_name: string;
        author_email: string;
        fiscal_code?: string;

        // Audit Trail
        ip: string;
        user_agent: string;
        agreement_hash_sha256: string;
        agreement_view_url?: string;

        // Legacy/compatibility fields (optional)
        agreed?: boolean;
        agreedAt?: string;
        legalName?: string;
        version?: string;
        hash?: string;
    };

    /**
     * Admin review metadata.
     */
    review?: {
        status: 'approved' | 'rejected' | 'changes_requested';
        note?: string;
        updatedAt: string;
        reviewerEmail: string;
        annotations?: {
            start: number;
            end: number;
            note: string;
            createdAt: string;
            authorEmail: string;
        }[];
    };

    // Metadata
    createdAt: string; // ISO
    updatedAt: string; // ISO
    lastSavedAt: string; // ISO
}
