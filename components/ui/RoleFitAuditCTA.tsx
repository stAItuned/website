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

// Hook to track scroll percentage
function useScrollProgress() {
	const [scrollProgress, setScrollProgress] = useState(0)

	useEffect(() => {
		const handleScroll = () => {
			const totalScroll = document.documentElement.scrollTop
			const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
			const scroll = `${totalScroll / windowHeight}`
			setScrollProgress(Number(scroll))
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return scrollProgress
}

export function RoleFitAuditCTA({ variant = 'box', className = '' }: RoleFitAuditCTAProps) {
	const [isVisible, setIsVisible] = useState(variant === 'box')
	const [isBanned, setIsBanned] = useState(false)
	const [hasSessionDismissed, setHasSessionDismissed] = useState(false)
	const [bottomOffset, setBottomOffset] = useState(16)
	const pathname = usePathname()
	const scrollProgress = useScrollProgress()
	const isLearnArticleRoute = /^\/learn\/[^/]+\/[^/]+\/?$/.test(pathname ?? '')

	// Constants
	const TIME_TRIGGER_MS = 30000 // 30s
	const SCROLL_TRIGGER_PERCENT = 0.35 // 35%
	const STORAGE_KEY = 'staituned_audit_cta_storage'
	const BAN_DURATION_MS = 15 * 24 * 60 * 60 * 1000 // 15 days
	const MAX_DISMISSALS_PER_DAY = 2

	useEffect(() => {
		if (variant !== 'sticky') {
			trackRoleFitAuditCTAView(variant)
			return
		}

		try {
			const storage = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
			const now = Date.now()
			if (storage.banExpires && storage.banExpires > now) {
				const timer = window.setTimeout(() => setIsBanned(true), 0)
				return () => window.clearTimeout(timer)
			}
		} catch (e) {
			console.error('Error reading CTA storage', e)
		}
	}, [variant])

	// Logic to show sticky CTA based on time AND scroll
	const [timeConditionMet, setTimeConditionMet] = useState(false)

	useEffect(() => {
		if (variant !== 'sticky' || isBanned) return

		const timer = setTimeout(() => {
			setTimeConditionMet(true)
		}, TIME_TRIGGER_MS)

		return () => clearTimeout(timer)
	}, [variant, isBanned])

	useEffect(() => {
		if (variant !== 'sticky' || isBanned || isVisible || hasSessionDismissed) return

		if (timeConditionMet && scrollProgress > SCROLL_TRIGGER_PERCENT) {
			// Double check ban status just in case
			let timer: number | null = null
			try {
				const storage = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
				if (!storage.banExpires || storage.banExpires < Date.now()) {
					timer = window.setTimeout(() => {
						setIsVisible(true)
						trackRoleFitAuditCTAView(variant)
					}, 0)
				}
			} catch (e) {
				// Fallback to showing it
				timer = window.setTimeout(() => {
					setIsVisible(true)
					trackRoleFitAuditCTAView(variant)
				}, 0)
			}

			return () => {
				if (timer !== null) window.clearTimeout(timer)
			}
		}
	}, [timeConditionMet, scrollProgress, variant, isBanned, isVisible, hasSessionDismissed])

	// Keep CTA above any mobile bottom bars (e.g., MobileActionBar)
	useEffect(() => {
		if (variant !== 'sticky') return

		const updateOffset = () => {
			const bar = document.querySelector('[data-mobile-action-bar]')
			if (bar) {
				const { height } = bar.getBoundingClientRect()
				setBottomOffset(Math.round(height + 12))
				return
			}
			setBottomOffset(16)
		}

		updateOffset()

		const observer = typeof ResizeObserver !== 'undefined'
			? new ResizeObserver(updateOffset)
			: null
		const bar = document.querySelector('[data-mobile-action-bar]')
		if (bar && observer) observer.observe(bar)

		window.addEventListener('resize', updateOffset)

		return () => {
			observer?.disconnect()
			window.removeEventListener('resize', updateOffset)
		}
	}, [variant])

	const handleCTAClick = () => {
		trackRoleFitAuditCTAClicked('audit_start', variant)
	}

	const handleDismiss = () => {
		setIsVisible(false)
		setHasSessionDismissed(true)
		trackRoleFitAuditCTADismiss()

		if (variant === 'sticky') {
			try {
				const now = Date.now()
				const storage = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"dismissals": []}')

				// Clean up dismissals older than 24h
				const oneDayAgo = now - 24 * 60 * 60 * 1000
				const recentDismissals = (storage.dismissals || []).filter((ts: number) => ts > oneDayAgo)

				// Add current dismissal
				recentDismissals.push(now)

				let newState = { ...storage, dismissals: recentDismissals }

				// Check if limit reached
				if (recentDismissals.length >= MAX_DISMISSALS_PER_DAY) {
					newState.banExpires = now + BAN_DURATION_MS
					setIsBanned(true)
				}

				localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
			} catch (e) {
				console.error('Error updating CTA storage', e)
			}
		}
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
						<span className="text-xs font-semibold tracking-wide uppercase">GenAI Fit Check</span>
					</div>

					<h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
						Qual è il mio fit GenAI?
					</h3>
					<p className="text-lg text-slate-600 dark:text-slate-300 mb-6 max-w-lg">
						In 5 minuti ottieni il tuo <strong>Score 0-100</strong>, i gap chiari e un <strong>piano 7 giorni</strong> per muoverti subito.
					</p>

					<div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
						<Link
							href="/role-fit-audit"
							onClick={handleCTAClick}
							className="inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-slate-900 rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02]"
						>
							<span>Scopri il mio fit</span>
							<svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
							</svg>
						</Link>
					</div>
					<p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-500">
						5 minuti • Report PDF • Pagamento una tantum (<strong>richiedi il codice accesso gratuito</strong>)
					</p>
				</div>
			</div>
		)
	}

	if (variant === 'sticky') {
		if (!isVisible) return null
		if (pathname?.startsWith('/role-fit-audit')) return null
		if (isLearnArticleRoute) return null

		return (
			<AnimatePresence>
				{isVisible && (
					<motion.div
						initial={{ y: 100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 100, opacity: 0 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className={`fixed left-0 right-0 z-[70] flex justify-center pointer-events-none lg:hidden ${className}`}
						style={{ bottom: `calc(${bottomOffset}px + env(safe-area-inset-bottom))` }}
					>
						<div className="w-full max-w-2xl px-4 pointer-events-auto">
							<div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 ring-1 ring-white/10">
								<div className="absolute inset-0 opacity-20"
									style={{
										backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
										backgroundSize: '20px 20px'
									}}
								/>
								<div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl" />
								<div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />

								<div className="relative p-4">
									{/* Mobile: entire CTA tappable (save space) */}
									<Link
										href="/role-fit-audit"
										onClick={handleCTAClick}
										className="absolute inset-0 z-10 sm:hidden"
									>
										<span className="sr-only">Apri GenAI Fit Check</span>
									</Link>

									<button
										type="button"
										onClick={(e) => {
											e.preventDefault()
											e.stopPropagation()
											handleDismiss()
										}}
										className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors focus:outline-none"
										aria-label="Chiudi"
									>
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>

									<div className="flex items-center gap-3 pr-8 sm:pr-12">
										<div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
											<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
											</svg>
										</div>

										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2 mb-0.5 sm:mb-0">
												<p className="text-sm font-bold text-white leading-tight truncate">
													Qual è il mio fit GenAI?
												</p>
											</div>
											{/* Mobile Text */}
											<p className="block sm:hidden text-xs text-slate-300 mt-0 truncate">
												Score 0-100 • Gap • Piano 7gg
											</p>
											{/* Desktop Text */}
											<p className="hidden sm:block text-xs text-slate-300 mt-0.5">
												🎯 Score 0-100 • 🔍 Gap chiari • 📅 Piano 7 giorni
											</p>
											{/* <div className="mt-2 hidden sm:flex flex-wrap gap-1.5">
											<span className="rounded-full bg-slate-900/5 dark:bg-white/10 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-200">5 min</span>
											<span className="rounded-full bg-slate-900/5 dark:bg-white/10 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-200">PDF</span>
											<span className="rounded-full bg-slate-900/5 dark:bg-white/10 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-200">Piano 7 giorni</span>
										</div> */}
										</div>

										<svg
											className="ml-2 h-5 w-5 shrink-0 text-slate-400 sm:hidden"
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
											<span>Scopri il mio fit</span>
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
											</svg>
										</Link>
									</div>
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
