
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// Simple .env loader if dotenv is not present
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, ...value] = line.split('=');
        if (key && value) {
            let val = value.join('=').trim();
            if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
                val = val.slice(1, -1);
            }
            process.env[key.trim()] = val;
        }
    });
}

console.log('---------------------------------------------------');
console.log('🔥 FIRESTORE CONNECTION TEST');
console.log('---------------------------------------------------');

const rawKey = process.env.FB_SERVICE_ACCOUNT_KEY;

if (!rawKey) {
    console.error('❌ FB_SERVICE_ACCOUNT_KEY is missing in .env');
    process.exit(1);
}

try {
    const creds = JSON.parse(rawKey);
    console.log('✅ Found Credential Key for Project:', creds.project_id);

    // Initializing
    const app = initializeApp({
        credential: cert(creds),
    });

    // USE THE SAME DATABASE ID AS IN YOUR CODE
    const DATABASE_ID = 'role-fit-audit';
    console.log(`🔌 Connecting to Firestore DB: "${DATABASE_ID}"...`);

    const db = getFirestore(app, DATABASE_ID);
    db.settings({ ignoreUndefinedProperties: true });

    (async () => {
        try {
            console.log('📝 Attempting write to "test_connectivity"...');
            const res = await db.collection('test_connectivity').add({
                timestamp: new Date(),
                success: true,
                test_script: true
            });
            console.log('✅ SUCCESS! Document written with ID:', res.id);
            console.log('---------------------------------------------------');
            console.log('🟢 Firestore is CORRECTLY configured.');
            console.log('---------------------------------------------------');
        } catch (error: any) {
            console.error('❌ FAILED:', error.message);
            console.error('full error:', error);

            if (error.code === 5 || error.message?.includes('NOT_FOUND')) {
                console.log('\n⚠️  DIAGNOSIS: DATABASE NOT FOUND');
                console.log(`   The database "${DATABASE_ID}" does not exist in project "${creds.project_id}".`);
                console.log('   SOLUTION:');
                console.log('   1. Go to Firebase Console -> Firestore Database');
                console.log('   2. Create a Named Database with ID: "role-fit-audit"');
                console.log('      OR');
                console.log('   3. Change code to use default database (remove second arg in getFirestore)');
            }
        }
    })();

} catch (e) {
    console.error('❌ Error parsing JSON key:', e);
}
