
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const articlesDir = path.join(process.cwd(), 'public/content/articles');

// Recursive function to find all markdown files
function getFiles(dir: string): string[] {
    const subdirs = fs.readdirSync(dir);
    const files = subdirs.map((subdir) => {
        const res = path.resolve(dir, subdir);
        return fs.statSync(res).isDirectory() ? getFiles(res) : res;
    });
    return files.flat().filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
}

const files = getFiles(articlesDir);
let count = 0;

files.forEach(filePath => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    let changed = false;

    // Check strict primaryTopic
    if (data.primaryTopic === 'business') {
        data.primaryTopic = 'ai-fundamentals';
        changed = true;
    }

    // Check topics list
    if (Array.isArray(data.topics) && data.topics.includes('business')) {
        data.topics = data.topics.filter((t: string) => t !== 'business');
        changed = true;
    }

    if (changed) {
        const newContent = matter.stringify(content, data);
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated: ${path.relative(process.cwd(), filePath)}`);
        count++;
    }
});

console.log(`\nTotal files updated: ${count}`);
