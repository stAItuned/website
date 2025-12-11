/**
 * PWA Inline Loader - Instant Loading Indicator
 * 
 * This component injects a loading indicator that appears IMMEDIATELY
 * in the HTML response, before any JavaScript loads or executes.
 * 
 * It uses inline styles and a script to auto-hide once React hydrates.
 * This solves the "blank white screen" problem on first PWA load.
 * 
 * Key: Uses style.display = 'none' instead of removeChild to avoid
 * React reconciliation conflicts during client-side navigation.
 */
export function PWAInlineLoader() {
    return (
        <div
            id="pwa-loader"
            suppressHydrationWarning
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0f172a',
                color: '#f1f5f9',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                transition: 'opacity 0.4s ease',
                padding: '2rem',
                textAlign: 'center' as const,
            }}
        >
            {/* Spinner */}
            <div style={{
                width: 48,
                height: 48,
                border: '3px solid rgba(59, 130, 246, 0.2)',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'pwa-spin 1s linear infinite',
            }} />

            {/* Title */}
            <div style={{ marginTop: '1.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
                stAItuned Learn
            </div>

            {/* Subtitle */}
            <div style={{ marginTop: '0.5rem', fontSize: '0.9375rem', color: '#3b82f6', fontWeight: 500 }}>
                Setting up your app
            </div>

            {/* Description */}
            <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: '#64748b', maxWidth: 280, lineHeight: 1.5 }}>
                This only takes a moment on your first visit.
            </div>

            {/* Keyframe animation and light mode styles */}
            <style suppressHydrationWarning dangerouslySetInnerHTML={{
                __html: `
                @keyframes pwa-spin { to { transform: rotate(360deg); } }
                @media (prefers-color-scheme: light) { 
                    #pwa-loader { background: #ffffff !important; color: #0f172a !important; } 
                }
            `}} />

            {/* Script to hide loader - uses display:none instead of removeChild */}
            <script suppressHydrationWarning dangerouslySetInnerHTML={{
                __html: `
                (function() {
                    var loader = document.getElementById('pwa-loader');
                    if (!loader) return;
                    
                    // If already loaded before (client-side navigation), hide immediately
                    if (window.__pwaLoaderComplete) {
                        loader.style.display = 'none';
                        return;
                    }
                    
                    function hideLoader() {
                        if (window.__pwaLoaderHiding) return;
                        window.__pwaLoaderHiding = true;
                        window.__pwaLoaderComplete = true;
                        
                        if (loader) {
                            loader.style.opacity = '0';
                            setTimeout(function() {
                                loader.style.display = 'none';
                            }, 400);
                        }
                    }
                    
                    // Hide on DOM ready or load
                    if (document.readyState === 'complete' || document.readyState === 'interactive') {
                        setTimeout(hideLoader, 100);
                    } else {
                        document.addEventListener('DOMContentLoaded', function() { 
                            setTimeout(hideLoader, 100); 
                        });
                        window.addEventListener('load', hideLoader);
                    }
                    
                    // Fallback: hide after 4 seconds max
                    setTimeout(hideLoader, 4000);
                })();
            `}} />
        </div>
    )
}

export default PWAInlineLoader
