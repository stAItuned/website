import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ToBeInfographic } from '@/components/business/ToBeInfographic'

describe('ToBeInfographic', () => {
  it('renders the Italian to-be flowchart', () => {
    render(<ToBeInfographic locale="it" />)

    expect(screen.getByRole('heading', { level: 3, name: 'Workflow centralizzato stAI tuned' })).toBeTruthy()
    expect(screen.getByText('Un solo flusso')).toBeTruthy()
    expect(screen.getByText('Stati tracciati')).toBeTruthy()
    expect(screen.getByText('Dati sempre sincronizzati')).toBeTruthy()
    expect(screen.getAllByText('Dipendente').length).toBeGreaterThan(0)
    expect(screen.getByText('Legenda Criticita:')).toBeTruthy()
    expect(screen.getByText('Flusso dati automatico')).toBeTruthy()
  })

  it('renders the English to-be flowchart', () => {
    render(<ToBeInfographic locale="en" />)

    expect(screen.getByRole('heading', { level: 3, name: 'Centralized stAItuned workflow' })).toBeTruthy()
    expect(screen.getByText('One shared flow')).toBeTruthy()
    expect(screen.getByText('Tracked states')).toBeTruthy()
    expect(screen.getByText('Always synced data')).toBeTruthy()
    expect(screen.getAllByText('Employee').length).toBeGreaterThan(0)
    expect(screen.getByText('Critical legend:')).toBeTruthy()
    expect(screen.getByText('Automated data flow')).toBeTruthy()
  })
})
