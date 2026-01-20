const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const articlesDir = path.join(process.cwd(), 'public/content/articles');

// 1. Define Hubs (duplicated from config/topics.ts for script simplicity)
const topicHubs = [
    { slug: 'ai-career', keywords: ['career', 'learning', 'job', 'audit', 'velocity', 'role fit'] },
    { slug: 'ai-fundamentals', keywords: ['ai', 'data science', 'machine learning', 'algorithm', 'statistics', 'math', 'ml'] },
    { slug: 'genai-fundamentals', keywords: ['llm', 'tokenization', 'transformer', 'attention', 'generative ai', 'genai', 'nlp', 'prompt'] },
    { slug: 'rag', keywords: ['rag', 'retrieval', 'vector', 'embedding', 'context', 'chunking'] },
    { slug: 'agents', keywords: ['agent', 'tool use', 'function calling', 'planning', 'multi-agent'] },
    { slug: 'llm-evaluation', keywords: ['evaluation', 'benchmark', 'elo', 'metric', 'testing', 'leaderboard'] },
    { slug: 'model-architecture', keywords: ['architecture', 'mixture of experts', 'moe', 'fine-tuning', 'training', 'distillation', 'quantization'] },
    { slug: 'ai-coding', keywords: ['coding', 'copilot', 'cursor', 'windsurf', 'software engineering', 'devops'] },
    { slug: 'ai-research', keywords: ['research', 'paper', 'deep research', 'notebooklm'] },
    { slug: 'production', keywords: ['production', 'deployment', 'latency', 'cost', 'monitoring', 'guardrails', 'security'] },
    { slug: 'business', keywords: ['business', 'finance', 'roi', 'strategy', 'cost'] }
];

// Helper to recursively get files
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.md')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });
    return arrayOfFiles;
}

const files = getAllFiles(articlesDir);
let updatedCount = 0;
let skippedCount = 0;

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const parsed = matter(content);
    const data = parsed.data;

    // Skip if already has primaryTopic
    if (data.primaryTopic) {
        skippedCount++;
        return;
    }

    const currentTopics = data.topics || [];
    const lowerTopics = currentTopics.map(t => t.toLowerCase());

    // Heuristic: Find best matching hub
    let primaryTopic = null;
    let maxScore = -1;

    topicHubs.forEach(hub => {
        let score = 0;
        // Check topic matches
        // 1. Direct match with slug (normalized)
        if (lowerTopics.includes(hub.slug.replace('-', ' '))) score += 10;

        // 2. Keyword match in existing topics
        hub.keywords.forEach(kw => {
            if (lowerTopics.some(t => t.includes(kw))) score += 2;
        });

        // 3. Keyword match in title
        const titleLower = (data.title || '').toLowerCase();
        hub.keywords.forEach(kw => {
            if (titleLower.includes(kw)) score += 1;
        });

        if (score > maxScore && score > 0) {
            maxScore = score;
            primaryTopic = hub.slug;
        }
    });

    // Default fallback
    if (!primaryTopic) {
        // If "GenAI" or "NLP" matches -> genai-fundamentals
        if (lowerTopics.includes('genai') || lowerTopics.includes('nlp')) {
            primaryTopic = 'genai-fundamentals';
        } else if (lowerTopics.includes('machine learning') || lowerTopics.includes('ai')) {
            primaryTopic = 'ai-fundamentals';
        } else {
            // Last resort
            primaryTopic = 'ai-fundamentals';
            console.log(`[Warning] Could not map ${path.basename(file)}. Defaulting to ai-fundamentals.`);
        }
    }

    // Update Data
    data.primaryTopic = primaryTopic;

    // Clean up tags: Remove the primary topic from the "topics" list if present (to avoid duplication conceptually)
    // Actually, keep it as tag for now is harmless, but maybe better to verify uniqueness.
    // Let's keep existing topics as "tags".

    // Save
    const newContent = matter.stringify(parsed.content, data);
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${path.basename(path.dirname(file))} -> ${primaryTopic}`);
    updatedCount++;
});

console.log(`Migration Complete. Updated: ${updatedCount}, Skipped: ${skippedCount}`);
