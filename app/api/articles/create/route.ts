import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author, date, topics, meta, target, language, published, content, slug, images, hasCover } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Create the article directory path
    const articlesDir = path.join(process.cwd(), 'public', 'content', 'articles', slug);

    // Check if article already exists
    if (fs.existsSync(articlesDir)) {
      return NextResponse.json(
        { error: 'An article with this slug already exists' },
        { status: 409 }
      );
    }

    // Create the directory
    fs.mkdirSync(articlesDir, { recursive: true });

    // Prepare frontmatter
    const topicsArray = topics
      ? topics.split(',').map((t: string) => t.trim()).filter(Boolean)
      : [];

    const frontmatter = [
      '---',
      `title: "${title}"`,
      author ? `author: "${author}"` : '',
      date ? `date: ${date}` : '',
      topicsArray.length > 0 ? `topics: [${topicsArray.map((t: string) => `"${t}"`).join(', ')}]` : '',
      meta ? `meta: "${meta}"` : '',
      target ? `target: "${target}"` : '',
      language ? `language: "${language}"` : '',
      hasCover ? `cover: "cover.webp"` : '',
      `published: ${published}`,
      '---',
      '',
    ]
      .filter(Boolean)
      .join('\n');

    // Create article.md file
    const articleContent = frontmatter + content;
    const articlePath = path.join(articlesDir, 'article.md');
    fs.writeFileSync(articlePath, articleContent, 'utf-8');

    // Save images if any
    const savedImages: string[] = [];
    if (images && Array.isArray(images)) {
      for (const image of images) {
        try {
          // Extract base64 data
          const base64Data = image.data.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Save image to article directory
          const imagePath = path.join(articlesDir, image.name);
          fs.writeFileSync(imagePath, buffer);
          savedImages.push(image.name);
        } catch (imageError) {
          console.error(`Error saving image ${image.name}:`, imageError);
        }
      }
    }

    return NextResponse.json({
      message: 'Article created successfully',
      slug,
      path: articlePath,
      imagesCount: savedImages.length,
      savedImages,
    });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
