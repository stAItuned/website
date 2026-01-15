
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Env loader
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

const API_KEY = process.env.GOOGLE_AI_API_KEY;

if (!API_KEY) {
    console.error('❌ GOOGLE_AI_API_KEY missing in .env');
    process.exit(1);
}

// MUST MATCH WHAT IS IN lib/ai/gemini.ts
const MODEL_NAME = 'gemini-3-pro';

console.log(`---------------------------------------------------`);
console.log(`🤖 Testing Gemini Model: ${MODEL_NAME}`);
console.log(`---------------------------------------------------`);

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

async function run() {
    try {
        console.log('⏳ Sending request...');
        const result = await model.generateContent("Hello! Are you working? Reply with 'Yes, I am working'.");
        const response = result.response;
        console.log('✅ Response received:', response.text());
        console.log('---------------------------------------------------');
        console.log('🎉 GREAT! The model is working correctly.');
        console.log('---------------------------------------------------');
    } catch (error: any) {
        console.error('❌ Error generating content:', error.message);
        console.error('Full Error:', error);

        if (error.message?.includes('404') || error.message?.includes('not found')) {
            console.log('\n⚠️  DIAGNOSIS: MODEL NOT FOUND (404)');
            console.log(`   The model "${MODEL_NAME}" is not available for your API Key.`);
            console.log('   RECOMMENDATION: Switch back to "gemini-1.5-pro" in lib/ai/gemini.ts');
        }
    }
}

run();
