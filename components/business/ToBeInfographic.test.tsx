import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ToBeInfographic } from '@/components/business/ToBeInfographic'

describe('ToBeInfographic', () => {
  it('renders the Italian to-be flowchart', () => {
    render(<ToBeInfographic locale="it" />)

    expect(screen.getByRole('heading', { level: 3, name: 'Workflow centralizzato stAI tuned' })).toBeTruthy()
    expect(screen.getAllByText('Dato unico, viste diverse').length).toBeGreaterThan(0)
    expect(screen.getByText('Stati tracciati')).toBeTruthy()
    expect(screen.getByText('Dati sempre sincronizzati')).toBeTruthy()
    expect(screen.getByText('Nessun copia-incolla tra file')).toBeTruthy()
    expect(screen.getAllByText('Motore condiviso').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Sincronizzazione continua').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Dipendente').length).toBeGreaterThan(0)
    expect(screen.getByText('Legenda Criticita:')).toBeTruthy()
    expect(screen.getByText('Flusso dati automatico')).toBeTruthy()
  })

  it('renders the English to-be flowchart', () => {
    render(<ToBeInfographic locale="en" />)

    expect(screen.getByRole('heading', { level: 3, name: 'Centralized stAItuned workflow' })).toBeTruthy()
    expect(screen.getAllByText('One data source, different views').length).toBeGreaterThan(0)
    expect(screen.getByText('Tracked states')).toBeTruthy()
    expect(screen.getByText('Always synced data')).toBeTruthy()
    expect(screen.getByText('No copy-paste across files')).toBeTruthy()
    expect(screen.getAllByText('Shared system engine').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Continuous sync').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Employee').length).toBeGreaterThan(0)
    expect(screen.getByText('Critical legend:')).toBeTruthy()
    expect(screen.getByText('Automated data flow')).toBeTruthy()
  })
})
