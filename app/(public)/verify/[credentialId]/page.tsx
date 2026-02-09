import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { verifyCredential } from '@/lib/firebase/badge-service'
import { getAuthorData } from '@/lib/authors'
import { BADGE_DEFINITIONS } from '@/lib/config/badge-config'
import { BadgeZoomModal } from '@/components/badges/BadgeZoomModal'
import { allPosts } from '@/lib/contentlayer'
import { BadgeShareControls } from '@/components/badges/BadgeShareControls'

interface PageProps {
    params: Promise<{
        credentialId: string
    }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { credentialId } = await params
    const badge = await verifyCredential(credentialId)

    if (!badge) {
        return {
            title: 'Credential Not Found - stAItuned',
        }
    }

    const badgeDef = BADGE_DEFINITIONS.find(b => b.id === badge.badgeId)
    const authorName = badge.authorId.replaceAll('-', ' ')

    return {
        title: `${badgeDef?.name.en} - ${authorName} - stAItuned Verification`,
        description: `Verify that ${authorName} has earned the ${badgeDef?.name.en} badge on stAItuned. Credential ID: ${badge.credentialId}`,
        openGraph: {
            images: [`/api/badges/og/${credentialId}`]
        }
    }
}

export default async function CredentialPage({ params }: PageProps) {
    const { credentialId } = await params
    const badge = await verifyCredential(credentialId)

    if (!badge) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Credential Not Found</h1>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    We could not verify a credential with ID <strong>{credentialId}</strong>. It may have been removed or the ID is incorrect.
                </p>
                <Link href="/" className="mt-8 px-6 py-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors">
                    Return Home
                </Link>
            </div>
        )
    }

    const badgeDef = BADGE_DEFINITIONS.find(b => b.id === badge.badgeId)!
    const authorData = await getAuthorData(badge.authorId.replaceAll('-', ' '))

    // Find evidence articles
    const evidenceArticles = allPosts.filter(p => badge.evidenceArticles?.includes(p.slug))

    // Format date
    const earnedDate = new Date(badge.earnedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Certificate Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">

                    {/* Redesigned Header with Prominent Badge */}
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                        </div>

                        {/* Decorative Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>

                        {/* Badge Container with Zoom */}
                        <div className="relative py-10 sm:py-12 flex flex-col items-center justify-center">
                            <BadgeZoomModal
                                badge={badgeDef}
                                earnedBadge={badge}
                                authorName={authorData?.name || badge.authorId}
                            />
                        </div>
                    </div>

                    <div className="pt-8 pb-8 px-6 sm:px-12 text-center">
                        {/* Title */}
                        <div className="space-y-1 mb-6">
                            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Certificate of Achievement</h2>
                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-serif">
                                {badgeDef.name.en}
                            </h1>
                        </div>

                        {/* Recipient */}
                        <div className="my-8 space-y-2">
                            <p className="text-slate-500 italic text-lg">Awarded to</p>
                            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-100 dark:border-slate-800">
                                {authorData?.avatar && (
                                    <img src={authorData.avatar} alt={authorData.name} className="w-8 h-8 rounded-full" />
                                )}
                                <span className="font-bold text-slate-900 dark:text-white text-lg">
                                    {authorData?.name || badge.authorId}
                                </span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 dark:border-slate-800 py-6 my-8 text-left">
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Credential ID</p>
                                <p className="font-mono text-sm font-medium text-slate-700 dark:text-slate-300 select-all">
                                    {badge.credentialId}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Issue Date</p>
                                <p className="font-medium text-slate-700 dark:text-slate-300">
                                    {earnedDate}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Issuer</p>
                                <p className="font-medium text-slate-700 dark:text-slate-300">stAItuned.com</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider">Status</p>
                                <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-sm font-bold bg-emerald-50 dark:bg-emerald-900/10 px-2 py-0.5 rounded-full">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Verified
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed mb-8">
                            {badgeDef.description.en}
                        </p>


                        {/* Evidence Section */}
                        {evidenceArticles.length > 0 && (
                            <div className="text-left border-t border-slate-100 dark:border-slate-800 pt-8">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                                    Evidence ({evidenceArticles.length})
                                </h3>
                                <ul className="space-y-3">
                                    {evidenceArticles.map(article => (
                                        <li key={article.slug}>
                                            <Link href={`/${article.slug}`} className="group block p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                                                <h4 className="font-medium text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-sm">
                                                    {article.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    Published on {new Date(article.date).toLocaleDateString()}
                                                </p>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 text-center border-t border-slate-200 dark:border-slate-800">
                        <div className="mb-6">
                            <BadgeShareControls credentialId={badge.credentialId} title={badgeDef.name.en} />
                        </div>
                        <Link href={`/author/${badge.authorId}`} className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline underline-offset-4">
                            View Author Profile &rarr;
                        </Link>
                    </div>
                </div>

                <div className="text-center text-slate-400 text-xs">
                    &copy; {new Date().getFullYear()} stAItuned. All rights reserved.
                </div>
            </div>
        </main>
    )
}
