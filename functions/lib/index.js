import { onSchedule } from "firebase-functions/v2/scheduler";
import { setGlobalOptions } from "firebase-functions/v2";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { db } from "./firebase.js";
setGlobalOptions({ region: "europe-west1", memory: "256MiB", timeoutSeconds: 120 });
const PROPERTY = `properties/${process.env.GOOGLE_ANALYTICS_PROPERTY_ID}`; // es. "properties/123456789"
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
    schedule: "0 6 * * *",
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
        // Fetch overall stats per gli ultimi 90 giorni
        const [overallReport] = await client.runReport({
            property: PROPERTY,
            dateRanges: [{ startDate: "90daysAgo", endDate: "today" }],
            metrics: [
                { name: "screenPageViews" },
                { name: "activeUsers" },
                { name: "sessions" },
                { name: "averageSessionDuration" },
                { name: "bounceRate" }
            ]
        });
        // Fetch top pages per gli ultimi 30 giorni
        const [topPagesReport] = await client.runReport({
            property: PROPERTY,
            dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
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
        // Fetch article-specific stats (pages che contengono /learn/)
        const [articlesReport] = await client.runReport({
            property: PROPERTY,
            dateRanges: [{ startDate: "90daysAgo", endDate: "today" }],
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
            dateRange: { startDate: "90daysAgo", endDate: "today" },
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
//# sourceMappingURL=index.js.map