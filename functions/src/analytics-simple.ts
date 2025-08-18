import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

interface AnalyticsData {
  pageViews: number;
  users: number;
  sessions: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

interface TopPage {
  path: string;
  title: string;
  pageViews: number;
  users: number;
  sessions: number;
  avgTimeOnPage: number;
  bounceRate: number;
}

interface AnalyticsSummary {
  updatedAt: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  totalStats: AnalyticsData;
  topPages: TopPage[];
  articlesStats: { [slug: string]: AnalyticsData };
}

// Test function to manually write sample data to Firestore
export const testFirestore = functions
  .region('europe-west1')
  .https
  .onCall(async (data, context) => {
    console.log('🧪 Testing Firestore connection...');
    
    try {
      const db = admin.firestore();
      
      // Create test analytics data
      const testData: AnalyticsSummary = {
        updatedAt: new Date().toISOString(),
        dateRange: {
          startDate: '30daysAgo',
          endDate: 'today',
        },
        totalStats: {
          pageViews: 12500,
          users: 8200,
          sessions: 9800,
          avgTimeOnPage: 145.5,
          bounceRate: 0.42,
        },
        topPages: [
          {
            path: '/learn/midway/advanced-data-normalization-techniques-for-financial-data-analysis',
            title: 'Advanced Data Normalization Techniques for Financial Data Analysis',
            pageViews: 850,
            users: 720,
            sessions: 780,
            avgTimeOnPage: 285.3,
            bounceRate: 0.35,
          },
          {
            path: '/learn/midway/agentic-ai-vs-traditional-ai-key-differences',
            title: 'Agentic AI vs Traditional AI: Key Differences',
            pageViews: 620,
            users: 540,
            sessions: 580,
            avgTimeOnPage: 220.1,
            bounceRate: 0.38,
          },
        ],
        articlesStats: {
          'advanced-data-normalization-techniques-for-financial-data-analysis': {
            pageViews: 850,
            users: 720,
            sessions: 780,
            avgTimeOnPage: 285.3,
            bounceRate: 0.35,
          },
          'agentic-ai-vs-traditional-ai-key-differences': {
            pageViews: 620,
            users: 540,
            sessions: 580,
            avgTimeOnPage: 220.1,
            bounceRate: 0.38,
          },
        },
      };

      // Write to analytics/summaries collection
      await db.collection('analytics').doc('summaries').set(testData);
      
      // Write individual article stats
      for (const [slug, stats] of Object.entries(testData.articlesStats)) {
        await db.collection('analytics').doc('articles').collection('data').doc(slug).set({
          ...stats,
          updatedAt: testData.updatedAt,
        });
      }
      
      console.log('✅ Test data written to Firestore successfully');
      
      return {
        success: true,
        message: 'Test analytics data written to Firestore',
        dataWritten: {
          summaryRecord: 1,
          articleRecords: Object.keys(testData.articlesStats).length,
        },
      };
    } catch (error) {
      console.error('❌ Failed to write test data to Firestore:', error);
      throw new functions.https.HttpsError('internal', 'Failed to write test data');
    }
  });

// Function to read analytics data from Firestore (for testing)
export const readAnalytics = functions
  .region('europe-west1')
  .https
  .onCall(async (data, context) => {
    console.log('📖 Reading analytics from Firestore...');
    
    try {
      const db = admin.firestore();
      
      // Read summary data
      const summaryDoc = await db.collection('analytics').doc('summaries').get();
      
      if (!summaryDoc.exists) {
        return {
          success: false,
          message: 'No analytics data found in Firestore',
          data: null,
        };
      }
      
      const summaryData = summaryDoc.data();
      
      // Read article data
      const articlesSnapshot = await db.collection('analytics').doc('articles').collection('data').get();
      const articlesData: { [key: string]: any } = {};
      
      articlesSnapshot.forEach(doc => {
        articlesData[doc.id] = doc.data();
      });
      
      console.log('✅ Analytics data read from Firestore successfully');
      
      return {
        success: true,
        message: 'Analytics data read from Firestore',
        data: {
          summary: summaryData,
          articles: articlesData,
          articleCount: Object.keys(articlesData).length,
        },
      };
    } catch (error) {
      console.error('❌ Failed to read analytics from Firestore:', error);
      throw new functions.https.HttpsError('internal', 'Failed to read analytics data');
    }
  });
