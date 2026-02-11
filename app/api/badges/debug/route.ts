import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { allPosts } from '@/lib/contentlayer';
import { BADGE_DEFINITIONS } from '@/lib/config/badge-config';
import { calculateEligibleBadges } from '@/lib/badges/badge-calculator';
import { fetchMultipleArticlesAnalytics } from '@/lib/analytics-server';

export const dynamic = 'force-dynamic';

const CRON_SECRET = process.env.CRON_SECRET || 'dev-secret-key';
const QUALIFIED_READ_SECONDS = 30;
const REPORT_DIR = path.join(process.cwd(), 'tests', 'badge-debug');

interface DebugArticle {
    slug: string;
    title: string;
    url: string;
    publishedAt: string;
    topic?: string;
    analytics: {
        pageViews: number;
        avgTimeOnPage: number;
    };
}

interface ImpactDiagnostic {
    badgeId: string;
    threshold: number;
    qualifyingArticles: Array<{
        slug: string;
        pageViews: number;
        avgTimeOnPage: number;
    }>;
    qualifiedReadsTotal: number;
    meetsCriteria: boolean;
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
}

function formatSeconds(value: number): string {
    return `${Math.round(value)}s`;
}

function buildReport(params: {
    authorName: string;
    authorSlug: string;
    articleCount: number;
    qualifiedReadSeconds: number;
    impactDiagnostics: ImpactDiagnostic[];
    articles: DebugArticle[];
}): string {
    const { authorName, authorSlug, articleCount, qualifiedReadSeconds, impactDiagnostics, articles } = params;
    const generatedAt = new Date().toISOString();
    const sortedByViews = [...articles].sort((a, b) => b.analytics.pageViews - a.analytics.pageViews);
    const topArticles = sortedByViews.slice(0, 10);

    const lines: string[] = [
        '# Badge Debug Report',
        '',
        `Generated: ${generatedAt}`,
        `Author: ${authorName} (${authorSlug})`,
        `Articles: ${articleCount}`,
        `Qualified Read Rule: avgTimeOnPage >= ${qualifiedReadSeconds}s`,
        '',
        '## Impact Badge Diagnostics',
    ];

    if (impactDiagnostics.length === 0) {
        lines.push('', 'No impact badges configured.');
    }

    for (const diag of impactDiagnostics) {
        lines.push(
            '',
            `### ${diag.badgeId}`,
            `Threshold: ${formatNumber(diag.threshold)} qualified reads per article`,
            `Meets Criteria: ${diag.meetsCriteria ? 'YES' : 'NO'}`,
            `Qualified Articles: ${diag.qualifyingArticles.length}`,
            `Qualified Reads (sum of qualifying articles): ${formatNumber(diag.qualifiedReadsTotal)}`
        );

        if (diag.qualifyingArticles.length > 0) {
            lines.push('', 'Articles that qualify:');
            for (const article of diag.qualifyingArticles) {
                lines.push(
                    `- ${article.slug} · ${formatNumber(article.pageViews)} views · ${formatSeconds(article.avgTimeOnPage)} avgTimeOnPage`
                );
            }
        } else {
            lines.push('', 'No articles meet the per-article threshold.');
        }
    }

    lines.push('', '## Top Articles by Views (Top 10)');
    for (const article of topArticles) {
        lines.push(
            `- ${article.slug} · ${formatNumber(article.analytics.pageViews)} views · ${formatSeconds(article.analytics.avgTimeOnPage)} avgTimeOnPage`
        );
    }

    lines.push('', '## Notes');
    lines.push('- This report does not write or modify badges.');
    lines.push('- If analytics are missing, values will be zero.');

    return lines.join('\n');
}

/**
 * Debug badge computation for a specific author without writing to Firestore.
 */
export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    const { searchParams } = new URL(request.url);
    const authorParam = searchParams.get('author');
    const storeParam = searchParams.get('store');
    const shouldStore = storeParam !== '0' && storeParam !== 'false';

    if (!authorParam) {
        return NextResponse.json(
            { error: 'Missing author query param (use ?author=slug-or-name).' },
            { status: 400 }
        );
    }

    const uniqueAuthors = Array.from(new Set(
        allPosts
            .filter(post => post.published !== false && post.author)
            .map(post => post.author!)
    ));

    const normalizedParam = authorParam.toLowerCase();
    const authorName = uniqueAuthors.find((name) => {
        const normalizedName = name.toLowerCase();
        const slugName = normalizedName.replaceAll(' ', '-');
        return normalizedName === normalizedParam || slugName === normalizedParam;
    });

    if (!authorName) {
        return NextResponse.json(
            { error: `Author not found for "${authorParam}".` },
            { status: 404 }
        );
    }

    const authorSlug = authorName.replaceAll(' ', '-');
    const authorArticles = allPosts.filter(p => p.author === authorName && p.published !== false);
    const analyticsBySlug = await fetchMultipleArticlesAnalytics(authorArticles.map(a => a.slug));

    const articles: DebugArticle[] = authorArticles.map((article) => {
        const analytics = analyticsBySlug[article.slug] ?? { pageViews: 0, avgTimeOnPage: 0 };
        return {
            slug: article.slug,
            title: article.title,
            url: article.url,
            publishedAt: article.date,
            topic: article.topic,
            analytics: {
                pageViews: analytics.pageViews,
                avgTimeOnPage: analytics.avgTimeOnPage
            }
        };
    });

    const eligible = calculateEligibleBadges(
        { slug: authorSlug, articles },
        []
    );

    const impactBadges = BADGE_DEFINITIONS.filter(b => b.category === 'impact');
    const impactDiagnostics: ImpactDiagnostic[] = impactBadges
        .map((badgeDef) => {
            const threshold = badgeDef.thresholds.qualifiedReads ?? 0;
            if (!threshold) return null;
            const qualifyingArticles = articles
                .filter(
                    (art) =>
                        art.analytics.avgTimeOnPage >= QUALIFIED_READ_SECONDS &&
                        art.analytics.pageViews >= threshold
                )
                .map((art) => ({
                    slug: art.slug,
                    pageViews: art.analytics.pageViews,
                    avgTimeOnPage: art.analytics.avgTimeOnPage
                }));
            const qualifiedReadsTotal = qualifyingArticles.reduce((acc, art) => acc + art.pageViews, 0);
            return {
                badgeId: badgeDef.id,
                threshold,
                qualifyingArticles,
                qualifiedReadsTotal,
                meetsCriteria: qualifyingArticles.length > 0
            };
        })
        .filter((item): item is ImpactDiagnostic => item !== null);

    const report = buildReport({
        authorName,
        authorSlug,
        articleCount: articles.length,
        qualifiedReadSeconds: QUALIFIED_READ_SECONDS,
        impactDiagnostics,
        articles
    });

    let debugFilePath: string | null = null;
    let debugFileRelativePath: string | null = null;
    let debugFileBytes: number | null = null;

    if (shouldStore) {
        await fs.mkdir(REPORT_DIR, { recursive: true });
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `badge-debug-${authorSlug}-${timestamp}.md`;
        debugFilePath = path.join(REPORT_DIR, filename);
        debugFileRelativePath = path.join('tests', 'badge-debug', filename);
        await fs.writeFile(debugFilePath, report, 'utf8');
        const stats = await fs.stat(debugFilePath);
        debugFileBytes = stats.size;
    }

    return NextResponse.json({
        author: authorName,
        authorSlug,
        articleCount: articles.length,
        qualifiedReadSeconds: QUALIFIED_READ_SECONDS,
        report,
        debugFilePath,
        debugFileRelativePath,
        debugFileBytes,
        articles,
        impactDiagnostics,
        eligibleBadges: eligible.map(({ badge, evidence }) => ({
            badgeId: badge.badgeId,
            evidenceCount: evidence.length,
            evidenceArticles: badge.evidenceArticles,
            metrics: badge.metrics
        }))
    });
}
