#!/usr/bin/env node
/**
 * Test script for sending push notifications to a specific token
 * 
 * Usage: node scripts/send-test-to-token.js
 */

const { initializeApp } = require('firebase/app');
const { getFunctions, httpsCallable } = require('firebase/functions');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyD8ZBfLzHE2XVnwd6HUj1N9AjY8CKXAog8",
    authDomain: "staituned-production-163f4.firebaseapp.com",
    projectId: "staituned-production-163f4",
    storageBucket: "staituned-production-163f4.firebasestorage.app",
    messagingSenderId: "1070464718249",
    appId: "1:1070464718249:web:f7c6e040a3f029c1d2a0b8"
};

async function main() {
    console.log('🔔 Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const functions = getFunctions(app, 'europe-west1');
    const databaseId = process.env.NEXT_PUBLIC_FIRESTORE_MAIN_DATABASE_ID || 'eu-primary';
    if (databaseId === '(default)') {
        throw new Error('NEXT_PUBLIC_FIRESTORE_MAIN_DATABASE_ID cannot be "(default)". Use the EU main database "eu-primary".');
    }
    const db = getFirestore(app, databaseId);
    console.log(`🗄️ Using Firestore DB: ${databaseId}`);

    // Get all tokens from Firestore
    console.log('📋 Fetching tokens from Firestore...');
    const tokensRef = collection(db, 'fcm_tokens');
    const snapshot = await getDocs(tokensRef);

    if (snapshot.empty) {
        console.log('❌ No tokens found in fcm_tokens collection!');
        return;
    }

    const tokens = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        console.log(`  Token: ${doc.id.substring(0, 30)}...`);
        console.log(`  Topics: ${JSON.stringify(data.topics || [])}`);
        console.log(`  Active: ${data.active}`);
        console.log('');
        if (data.active !== false) {
            tokens.push(doc.id);
        }
    });

    if (tokens.length === 0) {
        console.log('❌ No active tokens found!');
        return;
    }

    console.log(`📤 Sending test notification to ${tokens.length} token(s)...`);

    const sendTest = httpsCallable(functions, 'sendTestNotification');

    try {
        const result = await sendTest({
            tokens: tokens,
            title: "🧪 Test Notification",
            body: "If you see this, notifications are working!",
            url: "https://staituned.com/learn"
        });

        console.log('✅ Result:', result.data);
    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.details) {
            console.error('Details:', error.details);
        }
    }
}

main();
