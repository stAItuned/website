import type { Metadata } from 'next'
import { LearnServiceWorkerRegister } from '@/components/LearnServiceWorkerRegister'
import { PWAInstallBanner, PWAInstallCard, PWAUpdateBanner, PWAInlineLoader } from '@/components/pwa'

/**
 * Metadata for the /learn section
 * 
 * This overrides the root layout manifest to use the learn-specific
 * manifest file, enabling a scoped PWA for the learn section only.
 */
export const metadata: Metadata = {
    manifest: '/learn-manifest.json',
    // Apple-specific PWA settings for learn section
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'stAItuned Learn',
    },
    // Theme color for learn PWA
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
        { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
    ],
}

/**
 * Learn Section Layout
 * 
 * This layout:
 * - Shows instant loading indicator on first load (before JS hydrates)
 * - Overrides the PWA manifest to use learn-manifest.json
 * - Registers the learn-specific service worker (sw-learn.js)
 * - Shows PWA install CTAs for users in browser mode
 * - Provides learn-scoped PWA functionality
 * 
 * Users can install the learn section as a standalone PWA
 * while the rest of the site remains a regular website.
 */
export default function LearnLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {/* Instant loading indicator - appears before JS loads */}
            <PWAInlineLoader />

            {/* Register learn-specific service worker */}
            <LearnServiceWorkerRegister />

            {/* PWA Install Prompts (only visible when not installed) */}
            {/* Smart banner - shows on subsequent visits if not dismissed */}
            <PWAInstallBanner />
            {/* Floating card - shows on first visit with compelling reasons */}
            <PWAInstallCard delay={3000} />
            {/* Update notification - shows when new version is available */}
            <PWAUpdateBanner />

            {children}
        </>
    )
}
