import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import path from 'path'
import { verifyCredential } from '@/lib/firebase/badge-service'
import { getAuthorData } from '@/lib/authors'
import { BADGE_DEFINITIONS } from '@/lib/config/badge-config'
import { getBadgeImageSource } from '@/lib/badges/badge-utils'

export const runtime = 'nodejs' // firebase-admin requires nodejs

/**
 * Generates the Open Graph image for a verified badge credential.
 */
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

    const baseUrl = new URL(request.url).origin
    const badgeImageSource = getBadgeImageSource(badgeDef.icon)
    const badgeImageUrl = new URL(badgeImageSource, baseUrl).toString()
    let badgeImageDataUrl = badgeImageUrl

    try {
        const badgeImagePath = path.join(process.cwd(), 'public', badgeImageSource.replace(/^\//, ''))
        const badgeImageBuffer = await readFile(badgeImagePath)
        badgeImageDataUrl = `data:image/png;base64,${badgeImageBuffer.toString('base64')}`
    } catch (error) {
        console.warn('[OG] Failed to read badge image locally, falling back to URL:', error)
    }

    const response = new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #020617 0%, #0f172a 55%, #020617 100%)',
                    color: 'white',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                    paddingTop: 40,
                    paddingLeft: 52,
                    paddingRight: 52,
                    paddingBottom: 44,
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
                        opacity: 0.9,
                    }}
                />

                {/* Main */}
                <div
                    style={{
                        display: 'flex',
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        paddingBottom: 28,
                    }}
                >
                    {/* Card (badge + credential ID, like zoom) */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 820,
                            padding: 18,
                            borderRadius: 48,
                            background: 'linear-gradient(180deg, rgba(30,41,59,0.94) 0%, rgba(15,23,42,0.94) 100%)',
                            boxShadow: '0 28px 80px rgba(0,0,0,0.65)',
                            border: '1px solid rgba(255,255,255,0.10)',
                        }}
                    >
                        <img
                            src={badgeImageDataUrl}
                            width={380}
                            height={418}
                            style={{
                                display: 'flex',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 28px 44px rgba(0,0,0,0.65))',
                            }}
                        />

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 12,
                                padding: '7px 16px',
                                borderRadius: 9999,
                                background: 'rgba(2,6,23,0.88)',
                                border: '1px solid rgba(148,163,184,0.35)',
                                color: 'rgba(148,163,184,1)',
                                fontFamily: 'monospace',
                                fontSize: 16,
                                letterSpacing: 1.1,
                                fontWeight: 800,
                            }}
                        >
                            {`ID ${badge.credentialId}`}
                        </div>
                    </div>

                    {/* Text below card */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 14,
                            textAlign: 'center',
                            maxWidth: 980,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 14,
                                color: 'rgba(147,197,253,0.92)',
                                fontWeight: 800,
                                letterSpacing: 3,
                                textTransform: 'uppercase',
                                marginBottom: 8,
                            }}
                        >
                            {`Awarded to ${authorName}`}
                        </div>
                        <div
                            style={{
                                fontSize: 40,
                                fontWeight: 900,
                                textShadow: '0 6px 14px rgba(0,0,0,0.35)',
                                lineHeight: 1.05,
                            }}
                        >
                            {badgeDef.name.en}
                        </div>
                        <div
                            style={{
                                marginTop: 8,
                                fontSize: 15,
                                color: 'rgba(148,163,184,0.95)',
                                lineHeight: 1.35,
                            }}
                        >
                            {badgeDef.description.en}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                        fontSize: 18,
                        color: 'rgba(255,255,255,0.55)',
                        position: 'relative',
                        paddingTop: 8,
                    }}
                >
                    <div>{date}</div>
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

    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
    return response
}
