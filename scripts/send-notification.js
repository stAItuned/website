#!/usr/bin/env node
/**
 * Send new article notification to all subscribed tokens
 * Uses Firebase Admin SDK directly (bypasses Cloud Function)
 * 
 * Usage: node scripts/send-notification.js [title] [slug] [target]
 */

const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'staituned-production-163f4'
});

const db = admin.firestore();
const messaging = admin.messaging();

// Default article data - override with command line args
const title = process.argv[2] || "CAG vs RAG: Which Enterprise AI Approach Wins?";
const slug = process.argv[3] || "cag-vs-rag";
const target = process.argv[4] || "expert";
const articleUrl = `https://staituned.com/learn/${target}/${slug}`;

async function main() {
    console.log('🔔 Sending new article notification...');
    console.log(`📝 Article: ${title}`);
    console.log(`🔗 URL: ${articleUrl}\n`);

    // Get all active tokens subscribed to new-articles
    const snapshot = await db.collection('fcm_tokens').get();

    if (snapshot.empty) {
        console.log('❌ No tokens found!');
        return;
    }

    const tokens = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        if (data.active !== false && (data.topics || []).includes('new-articles')) {
            tokens.push(doc.id);
        }
    });

    if (tokens.length === 0) {
        console.log('❌ No tokens subscribed to new-articles!');
        return;
    }

    console.log(`📱 Sending to ${tokens.length} subscriber(s)...\n`);

    const message = {
        notification: {
            title: `📚 New Article: ${title}`,
            body: 'A new article has been published on stAItuned Learn!'
        },
        webpush: {
            fcmOptions: { link: articleUrl },
            notification: {
                icon: 'https://staituned.com/icon-192.png',
                badge: 'https://staituned.com/icon-192.png',
                tag: `new-article-${slug}`
            }
        },
        data: {
            url: articleUrl,
            articleSlug: slug,
            target: target,
            type: 'new-article'
        }
    };

    let successCount = 0;
    let failCount = 0;

    for (const token of tokens) {
        try {
            await messaging.send({ ...message, token });
            successCount++;
            console.log(`✅ Sent to ${token.substring(0, 20)}...`);
        } catch (error) {
            failCount++;
            console.log(`❌ Failed: ${error.message}`);
            if (error.code === 'messaging/registration-token-not-registered') {
                await db.collection('fcm_tokens').doc(token).update({ active: false });
            }
        }
    }

    // Log notification to Firestore
    await db.collection('notifications').add({
        type: 'new-article',
        title, slug, target,
        sentAt: new Date().toISOString(),
        successCount, failCount
    });

    console.log(`\n✅ Done! Sent: ${successCount}, Failed: ${failCount}`);
}

main().catch(console.error);
