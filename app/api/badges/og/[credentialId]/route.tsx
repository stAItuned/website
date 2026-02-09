import { ImageResponse } from 'next/og'
import { verifyCredential } from '@/lib/firebase/badge-service'
import { getAuthorData } from '@/lib/authors'
import { BADGE_DEFINITIONS } from '@/lib/config/badge-config'

export const runtime = 'nodejs' // firebase-admin requires nodejs

export async function GET(request: Request, { params }: { params: Promise<{ credentialId: string }> }) {
    const { credentialId } = await params
    const badge = await verifyCredential(credentialId)

    if (!badge) {
        return new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        fontSize: 60,
                        color: 'white',
                        background: '#0f172a',
                        width: '100%',
                        height: '100%',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ fontSize: 40, marginBottom: 20 }}>stAItuned</div>
                    <div>Credential Not Found</div>
                </div>
            ),
            { width: 1200, height: 630 }
        )
    }

    const badgeDef = BADGE_DEFINITIONS.find(b => b.id === badge.badgeId)!
    const authorData = await getAuthorData(badge.authorId.replaceAll('-', ' '))
    const authorName = authorData?.name || badge.authorId
    const date = new Date(badge.earnedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    // Gradient definitions based on tier (simplified from keyframe/tailwind)
    const gradients: Record<string, string> = {
        contributor: 'linear-gradient(to bottom right, #1e3a8a, #0f172a)',
        bronze: 'linear-gradient(to bottom right, #78350f, #291d18)',
        silver: 'linear-gradient(to bottom right, #475569, #0f172a)',
        gold: 'linear-gradient(to bottom right, #b45309, #451a03)',
        special: 'linear-gradient(to bottom right, #0369a1, #1e1b4b)',
    }

    const bgGradient = gradients[badgeDef.tier] || gradients.contributor
    const borderColor = badgeDef.tier === 'gold' ? '#fbbf24' : badgeDef.tier === 'silver' ? '#e2e8f0' : '#3b82f6'

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    background: bgGradient,
                    color: 'white',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                }}
            >
                {/* Background Pattern */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2%, transparent 0%)',
                        backgroundSize: '50px 50px',
                    }}
                />

                {/* Border Frame */}
                <div
                    style={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        right: 20,
                        bottom: 20,
                        border: `2px solid rgba(255,255,255,0.1)`,
                        borderRadius: 20,
                    }}
                />

                {/* Logo */}
                <div style={{ position: 'absolute', top: 60, display: 'flex', fontSize: 24, fontWeight: 'bold', color: 'rgba(255,255,255,0.8)' }}>
                    st<span style={{ color: borderColor }}>AI</span>tuned.com
                </div>

                {/* Main Content */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>

                    {/* Badge Icon Mockup (Text based for simplicity in OG, effectively a big badge) */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 200,
                            height: 220,
                            background: 'rgba(255,255,255,0.05)',
                            border: `3px solid ${borderColor}`,
                            borderRadius: '20px', // simplified shape
                            marginBottom: 40,
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                        }}
                    >
                        <div style={{ fontSize: 80 }}>
                            {badgeDef.icon === 'contributor' ? '✍️' :
                                badgeDef.icon.includes('impact') ? '🚀' :
                                    badgeDef.icon.includes('writer') ? '📝' : '⭐'}
                        </div>
                    </div>

                    <div style={{ fontSize: 60, fontWeight: 900, textAlign: 'center', marginBottom: 10, textShadow: '0 4px 8px rgba(0,0,0,0.3)' }}>
                        {badgeDef.name.en}
                    </div>

                    <div style={{ fontSize: 32, color: 'rgba(255,255,255,0.8)', marginBottom: 40 }}>
                        Awarded to {authorName}
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    position: 'absolute',
                    bottom: 50,
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0 100px',
                    fontSize: 24,
                    color: 'rgba(255,255,255,0.5)'
                }}>
                    <div>{date}</div>
                    <div style={{ fontFamily: 'monospace' }}>{badge.credentialId}</div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', marginRight: 10 }} />
                        Verified
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    )
}
