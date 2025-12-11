'use client'

import { useEffect, useState } from 'react'

/**
 * PWA First Load Indicator
 * 
 * This component shows a loading screen on the first visit to the PWA.
 * It renders with inline styles so it appears immediately before React hydrates.
 * After hydration completes, it fades out.
 * 
 * This solves the "blank screen" problem on first PWA load.
 */
export function PWAFirstLoadIndicator() {
    const [isHydrated, setIsHydrated] = useState(false)
    const [shouldHide, setShouldHide] = useState(false)

    useEffect(() => {
        // Mark as hydrated after a short delay to allow content to render
        const timer = setTimeout(() => {
            setIsHydrated(true)
            // Hide completely after fade animation
            setTimeout(() => setShouldHide(true), 500)
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    // Don't render at all after hiding
    if (shouldHide) return null

    return (
        <div
            id="pwa-first-load"
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--loader-bg, #0f172a)',
                color: 'var(--loader-text, #f1f5f9)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                transition: 'opacity 0.4s ease-out, visibility 0.4s ease-out',
                opacity: isHydrated ? 0 : 1,
                visibility: isHydrated ? 'hidden' : 'visible',
                pointerEvents: isHydrated ? 'none' : 'auto',
            }}
        >
            {/* Inline styles for the loader - works before CSS loads */}
            <style dangerouslySetInnerHTML={{
                __html: `
                :root {
                    --loader-bg: #0f172a;
                    --loader-text: #f1f5f9;
                    --loader-accent: #3b82f6;
                    --loader-muted: #64748b;
                }
                @media (prefers-color-scheme: light) {
                    :root {
                        --loader-bg: #ffffff;
                        --loader-text: #0f172a;
                    }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                @keyframes progress {
                    0% { width: 0%; }
                    50% { width: 70%; }
                    100% { width: 95%; }
                }
            `}} />

            {/* Loading Content */}
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                {/* Spinner */}
                <div style={{
                    width: '48px',
                    height: '48px',
                    margin: '0 auto 1.5rem',
                    border: '3px solid rgba(59, 130, 246, 0.2)',
                    borderTopColor: 'var(--loader-accent)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                }} />

                {/* Title */}
                <h1 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    color: 'var(--loader-text)',
                }}>
                    stAItuned Learn
                </h1>

                {/* Subtitle */}
                <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--loader-muted)',
                    marginBottom: '1.5rem',
                    animation: 'pulse 2s ease-in-out infinite',
                }}>
                    Loading your content...
                </p>

                {/* Progress Bar */}
                <div style={{
                    width: '200px',
                    height: '4px',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    margin: '0 auto',
                }}>
                    <div style={{
                        height: '100%',
                        backgroundColor: 'var(--loader-accent)',
                        borderRadius: '2px',
                        animation: 'progress 2s ease-out forwards',
                    }} />
                </div>
            </div>
        </div>
    )
}

export default PWAFirstLoadIndicator
