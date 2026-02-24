import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CareerOSLocaleToggle from './CareerOSLocaleToggle'

const replaceMock = vi.fn()
const refreshMock = vi.fn()
const searchParams = new URLSearchParams('foo=bar')

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock, refresh: refreshMock }),
  usePathname: () => '/career-os',
  useSearchParams: () => searchParams,
}))

describe('CareerOSLocaleToggle', () => {
  beforeEach(() => {
    replaceMock.mockReset()
    refreshMock.mockReset()
  })

  it('renders and switches to english preserving params', () => {
    render(<CareerOSLocaleToggle locale="it" />)

    fireEvent.click(screen.getByRole('button', { name: 'English' }))
    expect(replaceMock).toHaveBeenCalledWith('/career-os?foo=bar&lang=en')
    expect(refreshMock).toHaveBeenCalledTimes(1)
  })

  it('switches to italian', () => {
    render(<CareerOSLocaleToggle locale="en" />)

    fireEvent.click(screen.getByRole('button', { name: 'Italian' }))
    expect(replaceMock).toHaveBeenCalledWith('/career-os?foo=bar&lang=it')
    expect(refreshMock).toHaveBeenCalledTimes(1)
  })
})
