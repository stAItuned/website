'use client'

import { NewsletterSignup } from './NewsletterSignup'

interface NewsletterModalProps {
    isOpen: boolean
    onClose: () => void
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-md transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-2 shadow-2xl overflow-hidden">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                        aria-label="Chiudi"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <NewsletterSignup
                        variant="card"
                        source="homepage_midsection_modal"
                        className="!border-none !shadow-none !bg-transparent"
                    />
                </div>
            </div>
        </div>
    )
}
