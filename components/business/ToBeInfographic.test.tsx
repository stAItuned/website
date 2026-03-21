import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ToBeInfographic } from '@/components/business/ToBeInfographic'

describe('ToBeInfographic', () => {
  it('renders the Italian to-be flowchart', () => {
    render(<ToBeInfographic locale="it" />)

    expect(screen.getByRole('heading', { level: 3, name: 'Workflow centralizzato stAItuned' })).toBeTruthy()
    expect(screen.getByText('Dipendente')).toBeTruthy()
    expect(screen.getByText('Legenda Criticita:')).toBeTruthy()
    expect(screen.getByText('Flusso dati automatico')).toBeTruthy()
  })

  it('renders the English to-be flowchart', () => {
    render(<ToBeInfographic locale="en" />)

    expect(screen.getByRole('heading', { level: 3, name: 'Centralized stAItuned workflow' })).toBeTruthy()
    expect(screen.getByText('Employee')).toBeTruthy()
    expect(screen.getByText('Critical legend:')).toBeTruthy()
    expect(screen.getByText('Automated data flow')).toBeTruthy()
  })
})
