'use client'

import { useState } from 'react'
import { event } from '@/lib/gtag'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { app } from '@/lib/firebase/client'

interface QuickFeedbackButtonProps {
  articleSlug: string
  articleTitle: string
}

export function QuickFeedbackButton({ articleSlug, articleTitle }: QuickFeedbackButtonProps) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null)
  const [customFeedback, setCustomFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const feedbackOptions = [
    { emoji: '😍', label: 'Loved it!', value: 'loved' },
    { emoji: '👍', label: 'Helpful', value: 'helpful' },
    { emoji: '🤔', label: 'Confusing', value: 'confusing' },
    { emoji: '❌', label: 'Not relevant', value: 'not_relevant' },
  ]

  const handleQuickFeedback = async (feedbackValue: string) => {
    setSelectedFeedback(feedbackValue)
    
    // Track in analytics
    event({
      action: 'quick_feedback',
      category: 'engagement',
      label: `${articleSlug}_${feedbackValue}`,
      value: 1
    })

    // Send to Telegram via API
    try {
      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'article_feedback',
          message: `Article: "${articleTitle}"\nFeedback: ${feedbackValue}\nSlug: ${articleSlug}`,
          page: window.location.href,
          userAgent: navigator.userAgent,
          consent: true,
          website: '' // honeypot
        })
      })

      if (!response.ok) {
        console.error('Error sending feedback to API:', response.statusText)
      }
    } catch (error) {
      console.error('Error sending feedback:', error)
    }

    // Also save to Firestore for analytics
    try {
      const db = getFirestore(app)
      await addDoc(collection(db, 'article_feedback'), {
        articleSlug,
        articleTitle,
        feedback: feedbackValue,
        timestamp: new Date().toISOString(),
        type: 'quick'
      })
    } catch (error) {
      console.error('Error saving to Firestore:', error)
    }

    // Show success for 2 seconds then close
    setSubmitted(true)
    setTimeout(() => {
      setShowFeedback(false)
      setSubmitted(false)
      setSelectedFeedback(null)
    }, 2000)
  }

  const handleCustomFeedback = async () => {
    if (!customFeedback.trim()) return

    setIsSubmitting(true)

    // Track in analytics
    event({
      action: 'custom_feedback',
      category: 'engagement',
      label: articleSlug,
      value: 1
    })

    // Send to Telegram via API
    try {
      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'article_feedback_custom',
          message: `Article: "${articleTitle}"\nCustom Feedback: ${customFeedback}\nSlug: ${articleSlug}`,
          page: window.location.href,
          userAgent: navigator.userAgent,
          consent: true,
          website: '' // honeypot
        })
      })

      if (!response.ok) {
        console.error('Error sending feedback to API:', response.statusText)
      }
    } catch (error) {
      console.error('Error sending feedback:', error)
    }

    // Also save to Firestore for analytics
    try {
      const db = getFirestore(app)
      await addDoc(collection(db, 'article_feedback'), {
        articleSlug,
        articleTitle,
        feedback: customFeedback,
        timestamp: new Date().toISOString(),
        type: 'custom'
      })

      setSubmitted(true)
      setTimeout(() => {
        setShowFeedback(false)
        setSubmitted(false)
        setCustomFeedback('')
      }, 2000)
    } catch (error) {
      console.error('Error saving feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Feedback Modal */}
      {showFeedback && (
        <div
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm animate-fade-in lg:hidden"
          onClick={() => !submitted && setShowFeedback(false)}
        >
          <div
            className="absolute bottom-24 left-4 right-4 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Thank you!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your feedback helps us improve
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    How was this article?
                  </h3>
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Quick Feedback Options */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {feedbackOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleQuickFeedback(option.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                        selectedFeedback === option.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-3xl">{option.emoji}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom Feedback */}
                <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Or share more details:
                  </label>
                  <textarea
                    value={customFeedback}
                    onChange={(e) => setCustomFeedback(e.target.value)}
                    placeholder="What could we improve?"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleCustomFeedback}
                    disabled={!customFeedback.trim() || isSubmitting}
                    className="w-full mt-3 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 text-white font-semibold rounded-xl transition-colors disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Feedback'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Feedback Button */}
      <button
        onClick={() => setShowFeedback(true)}
        className="fixed bottom-24 right-4 z-40 lg:hidden bg-primary-600 hover:bg-primary-700 text-white rounded-full p-4 shadow-2xl hover:scale-110 transition-transform active:scale-95"
        aria-label="Give feedback"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
    </>
  )
}
