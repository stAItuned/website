import { ImageResponse } from "next/server";
import { NextResponse } from "next/server";
// If allPosts is edge-safe in your build, you can import it to show real titles.
// import { allPosts } from "@/lib/contentlayer";

export const runtime = "edge"; // required for ImageResponse

function cleanSlug(s: string) {
  return s.replace(/\.png$/i, ""); // accept .../<slug>.png
}

// Optional: look up the post by slug (edge-safe only)
// function getPostTitle(slug: string) {
//   const post = allPosts.find(p => p.slug === slug);
//   return post?.seoTitle ?? post?.title ?? "stAItuned";
// }

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = cleanSlug(params.slug);
  const title = decodeURIComponent(slug).replace(/[-_]/g, " ");
  // const title = getPostTitle(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "#0b1221",
          color: "#fff",
        }}
      >
        <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1 }}>
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 28,
            opacity: 0.9,
          }}
        >
          <span>stAItuned • ARTICLE</span>
          <span>staituned.com</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "cache-control": "public, max-age=3600, must-revalidate",
        "x-og-generated": new Date().toISOString(),
      },
    }
  );
}

// So HEAD checks (curl -I / LinkedIn) return 200 with correct headers
export async function HEAD() {
  return new NextResponse(null, {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=3600, must-revalidate",
      "x-og-generated": new Date().toISOString(),
    },
  });
}
