import { NextResponse } from "next/server";
import { dbDefault } from "@/lib/firebase/admin";
import { sanitizeSlug } from '@/lib/sanitizeSlug';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const slugsParam = searchParams.get('slugs');

  try {
    if (slugsParam) {
      // Batch fetch mode
      const slugs = slugsParam.split(',').map(s => sanitizeSlug(s.trim())).filter(Boolean);
      const refs = slugs.map(s => dbDefault().collection('articles').doc(s));

      if (refs.length === 0) {
        return NextResponse.json({ success: true, data: {} });
      }

      // Use getAll for efficient batch retrieval of up to 30 items usually, but API allows varargs
      const snaps = await dbDefault().getAll(...refs);

      const results: Record<string, any> = {};

      snaps.forEach((snap, index) => {
        // We map back to the input slug (sanitized) to be safe, but usually we want to map back to the original request ID?
        // Let's rely on the doc ID executing correct mapping
        const originalSlug = slugs[index];
        if (snap.exists) {
          const data = snap.data();
          results[originalSlug] = {
            pageViews: data?.pageViews ?? 0,
            users: data?.users ?? 0,
            sessions: data?.sessions ?? 0,
            avgTimeOnPage: data?.avgTimeOnPage ?? 0,
            bounceRate: data?.bounceRate ?? 0,
            updatedAt: data?.updatedAt ?? null,
            likes: data?.likes ?? 0,
          };
        } else {
          results[originalSlug] = {
            pageViews: 0,
            users: 0,
            sessions: 0,
            avgTimeOnPage: 0,
            bounceRate: 0,
            updatedAt: null,
            likes: 0
          };
        }
      });

      return NextResponse.json({
        success: true,
        data: results,
        source: 'firestore-batch'
      }, {
        headers: {
          "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60"
        }
      });

    } else if (slug) {
      // Sanitize slug to match what's stored in Firestore
      const sanitizedSlug = sanitizeSlug(slug);

      // Return data for specific article
      const snap = await dbDefault().collection('articles').doc(sanitizedSlug).get();
      if (snap.exists) {
        const data = snap.data();
        if (!data) {
          return NextResponse.json({
            success: true,
            data: {
              pageViews: 0,
              users: 0,
              sessions: 0,
              avgTimeOnPage: 0,
              bounceRate: 0,
              updatedAt: null,
              likes: 0
            },
            source: 'not_found',
          }, {
            headers: {
              "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60"
            },
          });
        }
        return NextResponse.json({
          success: true,
          data: {
            pageViews: data.pageViews ?? 0,
            users: data.users ?? 0,
            sessions: data.sessions ?? 0,
            avgTimeOnPage: data.avgTimeOnPage ?? 0,
            bounceRate: data.bounceRate ?? 0,
            updatedAt: data.updatedAt ?? null,
            likes: data.likes ?? 0,
          },
          source: 'firestore',
        }, {
          headers: {
            "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=600" // 1h cache
          },
        });
      } else {
        // Article not found in analytics, return 0s for all metrics
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
          source: 'not_found',
        }, {
          headers: {
            "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60"
          },
        });
      }
    } else {
      // Return overall analytics summary
      const snap = await dbDefault().doc("analytics/daily").get();
      if (!snap.exists) {
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
            date: null
          },
          source: 'not_found',
        }, {
          headers: {
            "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60"
          },
        });
      }
      const data = snap.data();
      if (!data) {
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
            date: null
          },
          source: 'not_found',
        }, {
          headers: {
            "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60"
          },
        });
      }
      return NextResponse.json({
        success: true,
        data: {
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
          date: data.date ?? null
        },
        source: 'firestore',
      }, {
        headers: {
          "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=600" // 1h cache, 24h stale
        }
      });
    }
  } catch (error) {
    console.error("analytics read error", error);
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
