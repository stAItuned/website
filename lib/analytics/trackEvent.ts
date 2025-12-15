'use client'

/**
 * Centralized Analytics Event Tracking
 * 
 * This module provides a unified interface for tracking user engagement events
 * across the website, including PWA, article engagement, and user journey events.
 */

import { event as gtagEvent } from '@/lib/gtag'

// ============================================================================
// Event Categories
// ============================================================================

export type EventCategory =
    | 'pwa'              // PWA-related events
    | 'article'          // Article engagement events
    | 'engagement'       // General engagement events
    | 'user_journey'     // User journey/funnel events
    | 'offline'          // Offline feature events
    | 'notifications'    // Push notification events
    | 'navigation'       // Navigation events
    | 'conversion'       // Conversion events

// ============================================================================
// Event Types
// ============================================================================

// PWA Events
export type PWAEvent =
    | 'pwa_install_prompt_shown'
    | 'pwa_install_accepted'
    | 'pwa_install_dismissed'
    | 'pwa_app_installed'
    | 'pwa_standalone_session'
    | 'pwa_offline_page_view'
    | 'pwa_article_saved_offline'
    | 'pwa_service_worker_updated'

// Notification Events  
export type NotificationEvent =
    | 'push_permission_requested'
    | 'push_permission_granted'
    | 'push_permission_denied'
    | 'push_notification_clicked'
    | 'push_notification_dismissed'

// Article Engagement Events
export type ArticleEvent =
    | 'article_scroll_25'
    | 'article_scroll_50'
    | 'article_scroll_75'
    | 'article_scroll_100'
    | 'article_read_complete'
    | 'article_time_on_page'
    | 'article_share'
    | 'article_copy_code'
    | 'article_copy_link'
    | 'article_bookmark_added'
    | 'article_bookmark_removed'

// User Journey Events
export type UserJourneyEvent =
    | 'target_level_selected'
    | 'search_performed'
    | 'search_result_clicked'
    | 'newsletter_subscribe'
    | 'newsletter_subscribe_success'
    | 'newsletter_subscribe_error'
    | 'like_added'
    | 'like_removed'

// Combined Event Type
export type AnalyticsEventName =
    | PWAEvent
    | NotificationEvent
    | ArticleEvent
    | UserJourneyEvent

// ============================================================================
// Event Parameters Interface
// ============================================================================

export interface AnalyticsEventParams {
    /** Event category for grouping */
    category?: EventCategory
    /** Descriptive label for the event */
    label?: string
    /** Numeric value (e.g., scroll %, time in seconds) */
    value?: number
    /** Current page path */
    page?: string
    /** Article slug if applicable */
    articleSlug?: string
    /** Target audience level */
    targetLevel?: 'newbie' | 'midway' | 'expert'
    /** Source of the action (e.g., button location) */
    source?: string
    /** Search query if applicable */
    searchQuery?: string
    /** Additional context */
    context?: string
    /** Share platform */
    platform?: string
    /** Code language if copying code */
    codeLanguage?: string
}

// ============================================================================
// Main Tracking Function
// ============================================================================

/**
 * Track an analytics event
 * 
 * @param eventName - The name of the event to track
 * @param params - Optional parameters for the event
 */
export function trackEvent(
    eventName: AnalyticsEventName,
    params: AnalyticsEventParams = {}
): void {
    if (typeof window === 'undefined') return

    // Determine category if not provided
    const category = params.category || inferCategory(eventName)

    // Use gtag if available (respects cookie consent via GoogleAnalytics component)
    if (window.gtag) {
        window.gtag('event', eventName, {
            event_category: category,
            event_label: params.label || params.source || 'default',
            value: params.value,
            page_location: params.page || window.location.href,
            article_slug: params.articleSlug,
            target_level: params.targetLevel,
            source: params.source,
            search_query: params.searchQuery,
            context: params.context,
            platform: params.platform,
            code_language: params.codeLanguage,
        })
    }

    // Also use the gtag event helper for consistency
    gtagEvent({
        action: eventName,
        category,
        label: params.label || params.source || 'default',
        value: params.value,
    })

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log(`📊 [Analytics] ${eventName}`, { category, ...params })
    }
}

/**
 * Infer the category from the event name
 */
function inferCategory(eventName: AnalyticsEventName): EventCategory {
    if (eventName.startsWith('pwa_')) return 'pwa'
    if (eventName.startsWith('push_')) return 'notifications'
    if (eventName.startsWith('article_')) return 'article'
    if (eventName.startsWith('newsletter_')) return 'conversion'
    if (eventName.startsWith('search_')) return 'user_journey'
    if (eventName.startsWith('target_')) return 'user_journey'
    if (eventName.startsWith('like_')) return 'engagement'
    return 'engagement'
}

// ============================================================================
// Convenience Functions
// ============================================================================

// --- PWA Events ---

export function trackPWAInstallPromptShown(source?: string) {
    trackEvent('pwa_install_prompt_shown', { category: 'pwa', source })
}

export function trackPWAInstallAccepted(source?: string) {
    trackEvent('pwa_install_accepted', { category: 'pwa', source })
}

export function trackPWAInstallDismissed(source?: string) {
    trackEvent('pwa_install_dismissed', { category: 'pwa', source })
}

export function trackPWAAppInstalled() {
    trackEvent('pwa_app_installed', { category: 'pwa' })
}

export function trackPWAStandaloneSession() {
    trackEvent('pwa_standalone_session', { category: 'pwa' })
}

export function trackOfflinePageView(page: string) {
    trackEvent('pwa_offline_page_view', { category: 'offline', page })
}

export function trackArticleSavedOffline(articleSlug: string) {
    trackEvent('pwa_article_saved_offline', { category: 'offline', articleSlug })
}

export function trackServiceWorkerUpdated() {
    trackEvent('pwa_service_worker_updated', { category: 'pwa' })
}

// --- Notification Events ---

export function trackPushPermissionRequested() {
    trackEvent('push_permission_requested', { category: 'notifications' })
}

export function trackPushPermissionGranted() {
    trackEvent('push_permission_granted', { category: 'notifications' })
}

export function trackPushPermissionDenied() {
    trackEvent('push_permission_denied', { category: 'notifications' })
}

export function trackPushNotificationClicked(context?: string) {
    trackEvent('push_notification_clicked', { category: 'notifications', context })
}

// --- Article Engagement Events ---

export function trackArticleScrollDepth(depth: 25 | 50 | 75 | 100, articleSlug: string) {
    const eventName = `article_scroll_${depth}` as ArticleEvent
    trackEvent(eventName, {
        category: 'article',
        articleSlug,
        value: depth,
        label: `${depth}%`
    })
}

export function trackArticleReadComplete(articleSlug: string, timeSpentSeconds: number) {
    trackEvent('article_read_complete', {
        category: 'article',
        articleSlug,
        value: timeSpentSeconds,
        label: `${Math.round(timeSpentSeconds / 60)}min`
    })
}

export function trackArticleTimeOnPage(articleSlug: string, timeSpentSeconds: number) {
    trackEvent('article_time_on_page', {
        category: 'article',
        articleSlug,
        value: timeSpentSeconds
    })
}

export function trackArticleShare(articleSlug: string, platform: string) {
    trackEvent('article_share', {
        category: 'article',
        articleSlug,
        platform,
        label: platform
    })
}

export function trackArticleCopyCode(articleSlug: string, codeLanguage?: string) {
    trackEvent('article_copy_code', {
        category: 'article',
        articleSlug,
        codeLanguage,
        label: codeLanguage || 'unknown'
    })
}

export function trackArticleCopyLink(articleSlug: string) {
    trackEvent('article_copy_link', { category: 'article', articleSlug })
}

export function trackBookmarkAdded(articleSlug: string) {
    trackEvent('article_bookmark_added', { category: 'article', articleSlug })
}

export function trackBookmarkRemoved(articleSlug: string) {
    trackEvent('article_bookmark_removed', { category: 'article', articleSlug })
}

// --- User Journey Events ---

export function trackTargetLevelSelected(targetLevel: 'newbie' | 'midway' | 'expert') {
    trackEvent('target_level_selected', {
        category: 'user_journey',
        targetLevel,
        label: targetLevel
    })
}

export function trackSearchPerformed(searchQuery: string) {
    trackEvent('search_performed', {
        category: 'user_journey',
        searchQuery,
        label: searchQuery
    })
}

export function trackSearchResultClicked(searchQuery: string, articleSlug: string) {
    trackEvent('search_result_clicked', {
        category: 'user_journey',
        searchQuery,
        articleSlug,
        label: articleSlug
    })
}

export function trackNewsletterSubscribe(source: string) {
    trackEvent('newsletter_subscribe', { category: 'conversion', source })
}

export function trackNewsletterSubscribeSuccess(source: string) {
    trackEvent('newsletter_subscribe_success', { category: 'conversion', source })
}

export function trackNewsletterSubscribeError(source: string) {
    trackEvent('newsletter_subscribe_error', { category: 'conversion', source })
}

export function trackLikeAdded(articleSlug: string) {
    trackEvent('like_added', { category: 'engagement', articleSlug })
}

export function trackLikeRemoved(articleSlug: string) {
    trackEvent('like_removed', { category: 'engagement', articleSlug })
}

export default trackEvent
