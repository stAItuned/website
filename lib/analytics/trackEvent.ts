'use client'

/**
 * Centralized Analytics Event Tracking
 * 
 * This module provides a unified interface for tracking user engagement events
 * across the website, including PWA, article engagement, and user journey events.
 */

import { event as gtagEvent, isAnalyticsDisabledForCurrentOrigin } from '@/lib/gtag'

// ============================================================================
// Event Categories
// ============================================================================

export type EventCategory =
    | 'pwa'              // PWA-related events
    | 'article'          // Article engagement events
    | 'engagement'       // General engagement events
    | 'user_journey'     // User journey/funnel events
    | 'notifications'    // Push notification events
    | 'navigation'       // Navigation events
    | 'conversion'       // Conversion events
    | 'ecommerce'        // Standard Ecommerce events
    | 'ecommerce'        // Standard Ecommerce events

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

// Qualified View KPI Events
export type QualifiedViewEvent =
    | 'stai_qualified_view'

export type QualifiedViewReason =
    | 'scroll60'
    | 'time30'

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

// Role Fit Audit Events
export type RoleFitAuditEvent =
    | 'role_fit_audit_started'
    | 'role_fit_audit_section_completed'
    | 'role_fit_audit_completed'
    | 'role_fit_audit_cta_clicked'
    | 'role_fit_audit_cta_view'
    | 'role_fit_audit_cta_dismiss'
    | 'role_fit_audit_purchase'

// Career OS Funnel Events
export type CareerOSEvent =
    | 'career_os_cta_clicked'
    | 'pricing_select'
    | 'faq_expand'
    | 'journey_expand'
    | 'audit_modal_open'
    | 'audit_modal_abandon'
    | 'audit_modal_submit'
    | 'form_start'
    | 'form_step_complete'
    | 'form_submit'
    | 'form_abandon'
    | 'header_cta_clicked'
    | 'external_link_clicked'

// Modal & Form Events
export type ModalEvent =
    | 'audit_modal_open'
    | 'audit_modal_abandon'
    | 'audit_modal_submit'
    | 'form_start'
    | 'form_step_complete'
    | 'form_submit'
    | 'form_abandon'

// Conversion & External Events
export type ConversionEvent =
    | 'generate_lead'
    | 'external_link_clicked'

// Standard Interaction Events
export type InteractionEvent =
    | 'select_content'
    | 'select_item'

// Ecommerce Events
export type EcommerceEvent =
    | 'purchase'
    | 'begin_checkout'

// combined Event Type
export type AnalyticsEventName =
    | PWAEvent
    | NotificationEvent
    | ArticleEvent
    | QualifiedViewEvent
    | UserJourneyEvent
    | RoleFitAuditEvent
    | CareerOSEvent
    | ModalEvent
    | ConversionEvent
    | EcommerceEvent
    | InteractionEvent
    | 'header_cta_clicked'
    | 'external_link_clicked'

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
    /** Current page path (explicit for GA4 reporting) */
    pagePath?: string
    /** Current page title (explicit for GA4 reporting) */
    pageTitle?: string
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
    /** Qualified view reason (time or scroll) */
    qvReason?: QualifiedViewReason
    /** Share platform */
    platform?: string
    /** Code language if copying code */
    codeLanguage?: string
    /** Transaction/Purchase data */
    currency?: string
    /** Transaction ID or Order ID */
    transactionId?: string
    /** Coupon code associated with the event */
    coupon?: string
    /** Value of the discount */
    discount?: number
    /** Tax amount */
    tax?: number
    /** Shipping cost */
    shipping?: number
    /** Items involved in the event */
    items?: EcommerceItem[]
}

export interface EcommerceItem {
    item_id: string
    item_name: string
    affiliation?: string
    coupon?: string
    discount?: number
    index?: number
    item_brand?: string
    item_category?: string
    item_category2?: string
    item_category3?: string
    item_category4?: string
    item_category5?: string
    item_list_id?: string
    item_list_name?: string
    item_variant?: string
    location_id?: string
    price?: number
    quantity?: number
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
    if (isAnalyticsDisabledForCurrentOrigin()) return

    // Determine category if not provided
    const category = params.category || inferCategory(eventName)

    // Use gtag if available (respects cookie consent via GoogleAnalytics component)
    if (window.gtag) {
        window.gtag('event', eventName, {
            event_category: category,
            event_label: params.label || params.source || 'default',
            value: params.value,
            page_location: params.page || window.location.href,
            page_path: params.pagePath,
            page_title: params.pageTitle,
            article_slug: params.articleSlug,
            target_level: params.targetLevel,
            source: params.source,
            search_query: params.searchQuery,
            context: params.context,
            qv_reason: params.qvReason,
            platform: params.platform,
            code_language: params.codeLanguage,
            currency: params.currency,
            transaction_id: params.transactionId,
            coupon: params.coupon,
            items: params.items,
            tax: params.tax,
            shipping: params.shipping,
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
    if (eventName === 'purchase' || eventName === 'begin_checkout') return 'ecommerce'
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
    trackEvent('pwa_offline_page_view', { category: 'pwa', page })
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

/**
 * Track a qualified view (KPI): first time a user reaches 30s or 60% scroll.
 */
export function trackQualifiedView(articleSlug: string, reason: QualifiedViewReason) {
    if (typeof window === 'undefined') return
    trackEvent('stai_qualified_view', {
        category: 'article',
        articleSlug,
        label: reason,
        qvReason: reason,
        pagePath: window.location.pathname,
        pageTitle: document.title
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
    // Also track as standard lead
    trackEvent('generate_lead', {
        category: 'conversion',
        currency: 'EUR',
        value: 0,
        source: source,
        label: 'newsletter'
    })
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

// --- Role Fit Audit Events ---

export function trackRoleFitAuditStarted() {
    trackEvent('role_fit_audit_started', { category: 'conversion', source: 'role_fit_audit' })
}

export function trackRoleFitAuditSectionCompleted(sectionNumber: number, sectionName: string) {
    trackEvent('role_fit_audit_section_completed', {
        category: 'conversion',
        source: 'role_fit_audit',
        label: sectionName,
        value: sectionNumber
    })
}

export function trackRoleFitAuditCompleted(archetypeId: string, readinessScore: number) {
    trackEvent('role_fit_audit_completed', {
        category: 'conversion',
        source: 'role_fit_audit',
        label: archetypeId,
        value: readinessScore
    })
}

export function trackRoleFitAuditCTAClicked(ctaType: string, variant: 'box' | 'sticky') {
    trackEvent('role_fit_audit_cta_clicked', {
        category: 'conversion',
        source: `audit_cta_${variant}`,
        label: ctaType
    })
}

export function trackRoleFitAuditCTAView(variant: 'box' | 'sticky') {
    trackEvent('role_fit_audit_cta_view', {
        category: 'engagement',
        source: `audit_cta_${variant}`
    })
}

export function trackRoleFitAuditCTADismiss() {
    trackEvent('role_fit_audit_cta_dismiss', {
        category: 'engagement',
        source: 'audit_cta_sticky'
    })
}

export function trackRoleFitAuditPurchase(orderId: string, amount: number, currency: string = 'EUR') {
    trackEvent('role_fit_audit_purchase', {
        category: 'conversion',
        source: 'role_fit_audit',
        label: orderId,
        value: amount,
        currency,
        transactionId: orderId
    })
}

// --- Career OS Events ---

export function trackCareerOSCTAClicked(section: string, label: string) {
    trackEvent('career_os_cta_clicked', {
        category: 'engagement',
        source: section,
        label: label
    })
}

export function trackPricingSelect(tier: string, billing: string) {
    trackEvent('pricing_select', {
        category: 'engagement',
        label: tier,
        context: billing
    })
}

export function trackFAQExpand(question: string) {
    trackEvent('faq_expand', {
        category: 'engagement',
        label: question
    })
}

export function trackJourneyExpand(weekTitle: string) {
    trackEvent('journey_expand', {
        category: 'engagement',
        label: weekTitle
    })
}

// --- Modal & Form Events ---

export function trackAuditModalOpen(location: string) {
    trackEvent('audit_modal_open', { category: 'conversion', page: location })
}

export function trackAuditModalAbandon(reason: string) {
    trackEvent('audit_modal_abandon', { category: 'conversion', context: reason })
}

export function trackAuditModalSubmit(location: string) {
    trackEvent('audit_modal_submit', { category: 'conversion', page: location })
}

export function trackFormStart(formName: string, source: string) {
    trackEvent('form_start', {
        category: 'conversion',
        label: formName,
        source: source
    })
}

export function trackFormStepComplete(formName: string, step: number, totalSteps: number) {
    trackEvent('form_step_complete', {
        category: 'conversion',
        label: formName,
        value: step,
        context: `${step}/${totalSteps}`
    })
}

export function trackFormSubmit(formName: string) {
    trackEvent('form_submit', { category: 'conversion', label: formName })
}

export function trackFormAbandon(formName: string, lastStep: number) {
    trackEvent('form_abandon', {
        category: 'conversion',
        label: formName,
        value: lastStep
    })
}

// --- Header & Footer Events ---

export function trackHeaderCTAClicked(label: string) {
    trackEvent('header_cta_clicked', { category: 'engagement', label })
}

export function trackExternalLinkClicked(platform: 'linkedin' | 'calendly' | 'other', label: string) {
    trackEvent('external_link_clicked', {
        category: 'conversion',
        label: `${platform}:${label}`,
        platform
    })
}

// --- Ecommerce Events ---

export function trackPurchase(params: {
    transactionId: string
    value: number
    currency: string
    coupon?: string
    items: EcommerceItem[]
    tax?: number
    shipping?: number
}) {
    trackEvent('purchase', {
        category: 'ecommerce',
        transactionId: params.transactionId,
        value: params.value,
        currency: params.currency,
        coupon: params.coupon,
        items: params.items,
        tax: params.tax,
        shipping: params.shipping
    })
}

export function trackBeginCheckout(params: {
    value?: number
    currency?: string
    coupon?: string
    items: EcommerceItem[]
}) {
    trackEvent('begin_checkout', {
        category: 'ecommerce',
        value: params.value,
        currency: params.currency,
        coupon: params.coupon,
        items: params.items
    })
}

export function trackSelectContent(contentType: string, itemId: string) {
    trackEvent('select_content', {
        category: 'engagement',
        label: contentType,
        context: itemId
    })
}

export function trackSelectItem(options: {
    itemListId?: string
    itemListName?: string
    items: EcommerceItem[]
}) {
    trackEvent('select_item', {
        category: 'ecommerce',
        items: options.items,
        label: options.itemListName,
        context: options.itemListId
    })
}

export default trackEvent
