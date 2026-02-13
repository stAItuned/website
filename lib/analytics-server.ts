/**
 * Server-side analytics fetching utilities
 * 
 * These functions fetch analytics data during SSR/ISR to avoid client-side API calls.
 * This significantly reduces Cloud Function invocations and improves page load performance.
 */

import { dbDefault } from '@/lib/firebase/admin';
import { sanitizeSlug } from '@/lib/sanitizeSlug';
import { shouldSkipFirestoreDuringBuild } from '@/lib/next-phase';

export interface ArticleAnalytics {
  pageViews: number;
  users: number;
  sessions: number;
  avgTimeOnPage: number;
  bounceRate: number;
  likes: number;
  updatedAt: string | null;
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
    const snap = await dbDefault().collection('articles').doc(sanitizedSlug).get();
    
    if (snap.exists) {
      const data = snap.data();
      if (data) {
        return {
          pageViews: data.pageViews ?? 0,
          users: data.users ?? 0,
          sessions: data.sessions ?? 0,
          avgTimeOnPage: data.avgTimeOnPage ?? 0,
          bounceRate: data.bounceRate ?? 0,
          likes: data.likes ?? 0,
          updatedAt: data.updatedAt ?? null,
        };
      }
    }
    
    // Return zeros if not found
    return {
      pageViews: 0,
      users: 0,
      sessions: 0,
      avgTimeOnPage: 0,
      bounceRate: 0,
      likes: 0,
      updatedAt: null,
    };
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
    const sanitizedSlugs = slugs.map(slug => sanitizeSlug(slug));
    const results: Record<string, ArticleAnalytics> = {};
    
    // Fetch all in parallel for better performance
    const promises = sanitizedSlugs.map(async (sanitizedSlug, index) => {
      const originalSlug = slugs[index];
      const analytics = await fetchArticleAnalytics(originalSlug);
      results[originalSlug] = analytics;
    });
    
    await Promise.all(promises);
    
    return results;
  } catch (error) {
    console.error('Error fetching multiple articles analytics:', error);
    // Return empty object on error
    return {};
  }
}
