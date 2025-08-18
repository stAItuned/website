import { NextResponse } from "next/server";
import { getApps, initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function db() {
  if (!getApps().length) {
    // In Firebase Functions usa ADC (Application Default Credentials)
    initializeApp({ credential: applicationDefault() });
  }
  return getFirestore();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  
  try {
    if (slug) {
      // Sanitize slug to match what's stored in Firestore
      const sanitizedSlug = slug
        .replace(/[/\\]/g, '-')
        .replace(/[^a-zA-Z0-9\-_]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Return data for specific article
  const snap = await db().collection('articles').doc(sanitizedSlug).get();
      if (snap.exists) {
        const data = snap.data();
        if (!data) {
          return NextResponse.json({
            success: false,
            error: 'No analytics data for this article',
            data: null,
            source: 'not_found',
          }, {
            status: 404,
            headers: { 
              "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60" 
            },
          });
        }
        return NextResponse.json({
          success: true,
          data: {
            pageViews: data.pageViews,
            users: data.users,
            sessions: data.sessions,
            avgTimeOnPage: data.avgTimeOnPage,
            bounceRate: data.bounceRate,
            updatedAt: data.updatedAt,
          },
          source: 'firestore',
        }, {
          headers: { 
            "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=600" // 1h cache
          },
        });
      } else {
        // Article not found in analytics
        return NextResponse.json({
          success: false,
          error: 'No analytics data for this article',
          data: null,
          source: 'not_found',
        }, {
          status: 404,
          headers: { 
            "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60" 
          },
        });
      }
    } else {
      // Return overall analytics summary
      const snap = await db().doc("analytics/daily").get();
      if (!snap.exists) {
        return NextResponse.json({
          success: false,
          error: 'No analytics summary found',
          data: null,
          source: 'not_found',
        }, {
          status: 404,
          headers: { 
            "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60" 
          },
        });
      }
      const data = snap.data();
      if (!data) {
        return NextResponse.json({
          success: false,
          error: 'No analytics summary found',
          data: null,
          source: 'not_found',
        }, {
          status: 404,
          headers: { 
            "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=60" 
          },
        });
      }
      return NextResponse.json({
        success: true,
        data: {
          totalStats: data.totalStats,
          topPages: data.topPages,
          updatedAt: data.updatedAt,
          dateRange: data.dateRange,
          date: data.date
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
