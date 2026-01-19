/**
 * Root Service Worker
 * 
 * Acts as a placeholder to prevent 404s and handle root-level PWA installation if needed.
 * The main application logic for PWA is handled in /sw-learn.js for the /learn scope.
 */

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    self.clients.claim();
});
