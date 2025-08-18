import { onCall } from "firebase-functions/v2/https";
import { db } from "./firebase.js";

// Test function per verificare che i dati siano in Firestore
export const testAnalyticsRead = onCall({
  region: "europe-west1"
}, async () => {
  try {
    console.log('📖 Testing analytics read from Firestore...');
    
    // Read daily analytics
    const dailySnap = await db.doc('analytics/daily').get();
    const dailyData = dailySnap.exists ? dailySnap.data() : null;
    
    // Read articles collection
    const articlesSnap = await db.collection('analytics').doc('articles').collection('data').get();
    const articlesData: { [key: string]: any } = {};
    
    articlesSnap.forEach(doc => {
      articlesData[doc.id] = doc.data();
    });
    
    // Read old test data if exists
    const summariesSnap = await db.doc('analytics/summaries').get();
    const summariesData = summariesSnap.exists ? summariesSnap.data() : null;
    
    console.log('✅ Analytics read test completed');
    
    return {
      success: true,
      data: {
        daily: dailyData,
        articles: articlesData,
        summaries: summariesData, // old test data
        counts: {
          articlesCount: Object.keys(articlesData).length,
          hasDailyData: !!dailyData,
          hasSummariesData: !!summariesData
        }
      }
    };
  } catch (error) {
    console.error('❌ Analytics read test failed:', error);
    return {
      success: false,
      error: String(error)
    };
  }
});
