import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AdminPushNotificationsCard } from './AdminPushNotificationsCard'

const useAuthMock = vi.fn()

vi.mock('@/components/auth/AuthContext', () => ({
  useAuth: () => useAuthMock(),
}))

describe('AdminPushNotificationsCard', () => {
  beforeEach(() => {
    const storageData = new Map<string, string>()
    const localStorageMock: Storage = {
      get length() {
        return storageData.size
      },
      clear: () => {
        storageData.clear()
      },
      getItem: (key: string) => storageData.get(key) ?? null,
      key: (index: number) => Array.from(storageData.keys())[index] ?? null,
      removeItem: (key: string) => {
        storageData.delete(key)
      },
      setItem: (key: string, value: string) => {
        storageData.set(key, value)
      },
    }

    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: localStorageMock,
    })
  })

  it('renders for admin allowlist users', () => {
    useAuthMock.mockReturnValue({
      user: {
        email: 'daniele@staituned.com',
      },
    })

    render(<AdminPushNotificationsCard />)

    expect(screen.queryByText('Notifiche Operative Admin (PWA)')).not.toBeNull()
  })

  it('is hidden for non-admin users', () => {
    useAuthMock.mockReturnValue({
      user: {
        email: 'user@example.com',
      },
    })

    const { container } = render(<AdminPushNotificationsCard />)
    expect(container.firstChild).toBeNull()
  })
})
