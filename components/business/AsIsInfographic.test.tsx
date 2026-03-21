import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AsIsInfographic } from '@/components/business/AsIsInfographic'

describe('AsIsInfographic', () => {
  it('renders the Italian as-is flowchart', () => {
    render(<AsIsInfographic locale="it" />)

    expect(screen.getByRole('heading', { level: 3, name: 'Tre ruoli, nessun filo comune' })).toBeTruthy()
    expect(screen.getByText('Dipendente')).toBeTruthy()
    expect(screen.getByText('Legenda Criticità:')).toBeTruthy()
    expect(screen.getByText('Flusso dati manuale (Copia-Incolla)')).toBeTruthy()
  })

  it('renders the English as-is flowchart', () => {
    render(<AsIsInfographic locale="en" />)

    expect(screen.getByRole('heading', { level: 3, name: 'Three roles, no shared thread' })).toBeTruthy()
    expect(screen.getByText('Employee')).toBeTruthy()
    expect(screen.getByText('Critical legend:')).toBeTruthy()
    expect(screen.getByText('Manual data flow (copy-paste)')).toBeTruthy()
  })
})
