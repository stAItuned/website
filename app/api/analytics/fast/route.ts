import { NextResponse } from "next/server";
import {
  fetchArticleAnalytics,
  fetchGlobalAnalytics,
  fetchMultipleArticlesAnalytics,
} from '@/lib/analytics-server'
import { sanitizeSlug } from '@/lib/sanitizeSlug';

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const slugsParam = searchParams.get('slugs');

  try {
    if (slugsParam) {
      const slugs = slugsParam.split(',').map(s => sanitizeSlug(s.trim())).filter(Boolean);
      if (slugs.length === 0) {
        return NextResponse.json({ success: true, data: {} });
      }

      const results = await fetchMultipleArticlesAnalytics(slugs);

      return NextResponse.json({
        success: true,
        data: results,
        source: 'firestore-canonical-batch'
      }, {
        headers: {
          "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60"
        }
      });

    } else if (slug) {
      const sanitizedSlug = sanitizeSlug(slug);
      const data = await fetchArticleAnalytics(sanitizedSlug);
      return NextResponse.json({
        success: true,
        data,
        source: 'firestore-canonical',
      }, {
        headers: {
          "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=600"
        },
      });
    } else {
      const data = await fetchGlobalAnalytics()
      return NextResponse.json({
        success: true,
        data,
        source: 'firestore',
      }, {
        headers: {
          "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=600" // 1h cache, 24h stale
        }
      });
    }
  } catch (error) {
    console.error("analytics read error", error);

    // In test environments a missing Firestore database can surface as gRPC code 5 (NOT_FOUND).
    // Return safe zero values instead of hard failing the page.
    const code = (error as { code?: number | string } | null)?.code
    if (code === 5 || code === '5') {
      if (slugsParam) {
        const slugs = slugsParam.split(',').map(s => sanitizeSlug(s.trim())).filter(Boolean)
        const data = slugs.reduce<Record<string, {
          pageViews: number
          users: number
          sessions: number
          avgTimeOnPage: number
          bounceRate: number
          updatedAt: null
          likes: number
        }>>((acc, s) => {
          acc[s] = {
            pageViews: 0,
            users: 0,
            sessions: 0,
            avgTimeOnPage: 0,
            bounceRate: 0,
            updatedAt: null,
            likes: 0,
          }
          return acc
        }, {})

        return NextResponse.json({ success: true, data, source: 'firestore-not-found-fallback' })
      }

      if (slug) {
        return NextResponse.json({
          success: true,
          data: {
            pageViews: 0,
            users: 0,
            sessions: 0,
            avgTimeOnPage: 0,
            bounceRate: 0,
            updatedAt: null,
            likes: 0,
          },
          source: 'firestore-not-found-fallback',
        })
      }

      return NextResponse.json({
        success: true,
        data: {
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
        },
        source: 'firestore-not-found-fallback',
      })
    }

    return NextResponse.json({
      success: false,
      error: "Analytics temporarily unavailable",
      data: null,
      source: 'error',
    }, {
      status: 503,
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=60"
      },
    });
  }
}
