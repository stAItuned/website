
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const articlesDir = path.join(process.cwd(), 'public/content/articles');
const targetTopic = 'case-studies';

const filesToMigrate = [
    'ai-for-breast-cancer-diagnosis/AI for breast cancer diagnosis.md',
    'ai-in-agriculture-making-farming-more-efficient-and-sustainable/AI in Agriculture.md',
    'artificial-intelligence-in-videogames/Artificial Intelligence in videogames.md',
    'nanobots-in-healthcare-future-of-medicine/article.md',
    'study-case-the-last-of-us/case-study-the-last-of-us.md',
    'study-case-death-stranding/case-study-ds.md',
    'ai-translator-lara-global-communication/lara.md',
    'musica-generata-dall-intelligenza-artificiale-staituned/musica_generata_con_ai.md',
    'x-ray-image-segmentation-using-u-nets/X-Ray Image Segmentation using U-Nets.md',
];

function getFiles(dir) {
    return filesToMigrate.map(file => path.join(dir, file));
}

console.log("Starting migration...");

const files = getFiles(articlesDir);
let count = 0;

files.forEach(filePath => {
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return;
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    let changed = false;

    if (data.primaryTopic !== targetTopic) {
        data.primaryTopic = targetTopic;
        changed = true;
    }

    // Ensure it's not in the secondary topics list if it is the primary topic
    if (Array.isArray(data.topics) && data.topics.includes(targetTopic)) {
        data.topics = data.topics.filter(t => t !== targetTopic);
        changed = true;
    }

    if (changed) {
        const newContent = matter.stringify(content, data);
        fs.writeFileSync(filePath, newContent);
        console.log(`Migrated: ${path.relative(process.cwd(), filePath)}`);
        count++;
    } else {
        console.log(`Skipped (already correct): ${path.relative(process.cwd(), filePath)}`);
    }
});

console.log(`\nTotal files migrated: ${count}`);
