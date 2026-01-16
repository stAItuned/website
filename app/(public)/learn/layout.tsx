import type { Metadata } from 'next'
import { LearnServiceWorkerRegister } from '@/components/LearnServiceWorkerRegister'
import {
    PWAInstallBanner,
    PWAInstallCard,
    PWAUpdateBanner,
    PushNotificationPrompt,
    PWADynamicShortcuts,
    PWABadgeTracker
} from '@/components/pwa'
import { RoleFitAuditCTA } from '@/components/ui/RoleFitAuditCTA'

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
 * - Overrides the PWA manifest to use learn-manifest.json
 * - Registers the learn-specific service worker (sw-learn.js)
 * - Shows PWA install CTAs for users in browser mode
 * - Shows push notification prompt for PWA users
 * - Manages dynamic shortcuts and app badge
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
            {/* Register learn-specific service worker */}
            <LearnServiceWorkerRegister />

            {/* PWA Install Prompts (only visible when not installed) */}
            {/* Smart banner - shows on subsequent visits if not dismissed */}
            <PWAInstallBanner />
            {/* Floating card - shows on first visit with compelling reasons */}
            <PWAInstallCard delay={3000} />
            {/* Update notification - shows when new version is available */}
            <PWAUpdateBanner />
            {/* Push notification prompt - shows in PWA mode */}
            <PushNotificationPrompt />

            {/* P2 PWA Enhancements */}
            {/* Dynamic shortcuts - updates "Continue reading" shortcut */}
            <PWADynamicShortcuts />
            {/* Badge tracker - shows badge when new content available */}
            <PWABadgeTracker />

            {children}
            <RoleFitAuditCTA variant="sticky" />
        </>
    )
}
