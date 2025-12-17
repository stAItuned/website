'use client'

import Link from 'next/link'

/**
 * AziendeAuthority - "Chi ti affianca" section
 * Personal credibility: who works with you + why trust
 */
export function AziendeAuthority() {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
                {/* Text */}
                <div className="flex-1">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-3 dark:bg-blue-900/50 dark:text-blue-200">
                        👤 Chi ti affianca
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">
                        Lavori direttamente con gli esperti di stAI tuned.
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        Esperti in AI e GenAI, &amp; con una visione end-to-end di come integrare AI in PMI.
                        <br />
                        Approccio <strong className="text-slate-900 dark:text-slate-100">eval-driven</strong>: prima misuriamo qualità e impatto, poi parliamo di scalare.
                    </p>
                    {/* <Link
                        href="https://www.linkedin.com/in/daniele-moltisanti/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        <span>Vedi LinkedIn →</span>
                    </Link> */}
                </div>
            </div>
        </section>
    )
}
