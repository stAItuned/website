/**
 * Optimized Service Worker for /learn PWA scope
 * 
 * Performance-focused service worker with:
 * - Stale-while-revalidate for instant page loads
 * - App shell precaching for fast cold starts
 * - Smart caching strategies per resource type
 * - Efficient cache management
 * 
 * @version 2.0.0
 */

// Cache versioning - increment on major changes
const SW_VERSION = 'v2.1.1'
const CACHE_PREFIX = 'staituned-learn'

// Cache names with versioning
const CACHE_NAMES = {
    SHELL: `${CACHE_PREFIX}-shell-${SW_VERSION}`,      // App shell and critical assets
    STATIC: `${CACHE_PREFIX}-static-${SW_VERSION}`,    // Static assets (JS, CSS, fonts)
    ARTICLES: `${CACHE_PREFIX}-articles-${SW_VERSION}`, // Article pages and content
    IMAGES: `${CACHE_PREFIX}-images-${SW_VERSION}`,    // Images (long-lived)
    RUNTIME: `${CACHE_PREFIX}-runtime-${SW_VERSION}`,  // Runtime/API responses
}

// App shell - critical assets for instant startup
// These are cached on install for immediate availability
const APP_SHELL = [
    '/learn',
    '/learn-manifest.json',
    '/pwa-app-shell.html',
    '/icon-192.png',
    '/icon-512.png',
    '/icon-192-maskable.png',
    '/icon-512-maskable.png',
    '/favicon.ico',
    '/assets/general/logo-text.png',
    '/assets/general/logo-text-dark.png',
    '/assets/pwa/screenshot-wide.png',
    '/assets/pwa/screenshot-mobile.png',
]

// Static asset patterns to precache
const STATIC_ASSET_PATTERNS = [
    '/assets/learn/',
]

// Maximum cache sizes
const CACHE_LIMITS = {
    ARTICLES: 100,  // Max cached article pages
    IMAGES: 200,    // Max cached images  
    RUNTIME: 50,    // Max runtime cache entries
}

// ===============================
// LIFECYCLE EVENTS
// ===============================

/**
 * Install event - precache app shell for instant startup
 */
self.addEventListener('install', (event) => {
    console.log('[Learn SW] Installing version:', SW_VERSION)

    event.waitUntil(
        Promise.all([
            // Cache app shell
            caches.open(CACHE_NAMES.SHELL).then((cache) => {
                console.log('[Learn SW] Precaching app shell')
                return cache.addAll(APP_SHELL)
            }),
            // Force immediate activation
            self.skipWaiting()
        ])
    )
})

/**
 * Activate event - cleanup old caches and claim clients
 */
self.addEventListener('activate', (event) => {
    console.log('[Learn SW] Activating version:', SW_VERSION)

    event.waitUntil(
        Promise.all([
            // Clean up old versioned caches
            cleanupOldCaches(),
            // Take control of all clients immediately
            self.clients.claim(),
            // Notify clients of update
            notifyClients({
                type: 'SW_ACTIVATED',
                version: SW_VERSION,
                scope: 'learn'
            })
        ])
    )
})

/**
 * Fetch event - smart routing based on request type
 */
self.addEventListener('fetch', (event) => {
    const { request } = event
    const url = new URL(request.url)

    // Skip non-GET requests
    if (request.method !== 'GET') return

    // Skip cross-origin requests
    if (url.origin !== self.location.origin) return

    // Route based on request type
    const strategy = selectStrategy(request, url)
    if (strategy) {
        event.respondWith(strategy)
    }
})

/**
 * Message event - handle client communications
 */
self.addEventListener('message', (event) => {
    const { type, ...data } = event.data || {}

    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting()
            break

        case 'CACHE_ARTICLE':
            if (data.url && isLearnUrl(data.url)) {
                cacheArticleManually(data.url)
            }
            break

        case 'CLEAR_ARTICLES_CACHE':
            caches.delete(CACHE_NAMES.ARTICLES)
            break

        case 'GET_CACHE_STATUS':
            event.ports[0]?.postMessage({
                version: SW_VERSION,
                caches: Object.keys(CACHE_NAMES)
            })
            break
    }
})

// ===============================
// ROUTING & STRATEGY SELECTION
// ===============================

/**
 * Select appropriate caching strategy based on request
 */
function selectStrategy(request, url) {
    const pathname = url.pathname

    // Navigation requests (page loads) - STALE WHILE REVALIDATE for instant loads
    if (request.mode === 'navigate') {
        if (isLearnUrl(pathname)) {
            // For index-like pages we prefer fresh content when online (new articles, nav updates),
            // while still keeping an offline fallback via cache.
            if (pathname === '/learn' || pathname === '/learn/articles') {
                return networkFirst(request, CACHE_NAMES.ARTICLES)
            }

            return staleWhileRevalidate(request, CACHE_NAMES.ARTICLES)
        }
        // Non-learn navigation - let browser handle
        return null
    }

    // Static assets - CACHE FIRST (bundle files, fonts)
    if (isStaticAsset(pathname) || isNextStaticAsset(pathname)) {
        return cacheFirst(request, CACHE_NAMES.STATIC)
    }

    // Images - CACHE FIRST with fallback
    if (isImage(request)) {
        return cacheFirst(request, CACHE_NAMES.IMAGES)
    }

    // Learn content assets
    if (pathname.startsWith('/content/articles/')) {
        return cacheFirst(request, CACHE_NAMES.ARTICLES)
    }

    // API requests - NETWORK FIRST with cache fallback
    if (isApiRequest(pathname)) {
        return networkFirst(request, CACHE_NAMES.RUNTIME)
    }

    // Default - network with cache fallback
    return networkFirst(request, CACHE_NAMES.RUNTIME)
}

// ===============================
// CACHING STRATEGIES
// ===============================

/**
 * Stale-While-Revalidate - Return cached immediately, update in background
 * Best for: Navigation, content that changes but stale is acceptable
 */
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)

    // Start network request in background
    const networkPromise = fetch(request)
        .then(async (response) => {
            if (response.ok) {
                // Clone before caching
                const responseToCache = response.clone()
                await cache.put(request, responseToCache)
                await trimCache(cacheName, CACHE_LIMITS.ARTICLES)
            }
            return response
        })
        .catch((error) => {
            console.log('[Learn SW] Network failed:', error.message)
            return null
        })

    // Return cached response immediately if available
    if (cachedResponse) {
        // Revalidate in background (don't await)
        networkPromise.then((response) => {
            if (response) {
                // Optionally notify clients of update
                notifyClients({
                    type: 'CONTENT_UPDATED',
                    url: request.url
                })
            }
        })
        return cachedResponse
    }

    // No cache - wait for network
    const networkResponse = await networkPromise
    if (networkResponse) {
        return networkResponse
    }

    // Both failed - return offline page
    return getOfflinePage()
}

/**
 * Cache-First - Check cache, fallback to network
 * Best for: Static assets, images, bundled files
 */
async function cacheFirst(request, cacheName) {
    const cachedResponse = await caches.match(request)

    if (cachedResponse) {
        return cachedResponse
    }

    try {
        const response = await fetch(request)

        if (response.ok) {
            const cache = await caches.open(cacheName)
            cache.put(request, response.clone())

            // Trim cache if needed
            if (cacheName === CACHE_NAMES.IMAGES) {
                await trimCache(cacheName, CACHE_LIMITS.IMAGES)
            }
        }

        return response
    } catch (error) {
        // Return placeholder for images
        if (isImage(request)) {
            return createPlaceholderImage()
        }
        return createOfflineResponse()
    }
}

/**
 * Network-First - Try network, fallback to cache
 * Best for: API requests, dynamic content
 */
async function networkFirst(request, cacheName) {
    try {
        const response = await fetch(request)

        if (response.ok) {
            const cache = await caches.open(cacheName)
            cache.put(request, response.clone())
            await trimCache(cacheName, CACHE_LIMITS.RUNTIME)
        }

        return response
    } catch (error) {
        const cachedResponse = await caches.match(request)
        return cachedResponse || createOfflineResponse()
    }
}

// ===============================
// HELPER FUNCTIONS
// ===============================

/**
 * Check if URL is within /learn scope
 */
function isLearnUrl(pathname) {
    return pathname === '/learn' || pathname.startsWith('/learn/')
}

/**
 * Check if request is for a static asset
 */
function isStaticAsset(pathname) {
    return (
        pathname.startsWith('/assets/') ||
        pathname.endsWith('.css') ||
        pathname.endsWith('.js') ||
        pathname.endsWith('.woff2') ||
        pathname.endsWith('.woff')
    )
}

/**
 * Check if request is for Next.js static assets
 */
function isNextStaticAsset(pathname) {
    return pathname.startsWith('/_next/static/')
}

/**
 * Check if request is for an image
 */
function isImage(request) {
    const pathname = new URL(request.url).pathname
    return (
        request.destination === 'image' ||
        /\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i.test(pathname)
    )
}

/**
 * Check if request is for an API endpoint
 */
function isApiRequest(pathname) {
    return pathname.startsWith('/api/')
}

/**
 * Manually cache an article for offline reading
 */
async function cacheArticleManually(url) {
    try {
        const response = await fetch(url)
        if (response.ok) {
            const cache = await caches.open(CACHE_NAMES.ARTICLES)
            await cache.put(url, response)
            await trimCache(CACHE_NAMES.ARTICLES, CACHE_LIMITS.ARTICLES)
            console.log('[Learn SW] Article cached:', url)
        }
    } catch (error) {
        console.error('[Learn SW] Failed to cache article:', url, error)
    }
}

/**
 * Trim cache to stay under size limit (LRU-like)
 */
async function trimCache(cacheName, maxItems) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()

    if (keys.length > maxItems) {
        // Delete oldest entries (first in cache)
        const overflow = keys.length - maxItems
        const toDelete = keys.slice(0, overflow)
        await Promise.all(toDelete.map((key) => cache.delete(key)))
    }
}

/**
 * Clean up old versioned caches on activation
 */
async function cleanupOldCaches() {
    const cacheNames = await caches.keys()
    const validCaches = Object.values(CACHE_NAMES)

    const toDelete = cacheNames.filter((name) =>
        name.startsWith(CACHE_PREFIX) && !validCaches.includes(name)
    )

    await Promise.all(toDelete.map((name) => {
        console.log('[Learn SW] Deleting old cache:', name)
        return caches.delete(name)
    }))
}

/**
 * Notify all clients of a message
 */
async function notifyClients(message) {
    const clients = await self.clients.matchAll({ includeUncontrolled: true })
    clients.forEach((client) => client.postMessage(message))
}

// ===============================
// FALLBACK RESPONSES
// ===============================

/**
 * Get cached offline page or generate inline fallback
 */
async function getOfflinePage() {
    // Try app shell first
    const shellResponse = await caches.match('/pwa-app-shell.html')
    if (shellResponse) return shellResponse

    // Generate inline offline page
    return new Response(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Offline - stAItuned Learn</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: system-ui, -apple-system, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #f1f5f9;
            text-align: center;
            padding: 2rem;
        }
        .container { max-width: 400px; }
        .icon { font-size: 4rem; margin-bottom: 1.5rem; }
        h1 { color: #3b82f6; margin-bottom: 0.75rem; font-size: 1.75rem; }
        p { color: #94a3b8; line-height: 1.6; margin-bottom: 1rem; }
        .btn {
            display: inline-block;
            margin-top: 1rem;
            padding: 0.875rem 2rem;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 0.625rem;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s;
        }
        .btn:hover { background: #2563eb; }
        .btn:active { transform: scale(0.98); }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">📚</div>
        <h1>You're Offline</h1>
        <p>Can't load this page right now. Check your connection and try again.</p>
        <button class="btn" onclick="location.reload()">Retry</button>
    </div>
</body>
</html>
    `, {
        status: 503,
        statusText: 'Offline',
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-store'
        }
    })
}

/**
 * Create simple offline text response
 */
function createOfflineResponse() {
    return new Response('Offline', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
    })
}

/**
 * Create placeholder for missing images
 */
function createPlaceholderImage() {
    // 1x1 transparent PNG
    const data = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    return new Response(
        Uint8Array.from(atob(data), (c) => c.charCodeAt(0)),
        {
            status: 200,
            headers: { 'Content-Type': 'image/png' }
        }
    )
}
