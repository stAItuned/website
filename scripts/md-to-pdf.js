const fs = require('fs');
const path = require('path');
const { mdToPdf } = require('md-to-pdf');

// Get input files from command line arguments
const inputFiles = process.argv.slice(2);

if (inputFiles.length === 0) {
    console.error('Usage: node scripts/md-to-pdf.js <file1.md> [file2.md ...]');
    process.exit(1);
}

// Basic CSS for better PDF readability
const pdfOptions = {
    css: `
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            margin: 0 auto;
            max-width: 800px;
            padding: 20px;
        }
        h1 { font-size: 24px; border-bottom: 2px solid #eaeaea; padding-bottom: 0.3em; }
        h2 { font-size: 20px; border-bottom: 1px solid #eaeaea; padding-bottom: 0.3em; margin-top: 24px; }
        h3 { font-size: 18px; margin-top: 20px; }
        code { background-color: #f6f8fa; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; }
        pre { background-color: #f6f8fa; padding: 16px; border-radius: 6px; overflow: auto; }
        blockquote { border-left: 4px solid #dfe2e5; padding-left: 1em; color: #6a737d; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #dfe2e5; padding: 6px 13px; }
        th { background-color: #f6f8fa; }
        img { max-width: 100%; }
        hr { border: none; border-top: 1px solid #dfe2e5; margin: 24px 0; }
    `,
    pdf_options: {
        format: 'A4',
        margin: '20mm',
        printBackground: true,
    },
};

const convertFile = async (filePath) => {
    try {
        const absolutePath = path.resolve(process.cwd(), filePath);
        
        if (!fs.existsSync(absolutePath)) {
            console.warn(`Skipping: File not found -> ${filePath}`);
            return;
        }

        const outputPath = absolutePath.replace(/\.md$/i, '.pdf');
        
        console.log(`Converting: ${path.basename(filePath)}...`);
        
        await mdToPdf({ path: absolutePath }, { dest: outputPath, ...pdfOptions });
        
        console.log(`✅ Created: ${path.basename(outputPath)}`);
    } catch (error) {
        console.error(`❌ Error converting ${filePath}:`, error.message);
    }
};

(async () => {
    for (const file of inputFiles) {
        await convertFile(file);
    }
})();
