import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { User } from 'firebase/auth'
import type React from 'react'
import { UserMenuPanel } from './UserMenuPanel'

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string
    children: React.ReactNode
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

function createUser(): User {
  return {
    email: 'writer@example.com',
  } as User
}

describe('UserMenuPanel', () => {
  it('shows /become-writer CTA for non-writer users', () => {
    render(
      <UserMenuPanel
        user={createUser()}
        isWriter={false}
        isAdmin={false}
        profileDisplayName="Reader User"
        menuId="user-menu"
        onClose={() => undefined}
        onSignOut={() => undefined}
      />
    )

    const link = screen.getByRole('menuitem', { name: /become a writer/i })
    expect(link.getAttribute('href')).toBe('/become-writer')
  })

  it('shows draft shortcut for writers', () => {
    render(
      <UserMenuPanel
        user={createUser()}
        isWriter
        isAdmin={false}
        profileDisplayName="Writer User"
        menuId="user-menu"
        onClose={() => undefined}
        onSignOut={() => undefined}
      />
    )

    const link = screen.getByRole('menuitem', { name: /start a new draft/i })
    expect(link.getAttribute('href')).toBe('/contribute/draft')
  })
})
