// Firebase Cloud Messaging Service Worker
// This handles background push notifications

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Firebase config (must match your app config)
firebase.initializeApp({
    apiKey: "AIzaSyD8ZBfLzHE2XVnwd6HUj1N9AjY8CKXAog8",
    authDomain: "staituned-production-163f4.firebaseapp.com",
    projectId: "staituned-production-163f4",
    storageBucket: "staituned-production-163f4.firebasestorage.app",
    messagingSenderId: "1070464718249",
    appId: "1:1070464718249:web:f7c6e040a3f029c1d2a0b8"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[FCM SW] Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'stAItuned Learn';
    const notificationOptions = {
        body: payload.notification?.body || 'New content available!',
        icon: 'https://staituned.com/icon-192.png',
        badge: 'https://staituned.com/icon-192.png',
        tag: payload.data?.tag || 'staituned-notification',
        data: {
            url: payload.data?.url || '/learn',
            articleSlug: payload.data?.articleSlug || null
        },
        // Action buttons
        actions: [
            {
                action: 'open',
                title: 'Read Now'
            },
            {
                action: 'dismiss',
                title: 'Later'
            }
        ],
        // Vibration pattern for mobile
        vibrate: [100, 50, 100],
        // Keep notification until user interacts
        requireInteraction: false
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[FCM SW] Notification clicked:', event);

    event.notification.close();

    if (event.action === 'dismiss') {
        return;
    }

    // Get the URL from notification data
    const urlToOpen = event.notification.data?.url || '/learn';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                // Check if there's already an open window
                for (const client of windowClients) {
                    if (client.url.includes('/learn') && 'focus' in client) {
                        client.focus();
                        if (urlToOpen !== '/learn') {
                            client.navigate(urlToOpen);
                        }
                        return;
                    }
                }
                // If no window is open, open a new one
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});

console.log('[FCM SW] Firebase Messaging service worker loaded');
