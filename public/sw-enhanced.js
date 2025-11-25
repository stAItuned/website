// Enhanced service worker for offline capability and performance
const CACHE_NAME = 'staituned-v1'
const STATIC_CACHE = 'staituned-static-v1'
const DYNAMIC_CACHE = 'staituned-dynamic-v1'

const STATIC_ASSETS = [
  '/',
  '/learn',
  '/meet',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
]

const CACHE_STRATEGIES = {
  // Static assets - Cache first
  static: ['/assets/', '/content/', '/_next/static/'],
  // API data - Network first with cache fallback
  api: ['/api/analytics/', '/api/articles/'],
  // Articles - Stale while revalidate
  articles: ['/learn/'],
  // Images - Cache first with network fallback
  images: ['.webp', '.avif', '.png', '.jpg', '.jpeg', '.svg']
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip external requests
  if (!url.origin.includes('staituned.com') && !url.origin.includes('localhost')) return

  // Strategy selection based on URL patterns
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
  } else if (isApiRequest(url.pathname)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
  } else if (isArticle(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
  } else if (isImage(url.pathname)) {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE))
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
  }
})

// Cache strategies
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached
  
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    return new Response('Offline', { status: 503 })
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await caches.match(request)
    return cached || new Response('Offline', { status: 503 })
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request)
  const responsePromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(cacheName)
      cache.then(c => c.put(request, response.clone()))
    }
    return response
  }).catch(() => cached)
  
  return cached || responsePromise
}

// URL pattern helpers
function isStaticAsset(pathname) {
  return CACHE_STRATEGIES.static.some(pattern => pathname.startsWith(pattern))
}

function isApiRequest(pathname) {
  return CACHE_STRATEGIES.api.some(pattern => pathname.startsWith(pattern))
}

function isArticle(pathname) {
  return CACHE_STRATEGIES.articles.some(pattern => pathname.startsWith(pattern))
}

function isImage(pathname) {
  return CACHE_STRATEGIES.images.some(ext => pathname.endsWith(ext))
}

// Background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics())
  }
})

async function syncAnalytics() {
  // Sync offline analytics data when online
  const analyticsData = await getOfflineAnalytics()
  if (analyticsData.length > 0) {
    try {
      await fetch('/api/analytics/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analyticsData)
      })
      clearOfflineAnalytics()
    } catch (error) {
      console.error('Analytics sync failed:', error)
    }
  }
}

// IndexedDB helpers for offline analytics
async function getOfflineAnalytics() {
  // Implementation for retrieving offline analytics
  return []
}

async function clearOfflineAnalytics() {
  // Implementation for clearing synced analytics
}
