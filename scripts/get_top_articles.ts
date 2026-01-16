import { dbDefault } from './lib/firebase/admin';
import * as dotenv from 'dotenv';
dotenv.config();

async function getTopArticles() {
    try {
        const docRef = dbDefault().doc('analytics/daily');
        const snap = await docRef.get();
        if (!snap.exists) {
            console.log('No analytics data found');
            return;
        }
        const data = snap.data();
        if (!data || !data.articlesStats) {
            console.log('No article stats found');
            return;
        }

        const stats = data.articlesStats;
        const sortedSlugs = Object.keys(stats).sort((a, b) => {
            return (stats[b].pageViews || 0) - (stats[a].pageViews || 0);
        });

        console.log('TOP 5 ARTICLES BY VIEWS:');
        sortedSlugs.slice(0, 5).forEach((slug, i) => {
            console.log(`${i + 1}. ${slug} (${stats[slug].pageViews} views)`);
        });
    } catch (err) {
        console.error('Error:', err);
    }
}

getTopArticles();
