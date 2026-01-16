import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
    // Brand colors
    const bgGradient = 'linear-gradient(to right bottom, #1A1E3B, #383F74)' // primary.600 to primary.500

    // We'll use a simple flex layout to center the logo
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: bgGradient,
                    // Add a subtle pattern if possible, or just the gradient
                }}
            >
                {/* We use an img tag with the absolute URL for the logo. 
            In production Next.js/Vercel handles this well.
            For robustness, we could read file, but simple img src usually works for public assets. 
            We point to the public asset. */}
                <img
                    src="https://staituned.com/assets/general/logo-text.png"
                    alt="stAItuned Logo"
                    style={{
                        width: '600px', // Large enough to be readable
                        objectFit: 'contain',
                    }}
                />
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    )
}
