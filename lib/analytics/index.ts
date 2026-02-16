/**
 * Analytics Module
 * 
 * Centralized analytics tracking for the stAItuned website.
 * Re-exports all tracking functions for easy importing.
 */

// Main tracking function
export {
    trackEvent,
    default
} from './trackEvent'

// All event types
export type {
    EventCategory,
    PWAEvent,
    NotificationEvent,
    ArticleEvent,
    QualifiedViewEvent,
    QualifiedViewReason,
    UserJourneyEvent,
    AnalyticsEventName,
    AnalyticsEventParams,
} from './trackEvent'

// PWA tracking functions
export {
    trackPWAInstallPromptShown,
    trackPWAInstallAccepted,
    trackPWAInstallDismissed,
    trackPWAAppInstalled,
    trackPWAStandaloneSession,
    trackOfflinePageView,
    trackServiceWorkerUpdated,
} from './trackEvent'

// Notification tracking functions
export {
    trackPushPermissionRequested,
    trackPushPermissionGranted,
    trackPushPermissionDenied,
    trackPushNotificationClicked,
} from './trackEvent'

// Article engagement tracking functions
export {
    trackArticleScrollDepth,
    trackArticleReadComplete,
    trackArticleTimeOnPage,
    trackQualifiedView,
    trackArticleShare,
    trackArticleCopyCode,
    trackArticleCopyLink,
    trackBookmarkAdded,
    trackBookmarkRemoved,
} from './trackEvent'

// User journey tracking functions
export {
    trackTargetLevelSelected,
    trackSearchPerformed,
    trackSearchResultClicked,
    trackNewsletterSubscribe,
    trackNewsletterSubscribeSuccess,
    trackNewsletterSubscribeError,
    trackLikeAdded,
    trackLikeRemoved,
} from './trackEvent'
