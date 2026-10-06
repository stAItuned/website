import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type React from 'react'
import { VentureVisualMedia } from './VentureVisualMedia'

vi.mock('next/image', () => ({
  default: ({ fill, priority, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => (
    <img alt="" {...props} />
  ),
}))

describe('VentureVisualMedia', () => {
  it('renders a placeholder when imageSrc is not provided', () => {
    render(
      <VentureVisualMedia
        title="Harnex"
        label="Harnex product visual"
        index={1}
        placeholderLabel="Placeholder visuale"
      />
    )

    expect(screen.getByRole('img', { name: 'Harnex product visual' })).not.toBeNull()
    expect(screen.getByText('Placeholder visuale')).not.toBeNull()
    expect(screen.getByText('Harnex')).not.toBeNull()
  })

  it('renders the real product image and opens lightbox on zoom click', () => {
    render(
      <VentureVisualMedia
        title="ClosedRoom"
        label="ClosedRoom product visual"
        index={0}
        placeholderLabel="Visual placeholder"
        imageSrc="/assets/ventures/closedroom.png"
        zoomLabel="Zoom"
        closeLabel="Close"
      />
    )

    const trigger = screen.getByRole('button', { name: 'ClosedRoom - Zoom' })
    expect(trigger).not.toBeNull()

    const img = screen.getByRole('img', { name: 'ClosedRoom product visual' })
    expect(img.getAttribute('src')).toBe('/assets/ventures/closedroom.png')

    // Click trigger to open zoom modal
    fireEvent.click(trigger)

    const modal = screen.getByRole('dialog', { name: 'ClosedRoom - Zoom' })
    expect(modal).not.toBeNull()

    // Close with close button
    const closeBtn = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeBtn)

    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('closes the zoom modal on Escape key press', () => {
    render(
      <VentureVisualMedia
        title="ClosedRoom"
        label="ClosedRoom product visual"
        index={0}
        placeholderLabel="Visual placeholder"
        imageSrc="/assets/ventures/closedroom.png"
        zoomLabel="Zoom"
        closeLabel="Close"
      />
    )

    const trigger = screen.getByRole('button', { name: 'ClosedRoom - Zoom' })
    fireEvent.click(trigger)
    expect(screen.getByRole('dialog')).not.toBeNull()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
