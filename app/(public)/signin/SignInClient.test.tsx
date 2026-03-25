import type React from 'react'
import { render, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { AuthContext } from '@/components/auth/AuthContext'
import SignInClient from './SignInClient'

const locationReplaceMock = vi.fn()
const searchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  useSearchParams: () => searchParams,
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt ?? ''} />,
}))

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
}))

vi.mock('lucide-react', () => ({
  ArrowLeft: () => <span>ArrowLeft</span>,
  ShieldCheck: () => <span>ShieldCheck</span>,
  Zap: () => <span>Zap</span>,
  BookOpen: () => <span>BookOpen</span>,
}))

vi.mock('@/lib/i18n', () => ({
  useLearnLocale: () => ({
    t: {
      signIn: {
        title: 'Title',
        subtitle: 'Subtitle',
        benefits: {
          save: 'Save',
          sync: 'Sync',
          contribute: 'Contribute',
        },
        form: {
          welcome: 'Welcome',
          subtitle: 'Subtitle',
          secure: 'Secure',
          googleDisclaimer: 'Disclaimer',
          agreement: 'Agreement',
          terms: 'Terms',
          and: 'and',
          privacy: 'Privacy',
        },
      },
    },
  }),
  LearnLocaleToggle: () => <div>LocaleToggle</div>,
}))

vi.mock('@/components/auth/GoogleSignInButton', () => ({
  default: () => <div>GoogleSignInButton</div>,
}))

describe('SignInClient', () => {
  beforeEach(() => {
    locationReplaceMock.mockReset()
    searchParams.delete('redirect')
    const storageData = new Map<string, string>()
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: {
        getItem: (key: string) => storageData.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storageData.set(key, value)
        },
        removeItem: (key: string) => {
          storageData.delete(key)
        },
        clear: () => {
          storageData.clear()
        },
        key: (index: number) => Array.from(storageData.keys())[index] ?? null,
        get length() {
          return storageData.size
        },
      } satisfies Storage,
    })
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        replace: locationReplaceMock,
      },
    })
  })

  it('redirects authenticated users once the server session is ready', async () => {
    searchParams.set('redirect', '/admin')

    render(
      <AuthContext.Provider
        value={{
          user: { uid: 'admin-user' } as never,
          loading: false,
          sessionReady: true,
          sessionError: null,
        }}
      >
        <SignInClient />
      </AuthContext.Provider>,
    )

    await waitFor(() => {
      expect(locationReplaceMock).toHaveBeenCalledWith('/admin')
    })
  })
})
