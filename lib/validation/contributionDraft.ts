import { z } from 'zod'

const contributorBriefSchema = z.object({
  topic: z.string().trim().min(1).max(200),
  target: z.enum(['newbie', 'midway', 'expert']),
  format: z.enum([
    'tutorial',
    'deep_dive',
    'case_study',
    'trend_analysis',
    'comparative',
    'framework',
    'best_practices',
    'tool_review',
    'opinion',
    'other',
  ]),
  thesis: z.string().optional().default(''),
  context: z.string().optional(),
  hasExample: z.boolean(),
  sources: z.array(z.string()).default([]),
})

const interviewQnASchema = z.object({
  questionId: z.string().min(1),
  question: z.string().min(1),
  answer: z.string(),
  dataPoint: z.enum([
    'key_points',
    'examples',
    'claims',
    'thesis',
    'thesis_depth',
    'context_relevance',
    'author_expertise',
    'key_mechanisms',
    'evidence',
  ]),
  answeredAt: z.string().optional(),
})

/**
 * Minimal schema for the standalone draft editor (/contribute/draft).
 * Kept intentionally narrow so unexpected fields don't get persisted.
 */
export const contributionDraftCreateSchema = z.object({
  status: z.enum(['draft', 'review']),
  path: z.literal('autonomy'),
  language: z.enum(['it', 'en']),
  currentStep: z.enum(['draft_submission', 'review']),
  brief: contributorBriefSchema,
  draftContent: z.string().trim().min(1).max(200_000),
  interviewHistory: z.array(interviewQnASchema).default([]),
})

export const contributionDraftUpdateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['draft', 'review']).optional(),
  currentStep: z.enum(['draft_submission', 'review']).optional(),
  brief: contributorBriefSchema.partial().optional(),
  draftContent: z.string().trim().min(1).max(200_000).optional(),
})

export type ContributionDraftCreateInput = z.infer<typeof contributionDraftCreateSchema>
export type ContributionDraftUpdateInput = z.infer<typeof contributionDraftUpdateSchema>
