/**
 * Server-side analytics fetching utilities
 * 
 * These functions fetch analytics data during SSR/ISR to avoid client-side API calls.
 * This significantly reduces Cloud Function invocations and improves page load performance.
 */

import { dbDefault, dbLegacyDefault } from '@/lib/firebase/admin';
import { sanitizeSlug } from '@/lib/sanitizeSlug';
import { shouldSkipFirestoreDuringBuild } from '@/lib/next-phase';
import type { DocumentData, DocumentSnapshot } from 'firebase-admin/firestore';

export interface ArticleAnalytics {
  pageViews: number;
  users: number;
  sessions: number;
  avgTimeOnPage: number;
  bounceRate: number;
  likes: number;
  updatedAt: string | null;
}

function resolvePageViews(data: Record<string, unknown> | undefined): number {
  if (!data) return 0
  const firstParty = data.pageViewsFirstParty
  if (typeof firstParty === 'number') return firstParty
  return 0
}

export interface GlobalAnalytics {
  totalStats: {
    pageViews: number;
    users: number;
    sessions: number;
    avgTimeOnPage: number;
    bounceRate: number;
  };
  topPages: Array<{
    path: string;
    pageViews: number;
    users: number;
  }>;
  updatedAt: string | null;
  dateRange: string | null;
  date: string | null;
}

type AnalyticsDocument = Record<string, unknown>;
type DailyArticlesStats = Record<string, Record<string, unknown>>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function resolveMetric(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function resolveUpdatedAt(value: unknown): string | null {
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString();
  return null;
}

function resolveDailyArticlesStats(data: DocumentData | undefined): DailyArticlesStats {
  const articlesStats = data?.articlesStats;
  if (!isRecord(articlesStats)) return {};

  return Object.entries(articlesStats).reduce<DailyArticlesStats>((acc, [key, value]) => {
    if (isRecord(value)) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

function pickDailyArticleStats(
  dailyData: DocumentData | undefined,
  slug: string,
  sanitizedSlug: string,
): AnalyticsDocument | undefined {
  const articlesStats = resolveDailyArticlesStats(dailyData);

  if (articlesStats[slug]) return articlesStats[slug];
  if (articlesStats[sanitizedSlug]) return articlesStats[sanitizedSlug];

  return undefined;
}

function buildArticleAnalytics(
  slug: string,
  articleData: AnalyticsDocument | undefined,
  mainDailyData: DocumentData | undefined,
  legacyArticleData: AnalyticsDocument | undefined,
  legacyDailyData: DocumentData | undefined,
): ArticleAnalytics {
  const sanitizedSlug = sanitizeSlug(slug);
  const mainDailyStats = pickDailyArticleStats(mainDailyData, slug, sanitizedSlug);
  const legacyDailyStats = pickDailyArticleStats(legacyDailyData, slug, sanitizedSlug);

  const gaSource = mainDailyStats ?? legacyDailyStats ?? articleData ?? legacyArticleData;

  return {
    pageViews: resolvePageViews(articleData),
    users: resolveMetric(gaSource?.users),
    sessions: resolveMetric(gaSource?.sessions),
    avgTimeOnPage: resolveMetric(gaSource?.avgTimeOnPage),
    bounceRate: resolveMetric(gaSource?.bounceRate),
    likes: resolveMetric(articleData?.likes),
    updatedAt:
      resolveUpdatedAt(articleData?.updatedAt) ??
      resolveUpdatedAt(mainDailyStats?.updatedAt) ??
      resolveUpdatedAt(mainDailyData?.updatedAt) ??
      resolveUpdatedAt(legacyDailyStats?.updatedAt) ??
      resolveUpdatedAt(legacyArticleData?.updatedAt) ??
      resolveUpdatedAt(legacyDailyData?.updatedAt),
  };
}

async function getOptionalDocData(
  fetcher: () => Promise<DocumentSnapshot<DocumentData>>,
): Promise<DocumentData | undefined> {
  try {
    const snap = await fetcher();
    return snap.exists ? snap.data() : undefined;
  } catch (error) {
    const code = (error as { code?: number | string } | null)?.code;
    if (code === 5 || code === '5') {
      return undefined;
    }
    throw error;
  }
}

/**
 * Fetch analytics for a specific article (server-side)
 * Use this in page.tsx server components during SSR/ISR
 */
export async function fetchArticleAnalytics(slug: string): Promise<ArticleAnalytics> {
  try {
    if (shouldSkipFirestoreDuringBuild()) {
      return {
        pageViews: 0,
        users: 0,
        sessions: 0,
        avgTimeOnPage: 0,
        bounceRate: 0,
        likes: 0,
        updatedAt: null,
      };
    }

    const sanitizedSlug = sanitizeSlug(slug);
    const [articleData, mainDailyData, legacyArticleData, legacyDailyData] = await Promise.all([
      getOptionalDocData(() => dbDefault().collection('articles').doc(sanitizedSlug).get()),
      getOptionalDocData(() => dbDefault().doc('analytics/daily').get()),
      getOptionalDocData(() => dbLegacyDefault().collection('articles').doc(sanitizedSlug).get()),
      getOptionalDocData(() => dbLegacyDefault().doc('analytics/daily').get()),
    ]);

    return buildArticleAnalytics(
      slug,
      articleData as AnalyticsDocument | undefined,
      mainDailyData,
      legacyArticleData as AnalyticsDocument | undefined,
      legacyDailyData,
    );
  } catch (error) {
    console.error('Error fetching article analytics server-side:', error);
    // Return zeros on error to avoid breaking the page
    return {
      pageViews: 0,
      users: 0,
      sessions: 0,
      avgTimeOnPage: 0,
      bounceRate: 0,
      likes: 0,
      updatedAt: null,
    };
  }
}

/**
 * Fetch global analytics (server-side)
 * Use this for homepage and overview pages
 */
export async function fetchGlobalAnalytics(): Promise<GlobalAnalytics> {
  try {
    if (shouldSkipFirestoreDuringBuild()) {
      return {
        totalStats: {
          pageViews: 0,
          users: 0,
          sessions: 0,
          avgTimeOnPage: 0,
          bounceRate: 0,
        },
        topPages: [],
        updatedAt: null,
        dateRange: null,
        date: null,
      };
    }

    const snap = await dbDefault().doc('analytics/daily').get();
    
    if (snap.exists) {
      const data = snap.data();
      if (data) {
        return {
          totalStats: {
            pageViews: data.totalStats?.pageViews ?? 0,
            users: data.totalStats?.users ?? 0,
            sessions: data.totalStats?.sessions ?? 0,
            avgTimeOnPage: data.totalStats?.avgTimeOnPage ?? 0,
            bounceRate: data.totalStats?.bounceRate ?? 0,
          },
          topPages: data.topPages ?? [],
          updatedAt: data.updatedAt ?? null,
          dateRange: data.dateRange ?? null,
          date: data.date ?? null,
        };
      }
    }
    
    // Return empty data if not found
    return {
      totalStats: {
        pageViews: 0,
        users: 0,
        sessions: 0,
        avgTimeOnPage: 0,
        bounceRate: 0,
      },
      topPages: [],
      updatedAt: null,
      dateRange: null,
      date: null,
    };
  } catch (error) {
    console.error('Error fetching global analytics server-side:', error);
    // Return empty data on error
    return {
      totalStats: {
        pageViews: 0,
        users: 0,
        sessions: 0,
        avgTimeOnPage: 0,
        bounceRate: 0,
      },
      topPages: [],
      updatedAt: null,
      dateRange: null,
      date: null,
    };
  }
}

/**
 * Fetch analytics for multiple articles (server-side)
 * Useful for list pages that show analytics for many articles
 */
export async function fetchMultipleArticlesAnalytics(
  slugs: string[]
): Promise<Record<string, ArticleAnalytics>> {
  try {
    if (shouldSkipFirestoreDuringBuild()) {
      return slugs.reduce<Record<string, ArticleAnalytics>>((acc, slug) => {
        acc[slug] = {
          pageViews: 0,
          users: 0,
          sessions: 0,
          avgTimeOnPage: 0,
          bounceRate: 0,
          likes: 0,
          updatedAt: null,
        };
        return acc;
      }, {});
    }

    const sanitizedSlugs = slugs.map((slug) => sanitizeSlug(slug));
    const mainRefs = sanitizedSlugs.map((slug) => dbDefault().collection('articles').doc(slug));
    const legacyRefs = sanitizedSlugs.map((slug) => dbLegacyDefault().collection('articles').doc(slug));

    const [mainArticleSnaps, mainDailyData, legacyArticleSnaps, legacyDailyData] = await Promise.all([
      mainRefs.length > 0 ? dbDefault().getAll(...mainRefs) : Promise.resolve([]),
      getOptionalDocData(() => dbDefault().doc('analytics/daily').get()),
      legacyRefs.length > 0 ? dbLegacyDefault().getAll(...legacyRefs) : Promise.resolve([]),
      getOptionalDocData(() => dbLegacyDefault().doc('analytics/daily').get()),
    ]);

    return slugs.reduce<Record<string, ArticleAnalytics>>((acc, slug, index) => {
      const articleData = mainArticleSnaps[index]?.exists ? mainArticleSnaps[index]?.data() : undefined;
      const legacyArticleData = legacyArticleSnaps[index]?.exists ? legacyArticleSnaps[index]?.data() : undefined;

      acc[slug] = buildArticleAnalytics(
        slug,
        articleData as AnalyticsDocument | undefined,
        mainDailyData,
        legacyArticleData as AnalyticsDocument | undefined,
        legacyDailyData,
      );
      return acc;
    }, {});
  } catch (error) {
    console.error('Error fetching multiple articles analytics:', error);
    // Return empty object on error
    return {};
  }
}
