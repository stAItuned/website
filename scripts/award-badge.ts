import { awardBadge, getAuthorBadges, generateCredentialId } from '../lib/firebase/badge-service';
import { BADGE_DEFINITIONS } from '../lib/config/badge-config';
import { AuthorBadge } from '../lib/types/badge';
import admin from 'firebase-admin';

import fs from 'fs';
import path from 'path';

// Helper to load env
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            envContent.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
                    process.env[key] = value;
                }
            });
        }
    } catch (e) {
        console.warn("Could not load .env file", e);
    }
}

loadEnv();

if (!admin.apps.length) {
    try {
        const serviceAccount = process.env.FB_SERVICE_ACCOUNT_KEY;
        if (serviceAccount) {
            const serviceAccountJSON = JSON.parse(serviceAccount);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccountJSON)
            });
            console.log(`Initialized Firebase Admin with project: ${serviceAccountJSON.project_id}`);
        } else {
            console.warn("FB_SERVICE_ACCOUNT_KEY not found in env. Falling back to default credentials.");
            admin.initializeApp();
        }
    } catch (e) {
        console.error("Failed to initialize admin", e);
        process.exit(1);
    }
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log("Usage: npx tsx scripts/award-badge.ts <authorSlug> <badgeId>");
        console.log("Example: npx tsx scripts/award-badge.ts Davide-Moltisanti editor-approved");
        process.exit(1);
    }

    const [authorSlug, badgeId] = args;

    // 1. Validate Badge ID
    const badgeDef = BADGE_DEFINITIONS.find(b => b.id === badgeId);
    if (!badgeDef) {
        console.error(`Error: Badge '${badgeId}' not found in configuration.`);
        console.log("Available badges:", BADGE_DEFINITIONS.map(b => b.id).join(", "));
        process.exit(1);
    }

    // 2. Check if already earned
    const existing = await getAuthorBadges(authorSlug);
    if (existing.some(b => b.badgeId === badgeId)) {
        console.log(`Author '${authorSlug}' already has badge '${badgeId}'.`);
        process.exit(0);
    }

    console.log(`Awarding '${badgeDef.name.en}' to ${authorSlug}...`);

    // 3. Construct the badge payload
    const now = new Date();
    const newBadge: AuthorBadge = {
        badgeId: badgeDef.id,
        authorId: authorSlug,
        earnedAt: now.toISOString(),
        credentialId: generateCredentialId(now.getFullYear() % 100),
        metrics: { manualAward: true },
        evidenceArticles: [],
        version: "1.0",
        isNew: true
    };

    // 4. Award it
    try {
        await awardBadge(authorSlug, newBadge, []);
        console.log(`Success! Credential ID: ${newBadge.credentialId}`);
    } catch (error) {
        console.error("Failed to award badge:", error);
        process.exit(1);
    }
}

main();
