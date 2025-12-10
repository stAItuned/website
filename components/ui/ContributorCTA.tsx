'use client'

import { useState, FormEvent } from 'react'

interface ContributorCTAProps {
    /** Component variant style */
    variant?: 'card' | 'inline'
    /** Custom class for container */
    className?: string
    /** Source for analytics tracking */
    source?: string
}

/**
 * ContributorCTA - Call-to-action component inviting users to write for stAItuned
 * 
 * Variants:
 * - card: Full card with background (for article end/sidebar)
 * - inline: Compact horizontal layout
 */
export function ContributorCTA({
    variant = 'card',
    className = '',
    source = 'article',
}: ContributorCTAProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        linkedinUrl: '',
        expertise: '',
        bio: '',
    })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        // Basic validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.expertise.trim() || !formData.bio.trim()) {
            setStatus('error')
            setMessage('Please fill in all required fields.')
            return
        }

        setStatus('loading')
        setMessage('')

        try {
            const res = await fetch('/api/contributors/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    source,
                    website: '', // honeypot field
                }),
            })

            if (res.ok) {
                setStatus('success')
                setMessage('🎉 Application submitted! We\'ll be in touch soon.')
                setFormData({ name: '', email: '', linkedinUrl: '', expertise: '', bio: '' })
                setIsExpanded(false)
            } else {
                const data = await res.json().catch(() => ({}))
                setStatus('error')
                setMessage(data.error || 'Something went wrong. Please try again.')
            }
        } catch {
            setStatus('error')
            setMessage('Connection error. Please try again.')
        }
    }

    // Card variant (default - for article end)
    if (variant === 'card') {
        return (
            <div className={`rounded-2xl border-2 border-primary-200 dark:border-primary-800/50 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6 shadow-lg ${className}`}>
                {/* Header - always visible */}
                <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/50 mb-3">
                        <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        ✍️ Write for stAItuned
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-md mx-auto">
                        Got AI insights to share? Join our community of contributors and reach thousands of AI enthusiasts.
                    </p>
                </div>

                {/* Show success message if submitted */}
                {status === 'success' ? (
                    <div className="text-center py-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 mb-3">
                            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-green-600 dark:text-green-400 font-medium">{message}</p>
                    </div>
                ) : !isExpanded ? (
                    /* CTA Button - collapsed state */
                    <div className="text-center">
                        <button
                            onClick={() => setIsExpanded(true)}
                            className="px-6 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            Apply to Become a Contributor
                        </button>
                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                            Share your expertise • Build your audience • Join a growing community
                        </p>
                    </div>
                ) : (
                    /* Form - expanded state */
                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="contributor-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="contributor-name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                                required
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="contributor-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="contributor-email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                required
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* LinkedIn/Portfolio URL */}
                        <div>
                            <label htmlFor="contributor-linkedin" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                LinkedIn or Portfolio URL
                            </label>
                            <input
                                id="contributor-linkedin"
                                type="url"
                                name="linkedinUrl"
                                value={formData.linkedinUrl}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/in/yourprofile"
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* Expertise Areas */}
                        <div>
                            <label htmlFor="contributor-expertise" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Expertise Areas <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="contributor-expertise"
                                type="text"
                                name="expertise"
                                value={formData.expertise}
                                onChange={handleChange}
                                placeholder="e.g., LLMs, Computer Vision, AI Ethics..."
                                required
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition"
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* Bio / Why write */}
                        <div>
                            <label htmlFor="contributor-bio" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Tell us about yourself <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="contributor-bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Brief background and what topics you'd like to write about..."
                                required
                                rows={3}
                                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition resize-none"
                                disabled={status === 'loading'}
                            />
                        </div>

                        {/* Honeypot field - hidden from users */}
                        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

                        {/* Error message */}
                        {status === 'error' && (
                            <p className="text-sm text-red-500 text-center">{message}</p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsExpanded(false)}
                                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                disabled={status === 'loading'}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="flex-1 px-4 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 disabled:opacity-60 shadow-md transition"
                            >
                                {status === 'loading' ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        )
    }

    // Inline variant (compact)
    return (
        <div className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-primary-50 dark:bg-slate-800 border border-primary-100 dark:border-slate-700 ${className}`}>
            <div className="flex-1 text-center sm:text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    ✍️ Interested in writing for stAItuned?
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Share your AI expertise with our community
                </p>
            </div>
            <button
                onClick={() => setIsExpanded(true)}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary-600 text-white hover:bg-primary-500 transition whitespace-nowrap"
            >
                Apply Now
            </button>
        </div>
    )
}
