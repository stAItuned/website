'use client'

import { Contribution } from '@/lib/types/contributor'

export type DraftStatus = 'draft' | 'review'
export type DraftStep = 'draft_submission' | 'review'

export interface CreateAutonomyDraftInput {
  status: DraftStatus
  currentStep: DraftStep
  title: string
  draftContent: string
}

export interface UpdateAutonomyDraftInput {
  id: string
  status: DraftStatus
  currentStep?: DraftStep
  title?: string
  draftContent: string
  existingBriefTopic?: string
}

/**
 * Loads a draft contribution owned by the current user.
 */
export async function fetchUserDraft(token: string, id: string): Promise<Contribution> {
  const response = await fetch(`/api/user/draft?id=${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) {
    const err = (await response.json()) as { error?: string }
    throw new Error(err.error || 'Failed to load draft')
  }
  const data = (await response.json()) as { contribution: Contribution }
  return data.contribution
}

/**
 * Uploads an inline image for the draft editor and returns a public URL.
 */
export async function uploadDraftImage(authToken: string, file: File): Promise<string> {
  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch('/api/user/draft-image', {
    method: 'POST',
    headers: { Authorization: `Bearer ${authToken}` },
    body: formData,
  })
  if (!response.ok) {
    const err = (await response.json()) as { error?: string }
    throw new Error(err.error || 'Failed to upload image')
  }

  const data = (await response.json()) as { url: string }
  return data.url
}

/**
 * Creates a new autonomy draft contribution and returns its id.
 */
export async function createAutonomyDraft(token: string, input: CreateAutonomyDraftInput): Promise<string> {
  const response = await fetch('/api/user/draft', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      status: input.status,
      path: 'autonomy',
      language: 'it',
      currentStep: input.currentStep,
      brief: {
        topic: input.title || 'Untitled Draft',
        target: 'midway',
        format: 'other',
        thesis: '',
        hasExample: false,
        sources: [],
      },
      draftContent: input.draftContent,
      interviewHistory: [],
    }),
  })

  if (!response.ok) throw new Error('Failed to create draft')
  const data = (await response.json()) as { id: string }
  return data.id
}

/**
 * Updates an existing autonomy draft contribution.
 */
export async function updateAutonomyDraft(token: string, input: UpdateAutonomyDraftInput): Promise<void> {
  const response = await fetch('/api/user/draft', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      id: input.id,
      draftContent: input.draftContent,
      status: input.status,
      ...(input.currentStep ? { currentStep: input.currentStep } : {}),
      ...(input.title && input.title !== input.existingBriefTopic ? { brief: { topic: input.title } } : {}),
    }),
  })

  if (!response.ok) throw new Error('Failed to update draft')
}

