const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const articlesDir = path.join(process.cwd(), 'public/content/articles');
const reportPath = path.join(process.cwd(), 'final_metadata_report.md');

function walk(dir) {
    const results = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...walk(fullPath));
        } else if (entry.name.endsWith('.md')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            try {
                const { data } = matter(content);
                // Truncate meta if too long for table readability, or keep it full?
                // User asked for "meta description", usually it's around 160 chars.
                // I'll replace newlines with spaces to keep table format.
                const meta = (data.meta || 'N/A').replace(/\n/g, ' ').replace(/\|/g, '-');

                results.push({
                    title: data.title ? data.title.replace(/\|/g, '-') : 'N/A',
                    meta: meta,
                    primaryTopic: data.primaryTopic || 'N/A',
                    topics: (data.topics || []).join(', ')
                });
            } catch (err) { }
        }
    }
    return results;
}

const data = walk(articlesDir).sort((a, b) => a.title.localeCompare(b.title));

const now = new Date().toISOString();

let report = `# Final Article Metadata Report\n\n`;
report += `*Generated at: ${now}*\n\n`;
report += '| Title | Meta Description | Primary Topic | Topics |\n';
report += '|-------|------------------|---------------|--------|\n';

data.forEach(item => {
    report += `| ${item.title} | ${item.meta} | \`${item.primaryTopic}\` | \`${item.topics}\` |\n`;
});

fs.writeFileSync(reportPath, report);
console.log(`Report updated with meta at: ${reportPath}`);
