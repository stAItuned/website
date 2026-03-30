import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PageViewTracker } from '@/components/PageViewTracker'

let mockHasConsentedToAnalytics = false
let mockPathname = '/learn/newbie/test-article'
let mockSearch = ''

const mockPageview = vi.fn()
const mockSendBeacon = vi.fn()
const mockFetch = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useSearchParams: () => ({
    toString: () => mockSearch,
  }),
}))

vi.mock('@/components/SafeNavigation', () => ({
  ClientOnly: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('@/components/cookies/CookieConsentProvider', () => ({
  useCookieConsent: () => ({
    hasConsentedToAnalytics: mockHasConsentedToAnalytics,
  }),
}))

vi.mock('@/lib/gtag', () => ({
  pageview: (...args: unknown[]) => mockPageview(...args),
}))

describe('PageViewTracker', () => {
  beforeEach(() => {
    mockHasConsentedToAnalytics = false
    mockPathname = '/learn/newbie/test-article'
    mockSearch = ''
    mockPageview.mockReset()
    mockSendBeacon.mockReset()
    mockFetch.mockReset()
    process.env.PAGE_VIEW_ALLOWED_HOSTS = 'localhost'

    Object.defineProperty(globalThis, 'navigator', {
      value: {
        sendBeacon: mockSendBeacon,
      },
      writable: true,
      configurable: true,
    })

    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    delete process.env.PAGE_VIEW_ALLOWED_HOSTS
  })

  it('sends first-party page view without consent and skips GA', () => {
    mockSendBeacon.mockReturnValue(true)

    render(<PageViewTracker />)

    expect(mockSendBeacon).toHaveBeenCalledTimes(1)
    expect(mockSendBeacon).toHaveBeenCalledWith('/api/analytics/page-view', expect.any(Blob))
    expect(mockPageview).not.toHaveBeenCalled()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('sends first-party page view and GA pageview when consent is granted', () => {
    mockHasConsentedToAnalytics = true
    mockSearch = 'q=1'
    mockSendBeacon.mockReturnValue(true)

    render(<PageViewTracker />)

    expect(mockSendBeacon).toHaveBeenCalledTimes(1)
    expect(mockPageview).toHaveBeenCalledTimes(1)
    expect(mockPageview).toHaveBeenCalledWith('/learn/newbie/test-article?q=1')
  })

  it('sends first-party page view on other public pages', () => {
    mockHasConsentedToAnalytics = true
    mockPathname = '/career-os'
    mockSendBeacon.mockReturnValue(true)

    render(<PageViewTracker />)

    expect(mockSendBeacon).toHaveBeenCalledTimes(1)
    expect(mockPageview).toHaveBeenCalledTimes(1)
    expect(mockPageview).toHaveBeenCalledWith('/career-os')
  })

  it('still skips excluded pages server-side but sends only one request per pathname client-side', () => {
    mockHasConsentedToAnalytics = true
    mockPathname = '/admin/analytics'
    mockSendBeacon.mockReturnValue(true)

    render(<PageViewTracker />)

    expect(mockSendBeacon).toHaveBeenCalledTimes(1)
    expect(mockPageview).toHaveBeenCalledTimes(1)
    expect(mockPageview).toHaveBeenCalledWith('/admin/analytics')
  })

  it('falls back to fetch keepalive when sendBeacon fails', () => {
    mockSendBeacon.mockReturnValue(false)
    mockFetch.mockResolvedValue({ ok: true })

    render(<PageViewTracker />)

    expect(mockSendBeacon).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/analytics/page-view',
      expect.objectContaining({
        method: 'POST',
        keepalive: true,
        cache: 'no-store',
      }),
    )
  })
})
