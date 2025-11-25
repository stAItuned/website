const VERSION = 'staituned-v2'
const STATIC_CACHE = `${VERSION}-static`
const RUNTIME_CACHE = `${VERSION}-runtime`
const FALLBACK_URL = '/offline.html'

const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  FALLBACK_URL,
  '/assets/general/logo-text.png',
  '/assets/general/logo-text-dark.png',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.ico',
  '/icon.svg'
]

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
          .filter((name) => name !== STATIC_CACHE && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      )
      await self.clients.claim()
      await sendMessageToClients({
        type: 'SW_VERSION',
        version: VERSION,
      })
    })()
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event

  if (request.method !== 'GET') {
    return
  }

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, true))
    return
  }

  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request))
    return
  }

  if (isApiRequest(url.pathname)) {
    event.respondWith(networkFirst(request))
    return
  }

  event.respondWith(networkFirst(request))
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

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

function isApiRequest(pathname) {
  return pathname.startsWith('/api/')
}

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

async function networkFirst(request, withFallback = false) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(RUNTIME_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await caches.match(request)
    if (cached) return cached
    return withFallback ? getOfflinePage() : createOfflineTextResponse()
  }
}

async function getOfflinePage() {
  const cachedOffline = await caches.match(FALLBACK_URL)
  if (cachedOffline) return cachedOffline
  return createOfflineTextResponse()
}

function createOfflineTextResponse() {
  return new Response('Offline', {
    status: 503,
    statusText: 'Offline',
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}

async function sendMessageToClients(message) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true })
  for (const client of clients) {
    client.postMessage(message)
  }
}
