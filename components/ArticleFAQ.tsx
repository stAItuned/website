'use client'

import { useState } from 'react'
import { useLearnLocale, LearnLocaleToggle } from '@/lib/i18n'

interface FAQItem {
    question: string
    answer: string
    questionEn?: string
    answerEn?: string
}

interface ArticleFAQProps {
    faqs: FAQItem[]
}

export function ArticleFAQ({ faqs }: ArticleFAQProps) {
    const { locale } = useLearnLocale()
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    if (!faqs || faqs.length === 0) return null

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <div className="w-full max-w-3xl mx-auto my-16 px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                    Frequently Asked Questions
                </h2>

                {/* Global Locale Toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-1.5 rounded-xl">
                    <LearnLocaleToggle className="scale-110" />
                </div>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => {
                    // Use 'locale' from context (it matches 'en' | 'it')
                    // If content is missing in one language, fallback to the other?
                    // Current logic: EN uses En fields (fallback to question), IT uses question (default).
                    // But my data structure is: question (IT), answer (IT), questionEn (EN), answerEn (EN).
                    // So if locale is 'en': use questionEn || question.
                    // If locale is 'it': use question.

                    const question = locale === 'en' ? (faq.questionEn || faq.question) : faq.question
                    const answer = locale === 'en' ? (faq.answerEn || faq.answer) : faq.answer
                    const isOpen = openIndex === index

                    return (
                        <div
                            key={index}
                            className={`
                group rounded-2xl border transition-all duration-300 overflow-hidden
                ${isOpen
                                    ? 'bg-white dark:bg-slate-900/80 border-primary-200 dark:border-primary-900/50 shadow-lg shadow-primary-500/5'
                                    : 'bg-gray-50/50 dark:bg-slate-900/30 border-transparent hover:bg-white dark:hover:bg-slate-900/50 hover:border-gray-200 dark:hover:border-slate-800'
                                }
              `}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-5 text-left focus:outline-none select-none"
                                aria-expanded={isOpen}
                            >
                                <span className={`text-base sm:text-lg font-medium pr-8 transition-colors duration-300 ${isOpen ? 'text-primary-600 dark:text-primary-400' : 'text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                                    {question}
                                </span>
                                <span className={`
                  shrink-0 flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300
                  ${isOpen
                                        ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800 rotate-180'
                                        : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 group-hover:border-primary-300 dark:group-hover:border-primary-700'
                                    }
                `}>
                                    <svg
                                        className={`w-4 h-4 transition-colors ${isOpen ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-primary-500'}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>

                            <div
                                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                            >
                                <div className="overflow-hidden">
                                    <div className="px-5 pb-6 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-dashed border-gray-100 dark:border-slate-800/50 mt-2 pt-4">
                                        {answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Schema.org Injection (Hidden) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        'mainEntity': faqs.map(faq => ({
                            '@type': 'Question',
                            'name': faq.questionEn || faq.question,
                            'acceptedAnswer': {
                                '@type': 'Answer',
                                'text': faq.answerEn || faq.answer
                            }
                        }))
                    })
                }}
            />
        </div>
    )
}
