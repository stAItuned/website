import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AsIsInfographic } from '@/components/business/AsIsInfographic'

describe('AsIsInfographic', () => {
  it('renders the Italian as-is flowchart', () => {
    render(<AsIsInfographic locale="it" />)

    expect(screen.getByRole('heading', { level: 3, name: 'Tre ruoli, nessun filo comune' })).toBeTruthy()
    expect(screen.getByText('Passaggi manuali')).toBeTruthy()
    expect(screen.getByText('Canali sparsi')).toBeTruthy()
    expect(screen.getAllByText('Dipendente').length).toBeGreaterThan(0)
    expect(screen.getByText('Legenda Criticità:')).toBeTruthy()
    expect(screen.getAllByText('Flusso dati manuale (Copia-Incolla)').length).toBeGreaterThan(0)
  })

  it('renders the English as-is flowchart', () => {
    render(<AsIsInfographic locale="en" />)

    expect(screen.getByRole('heading', { level: 3, name: 'Three roles, no shared thread' })).toBeTruthy()
    expect(screen.getByText('Manual handoffs')).toBeTruthy()
    expect(screen.getByText('Scattered channels')).toBeTruthy()
    expect(screen.getAllByText('Employee').length).toBeGreaterThan(0)
    expect(screen.getByText('Critical legend:')).toBeTruthy()
    expect(screen.getAllByText('Manual data flow (copy-paste)').length).toBeGreaterThan(0)
  })
})
