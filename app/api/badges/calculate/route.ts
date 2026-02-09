import { NextRequest, NextResponse } from 'next/server';
import { allPosts } from '@/lib/contentlayer';
import { getAuthorData } from '@/lib/authors';
import { getAuthorBadges, awardBadge } from '@/lib/firebase/badge-service';
import { calculateEligibleBadges } from '@/lib/badges/badge-calculator';

export const dynamic = 'force-dynamic'; // Defaults to auto, but we want to ensure it runs dynamically if verified

// Protect this route with a secret key in headers
const CRON_SECRET = process.env.CRON_SECRET || 'dev-secret-key';

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
        // Allow public access in dev for easy testing if no secret set, or strictly enforce? 
        // For safe dev environment, we can check NODE_ENV.
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const { searchParams } = new URL(request.url);
    const specificAuthor = searchParams.get('author');

    try {
        // 1. Get List of Authors
        const uniqueAuthors = Array.from(new Set(
            allPosts
                .filter(post => post.published !== false && post.author)
                .map(post => post.author!)
        ));

        const targetAuthors = specificAuthor
            ? uniqueAuthors.filter(a => a.toLowerCase().replaceAll(' ', '-') === specificAuthor.toLowerCase())
            : uniqueAuthors;

        const results = [];

        // 2. Iterate and Calculate
        for (const authorName of targetAuthors) {
            const slug = authorName.replaceAll(' ', '-');
            const existingBadges = await getAuthorBadges(slug);
            const existingIds = existingBadges.map(b => b.badgeId);

            // Build Context
            const authorArticles = allPosts.filter(p => p.author === authorName && p.published !== false);

            // Transform articles to metrics format expected by calculator
            // Note: In a real app we would fetch GA4 data here. 
            // For MVP/Dev, we mock analytics or use basic metadata if available.
            const context = {
                slug,
                articles: authorArticles.map(a => ({
                    slug: a.slug,
                    publishedAt: a.date,
                    topic: a.topic, // Assuming topic exists on post or needs extraction
                    analytics: {
                        pageViews: 100, // Mock: Replace with real GA fetch
                        avgTimeOnPage: 45 // Mock: Replace with real GA fetch
                    }
                }))
            };

            const eligible = calculateEligibleBadges(context, existingIds);

            if (eligible.length > 0) {
                for (const { badge, evidence } of eligible) {
                    await awardBadge(slug, badge, evidence);
                    results.push({ author: slug, badge: badge.badgeId, credentialId: badge.credentialId, action: 'awarded' });
                }
            } else {
                // results.push({ author: slug, action: 'nothing_new' });
            }
        }

        return NextResponse.json({
            success: true,
            processed: targetAuthors.length,
            awards: results
        });

    } catch (error) {
        console.error("Badge Calculation Error:", error);
        return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
    }
}
