import { ImageResponse } from 'next/og'
import { allPosts } from '@/lib/contentlayer'
 
export const runtime = 'edge'
 
export const alt = 'stAItuned Article'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
export default async function Image({ params }: { params: Promise<{ target: string; slug: string }> }) {
  const { target, slug } = await params;
  
  // Find the article
  const article = allPosts.find((post) => 
    post.slug === slug && post.target?.toLowerCase() === target.toLowerCase()
  );
  
  if (!article) {
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: 'linear-gradient(to bottom right, #1e293b, #0f172a)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          Article Not Found
        </div>
      ),
      {
        ...size,
      }
    )
  }
 
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(to bottom right, #1e293b, #0f172a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: 80,
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 32, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2 }}>
            {article.target || 'Article'}
          </div>
          <div style={{ fontSize: 72, fontWeight: 'bold', lineHeight: 1.2, maxWidth: '90%' }}>
            {article.title}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 32 }}>
          <div style={{ color: '#60a5fa', fontWeight: 'bold' }}>stAItuned</div>
          {article.author && (
            <>
              <div style={{ color: '#94a3b8' }}>•</div>
              <div style={{ color: '#94a3b8' }}>{article.author}</div>
            </>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
