
const fs = require('fs');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const env = fs.readFileSync('.env', 'utf8');
const match = env.match(/FB_SERVICE_ACCOUNT_KEY='(.*)'/);
if (!match) {
    console.error('Could not find FB_SERVICE_ACCOUNT_KEY in .env');
    process.exit(1);
}

const FB_SERVICE_ACCOUNT_KEY = JSON.parse(match[1].replace(/\\n/g, '\n'));

const app = initializeApp({
    credential: cert(FB_SERVICE_ACCOUNT_KEY)
});

const db = getFirestore(app, 'role-fit-audit');

async function check() {
    console.log('Last 5 newsletter subscribers:');
    const snapshot = await db.collection('newsletter_subscribers').orderBy('subscribedAt', 'desc').limit(5).get();
    if (snapshot.empty) {
        console.log('No subscribers found.');
    }
    snapshot.forEach(doc => {
        console.log(`- ${doc.data().email} (Source: ${doc.data().source}, Date: ${doc.data().subscribedAt})`);
    });
}

check().catch(console.error);
