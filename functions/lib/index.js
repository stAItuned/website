import { onSchedule } from "firebase-functions/v2/scheduler";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { getMessaging } from "firebase-admin/messaging";
import { db } from "./firebase.js";
setGlobalOptions({ region: "europe-west1", memory: "256MiB", timeoutSeconds: 120 });
const PROPERTY = `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`; // es. "properties/123456789"
// Centralized analytics date configuration - Change this to match your website launch date
const ANALYTICS_START_DATE = "2020-01-01";
// Assicurati che l'account di servizio <project-id>@appspot.gserviceaccount.com
// sia aggiunto in GA4 (Property access management) con ruolo Viewer/Analyst.
// Helper function to validate Firestore document path
function isValidFirestoreDocPath(path) {
    const segments = path.split('/').filter(segment => segment.length > 0);
    // Document paths must have an even number of segments (collection/document pairs)
    // For example: "analytics/articles/some-slug" has 3 segments, which is odd, so it's a collection path
    // "analytics/daily" has 2 segments, which is even, so it's a document path
    return segments.length % 2 === 0 && segments.length > 0 && segments.every(segment => segment.length > 0);
}
export const dailyAnalytics = onSchedule({
    schedule: "0 6 * * *", // ogni giorno alle 06:00
    timeZone: "Europe/Rome",
    region: "europe-west1"
}, async () => {
    console.log('🔄 Starting daily analytics job...');
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    // Idempotenza: se già aggiornato oggi, esci
    const docRef = db.doc(`analytics/daily`);
    const snap = await docRef.get();
    if (snap.exists) {
        const data = snap.data();
        if (data.date === today) {
            console.log('✅ Analytics already updated today:', today);
            return;
        }
    }
    console.log('📊 Fetching GA4 data for date:', today);
    try {
        // Use Application Default Credentials (ADC) for GA4 access
        const client = new BetaAnalyticsDataClient(); // uses runtime service account
        // Fetch overall stats - all time (since 2020-01-01 or adjust to your website launch date)
        const [overallReport] = await client.runReport({
            property: PROPERTY,
            dateRanges: [{ startDate: ANALYTICS_START_DATE, endDate: "today" }],
            metrics: [
                { name: "screenPageViews" },
                { name: "activeUsers" },
                { name: "sessions" },
                { name: "averageSessionDuration" },
                { name: "bounceRate" }
            ]
        });
        // Fetch top pages - all time
        const [topPagesReport] = await client.runReport({
            property: PROPERTY,
            dateRanges: [{ startDate: ANALYTICS_START_DATE, endDate: "today" }],
            dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
            metrics: [
                { name: "screenPageViews" },
                { name: "activeUsers" },
                { name: "sessions" },
                { name: "averageSessionDuration" },
                { name: "bounceRate" }
            ],
            orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
            limit: 20
        });
        // Fetch article-specific stats (pages che contengono /learn/) - all time
        const [articlesReport] = await client.runReport({
            property: PROPERTY,
            dateRanges: [{ startDate: ANALYTICS_START_DATE, endDate: "today" }],
            dimensions: [{ name: "pagePath" }],
            dimensionFilter: {
                filter: {
                    fieldName: "pagePath",
                    stringFilter: {
                        matchType: "CONTAINS",
                        value: "/learn/"
                    }
                }
            },
            metrics: [
                { name: "screenPageViews" },
                { name: "activeUsers" },
                { name: "sessions" },
                { name: "averageSessionDuration" },
                { name: "bounceRate" }
            ]
        });
        // Process overall stats
        const overallRow = overallReport.rows?.[0];
        const totalStats = {
            pageViews: Number(overallRow?.metricValues?.[0]?.value ?? 0),
            users: Number(overallRow?.metricValues?.[1]?.value ?? 0),
            sessions: Number(overallRow?.metricValues?.[2]?.value ?? 0),
            avgTimeOnPage: Number(overallRow?.metricValues?.[3]?.value ?? 0),
            bounceRate: Number(overallRow?.metricValues?.[4]?.value ?? 0)
        };
        // Process top pages
        const topPages = (topPagesReport.rows ?? []).map(r => ({
            path: r.dimensionValues?.[0]?.value ?? "",
            title: r.dimensionValues?.[1]?.value ?? "",
            pageViews: Number(r.metricValues?.[0]?.value ?? 0),
            users: Number(r.metricValues?.[1]?.value ?? 0),
            sessions: Number(r.metricValues?.[2]?.value ?? 0),
            avgTimeOnPage: Number(r.metricValues?.[3]?.value ?? 0),
            bounceRate: Number(r.metricValues?.[4]?.value ?? 0)
        }));
        // Process articles stats
        const articlesStats = {};
        console.log(`📝 Processing ${articlesReport.rows?.length || 0} article rows from GA4`);
        (articlesReport.rows ?? []).forEach((r, index) => {
            const path = r.dimensionValues?.[0]?.value ?? "";
            console.log(`Row ${index}: path = "${path}"`);
            // Match /learn/{category}/{slug} and extract just the slug part
            const match = path.match(/\/learn\/[^/]+\/([^/?#]+)/);
            if (match) {
                const slug = match[1];
                console.log(`✅ Matched slug: "${slug}" from path: "${path}"`);
                // If this slug already exists, aggregate the metrics
                if (articlesStats[slug]) {
                    articlesStats[slug].pageViews += Number(r.metricValues?.[0]?.value ?? 0);
                    articlesStats[slug].users += Number(r.metricValues?.[1]?.value ?? 0);
                    articlesStats[slug].sessions += Number(r.metricValues?.[2]?.value ?? 0);
                    // For avgTimeOnPage and bounceRate, take the weighted average or max
                    articlesStats[slug].avgTimeOnPage = Math.max(articlesStats[slug].avgTimeOnPage, Number(r.metricValues?.[3]?.value ?? 0));
                    articlesStats[slug].bounceRate = Math.max(articlesStats[slug].bounceRate, Number(r.metricValues?.[4]?.value ?? 0));
                    console.log(`🔄 Aggregated data for existing slug: "${slug}"`);
                }
                else {
                    articlesStats[slug] = {
                        pageViews: Number(r.metricValues?.[0]?.value ?? 0),
                        users: Number(r.metricValues?.[1]?.value ?? 0),
                        sessions: Number(r.metricValues?.[2]?.value ?? 0),
                        avgTimeOnPage: Number(r.metricValues?.[3]?.value ?? 0),
                        bounceRate: Number(r.metricValues?.[4]?.value ?? 0)
                    };
                }
            }
            else {
                console.log(`❌ No match for path: "${path}"`);
            }
        });
        console.log(`📊 Final articlesStats keys: ${Object.keys(articlesStats).join(', ')}`);
        console.log(`📊 Total articles processed: ${Object.keys(articlesStats).length}`);
        // Save to Firestore
        const analyticsData = {
            date: today,
            updatedAt: new Date().toISOString(),
            dateRange: { startDate: ANALYTICS_START_DATE, endDate: "today" },
            totalStats,
            topPages,
            articlesStats
        };
        // Save summary
        await docRef.set(analyticsData, { merge: true });
        // Save individual article stats for fast lookup
        for (const [slug, stats] of Object.entries(articlesStats)) {
            // Sanitize slug for Firestore document ID (replace invalid characters)
            const sanitizedSlug = slug
                .replace(/[/\\]/g, '-') // Replace slashes with hyphens
                .replace(/[^a-zA-Z0-9\-_]/g, '') // Remove any other invalid characters
                .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
                .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
            // Ensure the sanitized slug is not empty and is valid
            if (sanitizedSlug && sanitizedSlug.length > 0) {
                // Use a different collection structure: articles/{slug} instead of analytics/articles/{slug}
                const docPath = `articles/${sanitizedSlug}`;
                console.log(`Saving analytics for slug: "${slug}" -> sanitized: "${sanitizedSlug}"`);
                console.log(`Document path: "${docPath}"`);
                // Validate Firestore document path
                if (!isValidFirestoreDocPath(docPath)) {
                    console.error(`Invalid Firestore document path: "${docPath}"`);
                    continue;
                }
                try {
                    await db.doc(docPath).set({
                        ...stats,
                        updatedAt: analyticsData.updatedAt,
                        originalSlug: slug
                    }, { merge: true });
                    console.log(`✅ Successfully saved analytics for "${sanitizedSlug}"`);
                }
                catch (error) {
                    console.error(`Failed to save analytics for slug "${slug}" (sanitized: "${sanitizedSlug}"):`, error);
                }
            }
            else {
                console.warn(`Skipping invalid slug: "${slug}" (sanitized: "${sanitizedSlug}")`);
            }
        }
        console.log('✅ Daily analytics job completed successfully');
        console.log(`📈 Processed ${topPages.length} top pages, ${Object.keys(articlesStats).length} articles`);
    }
    catch (error) {
        console.error('❌ Daily analytics job failed:', error);
        throw error;
    }
});
/**
 * Send New Article Notification
 *
 * Sends push notification to 'new-articles' topic subscribers.
 * Call from CMS or publishing workflow.
 */
export const sendNewArticleNotification = onCall({ region: "europe-west1", memory: "256MiB" }, async (request) => {
    const { title, slug, target, description, imageUrl } = request.data;
    if (!title || !slug || !target) {
        throw new HttpsError('invalid-argument', 'Missing: title, slug, target');
    }
    const articleUrl = `https://staituned.com/learn/${target}/${slug}`;
    const message = {
        topic: 'new-articles',
        notification: {
            title: '📚 New Article: ' + title,
            body: description || 'A new article has been published!',
        },
        webpush: {
            fcmOptions: { link: articleUrl },
            notification: {
                icon: 'https://staituned.com/icon-192.png',
                badge: 'https://staituned.com/icon-192.png',
                tag: `new-article-${slug}`,
                ...(imageUrl && { image: imageUrl })
            }
        },
        data: {
            url: articleUrl,
            articleSlug: slug,
            target: target,
            type: 'new-article'
        }
    };
    try {
        const messaging = getMessaging();
        const response = await messaging.send(message);
        console.log(`✅ Notification sent: ${response}, Article: ${title}`);
        await db.collection('notifications').add({
            type: 'new-article',
            title, slug, target,
            sentAt: new Date().toISOString(),
            messageId: response
        });
        return { success: true, messageId: response };
    }
    catch (error) {
        console.error('❌ Failed to send notification:', error);
        throw new HttpsError('internal', 'Failed to send notification');
    }
});
/**
 * Send Test Notification to specific tokens
 */
export const sendTestNotification = onCall({ region: "europe-west1", memory: "256MiB" }, async (request) => {
    const { tokens, title, body, url } = request.data;
    if (!tokens?.length || !title || !body) {
        throw new HttpsError('invalid-argument', 'Required: tokens[], title, body');
    }
    const message = {
        tokens,
        notification: { title, body },
        webpush: {
            fcmOptions: { link: url || 'https://staituned.com/learn' },
            notification: {
                icon: 'https://staituned.com/icon-192.png',
                badge: 'https://staituned.com/icon-192.png'
            }
        },
        data: { url: url || 'https://staituned.com/learn', type: 'test' }
    };
    try {
        const messaging = getMessaging();
        const response = await messaging.sendEachForMulticast(message);
        console.log(`✅ Test sent: ${response.successCount}/${tokens.length}`);
        return {
            success: true,
            successCount: response.successCount,
            failureCount: response.failureCount
        };
    }
    catch (error) {
        console.error('❌ Failed:', error);
        throw new HttpsError('internal', 'Failed to send');
    }
});
/**
 * Firestore Trigger: Send notification when article is published
 *
 * Triggers when an article document is updated and status changes from "draft" to "publish"
 * Document path: articles/{articleId}
 */
export const onArticlePublished = onDocumentUpdated({
    document: "articles/{articleId}",
    region: "europe-west1"
}, async (event) => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();
    if (!beforeData || !afterData) {
        console.log('No data in event');
        return;
    }
    // Check if status changed from draft to publish/published
    const wasPublished = (beforeData.status === 'draft' || !beforeData.status) &&
        (afterData.status === 'publish' || afterData.status === 'published');
    if (!wasPublished) {
        console.log(`Status change: ${beforeData.status} -> ${afterData.status}, skipping notification`);
        return;
    }
    console.log(`📢 Article published: ${event.params.articleId}`);
    // Extract article info
    const title = afterData.title || 'New Article';
    const slug = afterData.slug || event.params.articleId;
    const target = (afterData.target || 'expert').toLowerCase();
    const description = afterData.meta || afterData.description || '';
    const imageUrl = afterData.cover || '';
    const articleUrl = `https://staituned.com/learn/${target}/${slug}`;
    // Get all tokens subscribed to new-articles
    const tokensSnapshot = await db.collection('fcm_tokens').get();
    const tokens = [];
    tokensSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.active !== false && (data.topics || []).includes('new-articles')) {
            tokens.push(doc.id);
        }
    });
    if (tokens.length === 0) {
        console.log('No subscribers to notify');
        return;
    }
    console.log(`📱 Sending to ${tokens.length} subscriber(s)`);
    const messaging = getMessaging();
    let successCount = 0;
    let failCount = 0;
    for (const token of tokens) {
        try {
            await messaging.send({
                token,
                notification: {
                    title: `📚 New Article: ${title}`,
                    body: description || 'A new article has been published!',
                },
                webpush: {
                    fcmOptions: { link: articleUrl },
                    notification: {
                        icon: 'https://staituned.com/icon-192.png',
                        badge: 'https://staituned.com/icon-192.png',
                        tag: `new-article-${slug}`,
                        ...(imageUrl && { image: imageUrl })
                    }
                },
                data: {
                    url: articleUrl,
                    articleSlug: slug,
                    target: target,
                    type: 'new-article'
                }
            });
            successCount++;
        }
        catch (error) {
            failCount++;
            console.log(`Failed to send to token: ${error.message}`);
            if (error.code === 'messaging/registration-token-not-registered') {
                await db.collection('fcm_tokens').doc(token).update({ active: false });
            }
        }
    }
    // Log notification
    await db.collection('notifications').add({
        type: 'new-article',
        title,
        slug,
        target,
        articleId: event.params.articleId,
        sentAt: new Date().toISOString(),
        successCount,
        failCount,
        trigger: 'firestore'
    });
    console.log(`✅ Notification sent: ${successCount} success, ${failCount} failed`);
});
//# sourceMappingURL=index.js.map