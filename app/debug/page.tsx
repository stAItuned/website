export default function DebugPage() {
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'SET' : 'NOT SET',
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
    GOOGLE_ANALYTICS_PROPERTY_ID: process.env.GOOGLE_ANALYTICS_PROPERTY_ID ? 'SET' : 'NOT SET',
    FB_SERVICE_ACCOUNT_KEY: process.env.FB_SERVICE_ACCOUNT_KEY ? 'SET' : 'NOT SET',
    // Client-side environment variables
    NEXT_PUBLIC_DISABLE_AUTH: process.env.NEXT_PUBLIC_DISABLE_AUTH || 'NOT SET',
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? 'SET' : 'NOT SET',
  }

  // Client-side check
  const clientDisableAuth = typeof window !== 'undefined' 
    ? process.env.NEXT_PUBLIC_DISABLE_AUTH 
    : 'SERVER_SIDE'

  const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Deployment Debug Info</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-3">Authentication Status</h2>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>NEXT_PUBLIC_DISABLE_AUTH:</span>
                <span className={`font-mono ${envVars.NEXT_PUBLIC_DISABLE_AUTH === 'true' ? 'text-green-600' : 'text-red-600'}`}>
                  {envVars.NEXT_PUBLIC_DISABLE_AUTH}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Client-side value:</span>
                <span className="font-mono">{clientDisableAuth}</span>
              </div>
              <div className="flex justify-between">
                <span>Authentication disabled:</span>
                <span className={`font-semibold ${isAuthDisabled ? 'text-green-600' : 'text-red-600'}`}>
                  {isAuthDisabled ? 'YES' : 'NO'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sign In button should show:</span>
                <span className={`font-semibold ${!isAuthDisabled ? 'text-green-600' : 'text-red-600'}`}>
                  {!isAuthDisabled ? 'YES' : 'NO'}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Environment Variables</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-sm">
              {JSON.stringify(envVars, null, 2)}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Test Routes</h2>
          <div className="space-y-2">
            <div>
              <a href="/api/analytics" className="text-blue-600 hover:underline">
                Test Analytics API
              </a>
            </div>
            <div>
              <a href="/api/content/articles/ai-for-breast-cancer-diagnosis/cover.webp" className="text-blue-600 hover:underline">
                Test Content API (Image)
              </a>
            </div>
            <div>
              <a href="/api/debug/filesystem" className="text-blue-600 hover:underline">
                Test Filesystem Debug
              </a>
            </div>
            <div>
              <a href="/meet" className="text-blue-600 hover:underline">
                Test Meet Page
              </a>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Known Issues & Fixes</h2>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <ul className="space-y-2 text-sm">
              <li>✅ Fixed: /meet/writers → /meet (404 error)</li>
              <li>⚠️ Image 503 errors: Check if content directory is available in deployment</li>
              <li>⚠️ Analytics caching: Requires Google Analytics environment variables</li>
              <li className={envVars.NEXT_PUBLIC_DISABLE_AUTH === 'true' ? 'text-green-600' : 'text-red-600'}>
                {envVars.NEXT_PUBLIC_DISABLE_AUTH === 'true' ? '✅' : '❌'} Auth disabled: {envVars.NEXT_PUBLIC_DISABLE_AUTH}
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Deployment Checklist</h2>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Ensure all environment variables are set in production</li>
              <li>Verify content directory is accessible (not in .gitignore)</li>
              <li>Check image domains are whitelisted in next.config.js</li>
              <li>Confirm Google Analytics service account has proper permissions</li>
              <li>Test the analytics caching configuration</li>
              <li><strong>Set NEXT_PUBLIC_DISABLE_AUTH in GitHub Secrets to &apos;true&apos;</strong></li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  )
}
