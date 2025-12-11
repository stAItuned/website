/**
 * PWA Inline Loader - Instant Loading Indicator
 * 
 * This component injects a loading indicator that appears IMMEDIATELY
 * in the HTML response, before any JavaScript loads or executes.
 * 
 * It uses inline styles and a script to auto-hide once React hydrates.
 * This solves the "blank white screen" problem on first PWA load.
 */
export function PWAInlineLoader() {
    return (
        <>
            {/* 
              Inline loader HTML - This renders in the initial HTML response
              and shows immediately while JS is still loading
            */}
            <div
                id="pwa-loader"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: `
                        <style>
                            #pwa-loader {
                                position: fixed;
                                inset: 0;
                                z-index: 99999;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                background: #0f172a;
                                color: #f1f5f9;
                                font-family: system-ui, -apple-system, sans-serif;
                                transition: opacity 0.4s ease, visibility 0.4s ease;
                                padding: 2rem;
                                text-align: center;
                            }
                            @media (prefers-color-scheme: light) {
                                #pwa-loader { background: #ffffff; color: #0f172a; }
                            }
                            #pwa-loader.hidden {
                                opacity: 0;
                                visibility: hidden;
                                pointer-events: none;
                            }
                            #pwa-loader-spinner {
                                width: 48px;
                                height: 48px;
                                border: 3px solid rgba(59, 130, 246, 0.2);
                                border-top-color: #3b82f6;
                                border-radius: 50%;
                                animation: pwa-spin 1s linear infinite;
                            }
                            @keyframes pwa-spin {
                                to { transform: rotate(360deg); }
                            }
                            #pwa-loader-title {
                                margin-top: 1.5rem;
                                font-size: 1.25rem;
                                font-weight: 700;
                            }
                            #pwa-loader-subtitle {
                                margin-top: 0.5rem;
                                font-size: 0.9375rem;
                                color: #3b82f6;
                                font-weight: 500;
                            }
                            #pwa-loader-text {
                                margin-top: 0.5rem;
                                font-size: 0.8125rem;
                                color: #64748b;
                                max-width: 280px;
                                line-height: 1.5;
                            }
                            #pwa-loader-steps {
                                margin-top: 1.5rem;
                                display: flex;
                                flex-direction: column;
                                gap: 0.5rem;
                                text-align: left;
                                font-size: 0.75rem;
                                color: #64748b;
                            }
                            .pwa-step {
                                display: flex;
                                align-items: center;
                                gap: 0.5rem;
                                opacity: 0.5;
                                transition: opacity 0.3s ease;
                            }
                            .pwa-step.active {
                                opacity: 1;
                                color: #3b82f6;
                            }
                            .pwa-step.done {
                                opacity: 1;
                                color: #10b981;
                            }
                            .pwa-check {
                                width: 16px;
                                height: 16px;
                                border-radius: 50%;
                                border: 2px solid currentColor;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                flex-shrink: 0;
                            }
                            .pwa-step.done .pwa-check::after {
                                content: '✓';
                                font-size: 10px;
                            }
                            .pwa-step.active .pwa-check {
                                border-color: #3b82f6;
                                animation: pwa-pulse 1s ease-in-out infinite;
                            }
                            @keyframes pwa-pulse {
                                0%, 100% { opacity: 1; }
                                50% { opacity: 0.5; }
                            }
                            #pwa-loader-progress {
                                margin-top: 1.5rem;
                                width: 200px;
                                height: 4px;
                                background: rgba(59, 130, 246, 0.2);
                                border-radius: 2px;
                                overflow: hidden;
                            }
                            #pwa-loader-bar {
                                height: 100%;
                                background: #3b82f6;
                                border-radius: 2px;
                                width: 0%;
                                transition: width 0.3s ease;
                            }
                            #pwa-loader-tip {
                                margin-top: 2rem;
                                padding: 0.75rem 1rem;
                                background: rgba(59, 130, 246, 0.1);
                                border-radius: 0.5rem;
                                font-size: 0.75rem;
                                color: #64748b;
                                max-width: 280px;
                            }
                            #pwa-loader-tip strong {
                                color: #3b82f6;
                            }
                        </style>
                        <div id="pwa-loader-spinner"></div>
                        <div id="pwa-loader-title">stAItuned Learn</div>
                        <div id="pwa-loader-subtitle">Setting up your app</div>
                        <div id="pwa-loader-text">
                            This only takes a moment on your first visit.
                        </div>
                        <div id="pwa-loader-steps">
                            <div class="pwa-step active" id="step-1">
                                <span class="pwa-check"></span>
                                <span>Downloading app resources...</span>
                            </div>
                            <div class="pwa-step" id="step-2">
                                <span class="pwa-check"></span>
                                <span>Preparing offline capabilities...</span>
                            </div>
                            <div class="pwa-step" id="step-3">
                                <span class="pwa-check"></span>
                                <span>Starting your experience...</span>
                            </div>
                        </div>
                        <div id="pwa-loader-progress">
                            <div id="pwa-loader-bar"></div>
                        </div>
                        <div id="pwa-loader-tip">
                            <strong>💡 Tip:</strong> After setup, the app will load instantly every time!
                        </div>
                    `
                }}
            />

            {/* Script to animate steps and hide the loader once React hydrates */}
            <script
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: `
                        (function() {
                            var bar = document.getElementById('pwa-loader-bar');
                            var step1 = document.getElementById('step-1');
                            var step2 = document.getElementById('step-2');
                            var step3 = document.getElementById('step-3');
                            var subtitle = document.getElementById('pwa-loader-subtitle');
                            var text = document.getElementById('pwa-loader-text');
                            
                            // Animate progress bar
                            var progress = 0;
                            var progressInterval = setInterval(function() {
                                progress += 2;
                                if (bar) bar.style.width = Math.min(progress, 90) + '%';
                                
                                // Update steps based on progress
                                if (progress >= 30 && step1 && step2) {
                                    step1.classList.remove('active');
                                    step1.classList.add('done');
                                    step2.classList.add('active');
                                    if (subtitle) subtitle.textContent = 'Preparing your content';
                                }
                                if (progress >= 60 && step2 && step3) {
                                    step2.classList.remove('active');
                                    step2.classList.add('done');
                                    step3.classList.add('active');
                                    if (subtitle) subtitle.textContent = 'Almost ready!';
                                }
                                if (progress >= 90) {
                                    clearInterval(progressInterval);
                                }
                            }, 100);
                            
                            // Hide loader when DOM is ready
                            var hideLoader = function() {
                                clearInterval(progressInterval);
                                
                                // Complete the animation
                                if (bar) bar.style.width = '100%';
                                if (step3) {
                                    step3.classList.remove('active');
                                    step3.classList.add('done');
                                }
                                if (subtitle) subtitle.textContent = 'Ready!';
                                if (text) text.textContent = 'Enjoy your reading experience.';
                                
                                var loader = document.getElementById('pwa-loader');
                                if (loader) {
                                    setTimeout(function() {
                                        loader.classList.add('hidden');
                                        // Remove from DOM after fade
                                        setTimeout(function() {
                                            if (loader.parentNode) {
                                                loader.parentNode.removeChild(loader);
                                            }
                                        }, 500);
                                    }, 400);
                                }
                            };
                            
                            // Multiple triggers to ensure loader hides
                            if (document.readyState === 'complete') {
                                hideLoader();
                            } else {
                                window.addEventListener('load', hideLoader);
                            }
                            
                            // Fallback: hide after max 8 seconds
                            setTimeout(hideLoader, 8000);
                        })();
                    `
                }}
            />
        </>
    )
}

export default PWAInlineLoader
