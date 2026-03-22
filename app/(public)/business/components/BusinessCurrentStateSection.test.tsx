import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BusinessCurrentStateSection } from '@/app/(public)/business/components/BusinessCurrentStateSection'
import { businessTranslations } from '@/lib/i18n/business-translations'

describe('BusinessCurrentStateSection', () => {
  it('renders the compact comparison header and transition cue in Italian', () => {
    render(<BusinessCurrentStateSection t={businessTranslations.it} locale="it" />)

    expect(screen.getByRole('heading', { level: 2, name: businessTranslations.it.currentState.title })).toBeTruthy()
    expect(screen.getByText(businessTranslations.it.currentState.transitionCue)).toBeTruthy()
    expect(screen.getByRole('button', { name: businessTranslations.it.currentState.chaoticLabel })).toBeTruthy()
    expect(screen.getByRole('button', { name: businessTranslations.it.currentState.centralizedLabel })).toBeTruthy()
  })

  it('renders the compact comparison header and transition cue in English', () => {
    render(<BusinessCurrentStateSection t={businessTranslations.en} locale="en" />)

    expect(screen.getByRole('heading', { level: 2, name: businessTranslations.en.currentState.title })).toBeTruthy()
    expect(screen.getByText(businessTranslations.en.currentState.transitionCue)).toBeTruthy()
    expect(screen.getByRole('button', { name: businessTranslations.en.currentState.chaoticLabel })).toBeTruthy()
    expect(screen.getByRole('button', { name: businessTranslations.en.currentState.centralizedLabel })).toBeTruthy()
  })
})
