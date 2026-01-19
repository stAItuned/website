'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import {
	trackRoleFitAuditCTAClicked,
	trackRoleFitAuditCTAView,
	trackRoleFitAuditCTADismiss
} from '@/lib/analytics/trackEvent'

interface RoleFitAuditCTAProps {
	variant?: 'box' | 'sticky'
	className?: string
}

export function RoleFitAuditCTA({ variant = 'box', className = '' }: RoleFitAuditCTAProps) {
	const [isVisible, setIsVisible] = useState(variant === 'box')
	const [isMounted, setIsMounted] = useState(false)
	const pathname = usePathname()

	useEffect(() => {
		setIsMounted(true)

		if (variant === 'box') {
			trackRoleFitAuditCTAView(variant)
		} else if (variant === 'sticky') {
			// Delay sticky banner by 30s to prioritize content reading
			const timer = setTimeout(() => {
				setIsVisible(true)
				trackRoleFitAuditCTAView(variant)
			}, 30000)
			return () => clearTimeout(timer)
		}
	}, [variant])

	if (!isMounted) return null

	const handleCTAClick = () => {
		trackRoleFitAuditCTAClicked('audit_start', variant)
	}

	const handleDismiss = () => {
		setIsVisible(false)
		trackRoleFitAuditCTADismiss()
	}

	if (variant === 'box') {
		if (pathname?.startsWith('/role-fit-audit')) return null

		return (
			<div className={`relative overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl ${className}`}>
				{/* Background Pattern */}
				<div
					className="absolute inset-0 opacity-[0.05] dark:opacity-[0.06]"
					style={{
						backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
						backgroundSize: '24px 24px'
					}}
				/>
				<div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-amber-400/25 via-fuchsia-400/10 to-indigo-400/10 blur-3xl" />
				<div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-gradient-to-tr from-indigo-400/20 via-sky-400/10 to-emerald-400/10 blur-3xl" />

				<div className="relative p-6 sm:p-8 flex flex-col items-center text-center">
					{/* Icon/Badge */}
					<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-4 py-2 text-slate-700 dark:text-slate-200 backdrop-blur">
						{/* Sparkles Icon */}
						<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
						</svg>
						<span className="text-xs font-semibold tracking-wide uppercase">Role Fit Audit</span>
					</div>

					<h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
						Sei posizionato bene per ruoli GenAI?
					</h3>
					<p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-lg">
						In 5 minuti ottieni un report PDF con score, gap chiari e un <strong>piano 7 giorni</strong> per muoverti subito.
					</p>

					<div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
						<Link
							href="/role-fit-audit"
							onClick={handleCTAClick}
							className="inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-slate-900 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02]"
						>
							<span>Fai il Role Fit Audit</span>
							<svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
							</svg>
						</Link>
					</div>
					<p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-500">
						5 minuti • Report PDF • Pagamento una tantum (se non hai un codice accesso)
					</p>
				</div>
			</div>
		)
	}

	if (variant === 'sticky') {
		if (!isVisible) return null
		if (pathname?.startsWith('/role-fit-audit')) return null

		return (
			<AnimatePresence>
				{isVisible && (
					<motion.div
						initial={{ y: 100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 100, opacity: 0 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className={`fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-lg ${className}`}
					>
						<div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/70 dark:border-slate-800 ring-1 ring-black/5">
							<div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.06]"
								style={{
									backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
									backgroundSize: '20px 20px'
								}}
							/>
							<div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-amber-400/25 via-fuchsia-400/10 to-indigo-400/10 blur-3xl" />
							<div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-gradient-to-tr from-indigo-400/20 via-sky-400/10 to-emerald-400/10 blur-3xl" />

							<div className="relative p-4">
								{/* Mobile: entire CTA tappable (save space) */}
								<Link
									href="/role-fit-audit"
									onClick={handleCTAClick}
									className="absolute inset-0 z-10 sm:hidden"
								>
									<span className="sr-only">Apri Role Fit Audit</span>
								</Link>

								<button
									type="button"
									onClick={(e) => {
										e.preventDefault()
										e.stopPropagation()
										handleDismiss()
									}}
									className="absolute right-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200/80 dark:border-slate-700 bg-white/90 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400/70"
									aria-label="Chiudi"
								>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>

								<div className="flex items-start gap-3 pr-10 sm:items-center sm:pr-0">
									<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/30">
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
										</svg>
									</div>

									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-2">
											<p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
												Scopri il tuo ruolo GenAI?
											</p>
										</div>
										<p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
											Score + gap chiari + piano 7 giorni
										</p>
										<div className="mt-2 hidden sm:flex flex-wrap gap-1.5">
											<span className="rounded-full bg-slate-900/5 dark:bg-white/10 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-200">5 min</span>
											<span className="rounded-full bg-slate-900/5 dark:bg-white/10 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-200">PDF</span>
											<span className="rounded-full bg-slate-900/5 dark:bg-white/10 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-200">Piano 7 giorni</span>
										</div>
									</div>

									<svg
										className="ml-1 h-5 w-5 shrink-0 text-slate-400 sm:hidden"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>

									<Link
										href="/role-fit-audit"
										onClick={handleCTAClick}
										className="hidden sm:inline-flex shrink-0 items-center gap-2 px-4 py-2 text-sm font-bold text-slate-900 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 transition-colors shadow-md shadow-amber-500/20"
									>
										<span>Vedi il report</span>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
										</svg>
									</Link>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		)
	}

	return null
}
