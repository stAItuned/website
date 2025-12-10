/**
 * Service Worker for /learn PWA scope
 * 
 * This service worker is specifically designed for the learn section,
 * caching only /learn/* pages and their resources for offline reading.
 */

const VERSION = 'staituned-learn-v1'
const STATIC_CACHE = `${VERSION}-static`
const ARTICLES_CACHE = `${VERSION}-articles`
const RUNTIME_CACHE = `${VERSION}-runtime`
const FALLBACK_URL = '/offline.html'

// Learn-specific precache URLs
const PRECACHE_URLS = [
    '/learn',
    '/learn-manifest.json',
    FALLBACK_URL,
    '/assets/general/logo-text.png',
    '/assets/general/logo-text-dark.png',
    '/assets/learn/newbie-card.jpg',
    '/assets/learn/midway-card.png',
    '/assets/learn/expert-card.png',
    '/icon-192.png',
    '/icon-512.png',
    '/favicon.ico',
    '/icon.svg'
]

// Maximum number of articles to cache
const MAX_CACHED_ARTICLES = 50

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const cacheNames = await caches.keys()
            await Promise.all(
                cacheNames
                    .filter((name) =>
                        name.startsWith('staituned-learn-') &&
                        name !== STATIC_CACHE &&
                        name !== ARTICLES_CACHE &&
                        name !== RUNTIME_CACHE
                    )
                    .map((name) => caches.delete(name))
            )
            await self.clients.claim()
            await sendMessageToClients({
                type: 'SW_VERSION',
                version: VERSION,
                scope: 'learn'
            })
        })()
    )
})

self.addEventListener('fetch', (event) => {
    const { request } = event
    const url = new URL(request.url)

    // Only handle GET requests
    if (request.method !== 'GET') {
        return
    }

    // Only handle same-origin requests
    if (url.origin !== self.location.origin) {
        return
    }

    // Handle learn section navigation (article pages)
    if (request.mode === 'navigate' && isLearnUrl(url.pathname)) {
        event.respondWith(networkFirstWithArticleCache(request))
        return
    }

    // Handle static assets used by learn section
    if (isStaticAsset(request)) {
        event.respondWith(cacheFirst(request))
        return
    }

    // Handle API requests for learn content
    if (isLearnApiRequest(url.pathname)) {
        event.respondWith(networkFirst(request))
        return
    }

    // For non-learn URLs in navigation, let them through (will open in browser)
    if (request.mode === 'navigate' && !isLearnUrl(url.pathname)) {
        return
    }

    // Default: network first for other requests
    event.respondWith(networkFirst(request))
})

self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }

    // Allow manual article caching for offline reading
    if (event.data?.type === 'CACHE_ARTICLE') {
        const articleUrl = event.data.url
        if (articleUrl && isLearnUrl(articleUrl)) {
            cacheArticle(articleUrl)
        }
    }

    // Clear article cache
    if (event.data?.type === 'CLEAR_ARTICLES_CACHE') {
        caches.delete(ARTICLES_CACHE)
    }
})

/**
 * Check if URL is within the /learn scope
 */
function isLearnUrl(pathname) {
    return pathname === '/learn' || pathname.startsWith('/learn/')
}

/**
 * Check if request is for a static asset
 */
function isStaticAsset(request) {
    const pathname = new URL(request.url).pathname
    return (
        pathname.startsWith('/_next/static/') ||
        pathname.startsWith('/assets/') ||
        pathname.startsWith('/content/') ||
        request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'image' ||
        request.destination === 'font'
    )
}

/**
 * Check if request is for learn-related API
 */
function isLearnApiRequest(pathname) {
    return (
        pathname.startsWith('/api/articles') ||
        pathname.startsWith('/api/learn')
    )
}

/**
 * Cache-first strategy for static assets
 */
async function cacheFirst(request) {
    const cached = await caches.match(request)
    if (cached) return cached

    try {
        const response = await fetch(request)
        if (response.ok) {
            const cache = await caches.open(RUNTIME_CACHE)
            cache.put(request, response.clone())
        }
        return response
    } catch (error) {
        return cached || createOfflineTextResponse()
    }
}

/**
 * Network-first strategy with fallback to cache
 */
async function networkFirst(request) {
    try {
        const response = await fetch(request)
        if (response.ok) {
            const cache = await caches.open(RUNTIME_CACHE)
            cache.put(request, response.clone())
        }
        return response
    } catch (error) {
        const cached = await caches.match(request)
        return cached || createOfflineTextResponse()
    }
}

/**
 * Network-first strategy with special article caching
 */
async function networkFirstWithArticleCache(request) {
    try {
        const response = await fetch(request)
        if (response.ok) {
            // Cache articles separately with LRU-like behavior
            const cache = await caches.open(ARTICLES_CACHE)
            await cache.put(request, response.clone())
            await trimArticleCache()
        }
        return response
    } catch (error) {
        // Try to find in article cache first
        const cached = await caches.match(request)
        if (cached) return cached

        // Fallback to offline page
        return getOfflinePage()
    }
}

/**
 * Cache a specific article for offline reading
 */
async function cacheArticle(url) {
    try {
        const response = await fetch(url)
        if (response.ok) {
            const cache = await caches.open(ARTICLES_CACHE)
            await cache.put(url, response)
            await trimArticleCache()
            console.log(`[Learn SW] Cached article: ${url}`)
        }
    } catch (error) {
        console.error(`[Learn SW] Failed to cache article: ${url}`, error)
    }
}

/**
 * Trim article cache to stay under MAX_CACHED_ARTICLES
 */
async function trimArticleCache() {
    const cache = await caches.open(ARTICLES_CACHE)
    const keys = await cache.keys()

    if (keys.length > MAX_CACHED_ARTICLES) {
        // Remove oldest entries (first in, first out)
        const toDelete = keys.slice(0, keys.length - MAX_CACHED_ARTICLES)
        await Promise.all(toDelete.map(key => cache.delete(key)))
    }
}

/**
 * Get offline fallback page
 */
async function getOfflinePage() {
    const cachedOffline = await caches.match(FALLBACK_URL)
    if (cachedOffline) return cachedOffline

    return new Response(`
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - stAItuned Learn</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #f1f5f9;
          text-align: center;
          padding: 1rem;
        }
        h1 { color: #3b82f6; margin-bottom: 0.5rem; }
        p { color: #94a3b8; max-width: 400px; }
        .icon { font-size: 4rem; margin-bottom: 1rem; }
        .retry-btn {
          margin-top: 1.5rem;
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          cursor: pointer;
        }
        .retry-btn:hover { background: #2563eb; }
      </style>
    </head>
    <body>
      <div class="icon">📚</div>
      <h1>Sei offline</h1>
      <p>Non riesco a caricare questa pagina. Controlla la tua connessione e riprova.</p>
      <button class="retry-btn" onclick="location.reload()">Riprova</button>
    </body>
    </html>
  `, {
        status: 503,
        statusText: 'Offline',
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
}

/**
 * Create simple offline text response
 */
function createOfflineTextResponse() {
    return new Response('Offline', {
        status: 503,
        statusText: 'Offline',
        headers: { 'Content-Type': 'text/plain' }
    })
}

/**
 * Send message to all clients
 */
async function sendMessageToClients(message) {
    const clients = await self.clients.matchAll({ includeUncontrolled: true })
    for (const client of clients) {
        client.postMessage(message)
    }
}
