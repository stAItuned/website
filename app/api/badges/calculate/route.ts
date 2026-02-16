import { NextRequest, NextResponse } from 'next/server';
import { allPosts } from '@/lib/contentlayer';
import { getAuthorBadges, awardBadge, markBadgeEmailPending } from '@/lib/firebase/badge-service';
import { fetchMultipleArticlesAnalytics } from '@/lib/analytics-server';
import { calculateEligibleBadges } from '@/lib/badges/badge-calculator';
import {
    BadgeArticleSource,
    buildWriterSlugLookup,
    mapFirestoreArticleToBadgeSource,
    mergeBadgeArticleSources,
    normalizeAuthorKey,
    resolveAuthorSlug,
} from '@/lib/badges/article-source';
import { dbDefault } from '@/lib/firebase/admin';
import { getPublicWritersList } from '@/lib/writer/firestore';
import { normalizeSlug } from '@/lib/validation/writerProfile';

export const dynamic = 'force-dynamic'; // Defaults to auto, but we want to ensure it runs dynamically if verified

import { verifyAdmin } from '@/lib/firebase/server-auth';

function normalizeTopic(value: unknown, fallback: unknown): string | undefined {
    if (typeof value === 'string' && value.trim().length > 0) return value;
    if (typeof fallback === 'string' && fallback.trim().length > 0) return fallback;
    return undefined;
}

function localPostToBadgeArticle(post: (typeof allPosts)[number]): BadgeArticleSource | null {
    if (post.published === false || !post.author) return null;

    return {
        slug: post.slug,
        title: post.title,
        author: post.author,
        url: post.url,
        publishedAt: post.date,
        topic: normalizeTopic((post as { topic?: unknown }).topic, post.primaryTopic),
    };
}

async function getPublishedBadgeArticlesFromFirestore(): Promise<BadgeArticleSource[]> {
    const collection = dbDefault().collection('articles');

    try {
        let docs = (await collection.where('published', '==', true).get()).docs;

        // Backward compatibility: some legacy docs may not have an explicit `published` field.
        if (docs.length === 0) {
            docs = (await collection.get()).docs;
        }

        return docs
            .map((doc) => mapFirestoreArticleToBadgeSource(doc.id, doc.data() as Record<string, unknown>))
            .filter((article): article is BadgeArticleSource => article !== null);
    } catch (error) {
        console.error('Failed to read Firestore articles for badge calculation, falling back to local posts:', error);
        return [];
    }
}

export async function POST(request: NextRequest) {
    const auth = await verifyAdmin(request);
    if (auth.error) {
        return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    let body: { author?: unknown } | null = null;
    try {
        body = (await request.json()) as { author?: unknown };
    } catch {
        body = null;
    }
    const specificAuthor = typeof body?.author === 'string' ? body.author.trim() : '';
    const normalizedSpecificAuthor = specificAuthor.length > 0 ? normalizeSlug(specificAuthor) : null;

    try {
        const localArticles = allPosts
            .map((post) => localPostToBadgeArticle(post))
            .filter((article): article is BadgeArticleSource => article !== null);
        const firestoreArticles = await getPublishedBadgeArticlesFromFirestore();
        const mergedArticles = mergeBadgeArticleSources(localArticles, firestoreArticles);
        const writers = await getPublicWritersList();
        const writerSlugLookup = buildWriterSlugLookup(writers);

        // 1. Get list of authors from merged article source.
        const uniqueAuthors = Array.from(new Set(mergedArticles.map((article) => article.author)));
        const targetAuthors = uniqueAuthors
            .map((authorName) => ({
                name: authorName,
                slug: resolveAuthorSlug(authorName, writerSlugLookup),
            }))
            .filter((authorEntry) =>
                normalizedSpecificAuthor ? authorEntry.slug === normalizedSpecificAuthor : true
            );

        const results = [];

        // 2. Iterate and Calculate
        for (const authorEntry of targetAuthors) {
            const authorName = authorEntry.name;
            const slug = authorEntry.slug;
            const existingBadges = await getAuthorBadges(slug);
            const existingIds = existingBadges.map(b => b.badgeId);
            const missingEmailStatus = existingBadges.filter(b => !b.emailStatus);

            // Build Context
            const authorArticles = mergedArticles.filter(
                (article) => normalizeAuthorKey(article.author) === normalizeAuthorKey(authorName)
            );
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
                        publishedAt: a.publishedAt,
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
            source: {
                localArticles: localArticles.length,
                firestoreArticles: firestoreArticles.length,
                mergedArticles: mergedArticles.length,
            },
            awards: results
        });

    } catch (error) {
        console.error("Badge Calculation Error:", error);
        return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
    }
}
