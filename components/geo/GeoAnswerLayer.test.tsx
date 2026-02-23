import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GeoQuickAnswersIntro } from './GeoQuickAnswersIntro'

describe('GeoQuickAnswersIntro', () => {
  it('renders custom quickAnswer title and all bullets', () => {
    render(
      <GeoQuickAnswersIntro
        quickAnswer={{
          title: 'Answer in 30 seconds',
          oneThing: 'Primary takeaway with [source](https://example.com)',
          bullets: [
            'First takeaway [9]',
            'Second takeaway with [paper](https://example.org) and [4, 5]',
          ],
        }}
        lang="en"
      />
    )

    expect(screen.getByText('Answer in 30 seconds')).toBeTruthy()
    expect(screen.getByText('Primary takeaway with')).toBeTruthy()
    expect(screen.getByText('First takeaway')).toBeTruthy()
    expect(screen.getByText((content) => content.includes('Second takeaway with'))).toBeTruthy()
    expect(screen.getByRole('link', { name: 'source' }).getAttribute('href')).toBe('https://example.com')
    expect(screen.getByRole('link', { name: 'paper' }).getAttribute('href')).toBe('https://example.org')
    expect(screen.getByRole('link', { name: '9' }).getAttribute('href')).toBe('#ref-9')
    expect(screen.getByRole('link', { name: '4' }).getAttribute('href')).toBe('#ref-4')
    expect(screen.getByRole('link', { name: '5' }).getAttribute('href')).toBe('#ref-5')
  })

  it('falls back to English title when title is missing', () => {
    render(
      <GeoQuickAnswersIntro
        quickAnswer={{ bullets: ['First takeaway'] }}
        lang="en"
      />
    )

    expect(screen.getByText('Key Takeaways')).toBeTruthy()
  })

  it('falls back to Italian title when title is missing', () => {
    render(
      <GeoQuickAnswersIntro
        quickAnswer={{ bullets: ['First takeaway'] }}
        lang="it"
      />
    )

    expect(screen.getByText('Punti chiave')).toBeTruthy()
  })
})
