import { NextRequest, NextResponse } from 'next/server';
import { allPosts } from '@/lib/contentlayer';
import { getAuthorData } from '@/lib/authors';
import { getAuthorBadges, awardBadge, markBadgeEmailPending } from '@/lib/firebase/badge-service';
import { fetchMultipleArticlesAnalytics } from '@/lib/analytics-server';
import { calculateEligibleBadges } from '@/lib/badges/badge-calculator';

export const dynamic = 'force-dynamic'; // Defaults to auto, but we want to ensure it runs dynamically if verified

import { verifyAdmin } from '@/lib/firebase/server-auth';

export async function POST(request: NextRequest) {
    const auth = await verifyAdmin(request);
    if (auth.error) {
        return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const { author } = await request.json();
    const specificAuthor = author;

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
            const missingEmailStatus = existingBadges.filter(b => !b.emailStatus);

            // Build Context
            const authorArticles = allPosts.filter(p => p.author === authorName && p.published !== false);
            const analyticsBySlug = await fetchMultipleArticlesAnalytics(authorArticles.map(a => a.slug));

            // Transform articles to metrics format expected by calculator
            const context = {
                slug,
                articles: authorArticles.map(a => {
                    const analytics = analyticsBySlug[a.slug] ?? { pageViews: 0, avgTimeOnPage: 0 };
                    return {
                        slug: a.slug,
                        title: a.title,
                        url: a.url,
                        publishedAt: a.date,
                        topic: a.topic,
                        analytics: {
                            pageViews: analytics.pageViews,
                            avgTimeOnPage: analytics.avgTimeOnPage
                        }
                    };
                })
            };

            const eligible = calculateEligibleBadges(context, existingIds);

            if (missingEmailStatus.length > 0) {
                await Promise.all(
                    missingEmailStatus.map(badge => markBadgeEmailPending(slug, badge.badgeId))
                );
            }

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
