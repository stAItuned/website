import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';
// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp();
}
// Scheduled function that runs every hour
export const updateAnalytics = functions
    .region('europe-west1')
    .runWith({
    timeoutSeconds: 540,
    memory: '1GB',
})
    .pubsub
    .schedule('0 * * * *') // Every hour at minute 0
    .timeZone('Europe/Rome')
    .onRun(async () => {
    console.log('🔄 Starting analytics ETL job...');
    try {
        const analyticsData = await fetchGA4Data();
        await storeInFirestore(analyticsData);
        console.log('✅ Analytics ETL job completed successfully');
        return null;
    }
    catch (error) {
        console.error('❌ Analytics ETL job failed:', error);
        throw error;
    }
});
async function fetchGA4Data() {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: functions.config().analytics.client_email,
            private_key: functions.config().analytics.private_key?.replace(/\\n/g, '\n'),
            project_id: functions.config().analytics.project_id,
        },
        scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
    const analyticsData = google.analyticsdata({
        version: 'v1beta',
        auth,
    });
    const propertyId = functions.config().analytics.property_id;
    const startDate = '90daysAgo';
    const endDate = 'today';
    // Fetch overall site stats
    const { data: overallData } = await analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
            dateRanges: [{ startDate, endDate }],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'activeUsers' },
                { name: 'sessions' },
                { name: 'averageSessionDuration' },
                { name: 'bounceRate' },
            ],
        },
    });
    // Fetch top pages
    const { data: topPagesData } = await analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
            dateRanges: [{ startDate, endDate }],
            dimensions: [
                { name: 'pagePath' },
                { name: 'pageTitle' },
            ],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'activeUsers' },
                { name: 'sessions' },
                { name: 'averageSessionDuration' },
                { name: 'bounceRate' },
            ],
            orderBys: [
                { metric: { metricName: 'screenPageViews' }, desc: true },
            ],
            limit: "100",
        },
    });
    // Fetch article-specific stats (pages that match /learn/{target}/{slug})
    const { data: articlesData } = await analyticsData.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
            dateRanges: [{ startDate, endDate }],
            dimensions: [{ name: 'pagePath' }],
            dimensionFilter: {
                filter: {
                    fieldName: 'pagePath',
                    stringFilter: {
                        matchType: 'CONTAINS',
                        value: '/learn/',
                    },
                },
            },
            metrics: [
                { name: 'screenPageViews' },
                { name: 'activeUsers' },
                { name: 'sessions' },
                { name: 'averageSessionDuration' },
                { name: 'bounceRate' },
            ],
            orderBys: [
                { metric: { metricName: 'screenPageViews' }, desc: true },
            ],
            limit: "200",
        },
    });
    // Process the data
    const totalStats = {
        pageViews: parseInt(overallData.rows?.[0]?.metricValues?.[0]?.value || '0'),
        users: parseInt(overallData.rows?.[0]?.metricValues?.[1]?.value || '0'),
        sessions: parseInt(overallData.rows?.[0]?.metricValues?.[2]?.value || '0'),
        avgTimeOnPage: parseFloat(overallData.rows?.[0]?.metricValues?.[3]?.value || '0'),
        bounceRate: parseFloat(overallData.rows?.[0]?.metricValues?.[4]?.value || '0'),
    };
    const topPages = (topPagesData.rows || []).map((row) => ({
        path: row.dimensionValues?.[0]?.value || '',
        title: row.dimensionValues?.[1]?.value || '',
        pageViews: parseInt(row.metricValues?.[0]?.value || '0'),
        users: parseInt(row.metricValues?.[1]?.value || '0'),
        sessions: parseInt(row.metricValues?.[2]?.value || '0'),
        avgTimeOnPage: parseFloat(row.metricValues?.[3]?.value || '0'),
        bounceRate: parseFloat(row.metricValues?.[4]?.value || '0'),
    }));
    const articlesStats = {};
    (articlesData.rows || []).forEach((row) => {
        const path = row.dimensionValues?.[0]?.value || '';
        const match = path.match(/\/learn\/[^/]+\/([^/?]+)/);
        if (match) {
            const slug = match[1];
            articlesStats[slug] = {
                pageViews: parseInt(row.metricValues?.[0]?.value || '0'),
                users: parseInt(row.metricValues?.[1]?.value || '0'),
                sessions: parseInt(row.metricValues?.[2]?.value || '0'),
                avgTimeOnPage: parseFloat(row.metricValues?.[3]?.value || '0'),
                bounceRate: parseFloat(row.metricValues?.[4]?.value || '0'),
            };
        }
    });
    return {
        updatedAt: new Date().toISOString(),
        dateRange: { startDate, endDate },
        totalStats,
        topPages,
        articlesStats,
    };
}
async function storeInFirestore(data) {
    const db = admin.firestore();
    // Store the main summary
    await db.doc('analytics/summaries').set(data);
    // Store individual article stats for quick lookup
    const batch = db.batch();
    Object.entries(data.articlesStats).forEach(([slug, stats]) => {
        const ref = db.doc(`analytics/articles/${slug}`);
        batch.set(ref, {
            ...stats,
            updatedAt: data.updatedAt,
            slug,
        });
    });
    await batch.commit();
    console.log(`📊 Stored analytics data: ${Object.keys(data.articlesStats).length} articles, ${data.topPages.length} top pages`);
}
//# sourceMappingURL=analytics.js.map